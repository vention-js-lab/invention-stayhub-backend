import Stripe from 'stripe';
import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  extractPaymentIntent,
  extractStripeMetadata,
} from '#/shared/extractors/payment-intent.extractor';
import { StripeCreateCheckoutReqDto } from '../dto/request/stripe-create-checkout.req';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { buildStripeLineItems } from '../helpers/stripe.helper';
import { StripeConfig } from '../types/stripe-config.type';
import { PaymentsService } from './payments.service';
import { BookingsService } from '#/modules/bookings/services/bookings.service';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';

@Injectable()
export class StripeService {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
    private accommodationsService: AccommodationService,
    @Inject('STRIPE') private stripe: Stripe,
    @Inject('STRIPE_CONFIG') private stripeConfig: StripeConfig,
  ) {}

  async createCheckoutSession(
    accountId: string,
    stripeCreateCheckoutReqDto: StripeCreateCheckoutReqDto,
  ) {
    const { bookingId, items } = stripeCreateCheckoutReqDto;

    const existingBooking = await this.bookingsService.getBookingById(
      bookingId,
      accountId,
    );

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    const existingPaymentRecord =
      await this.paymentsService.getPaymentRecordByBookingId(bookingId);

    if (
      existingPaymentRecord &&
      existingPaymentRecord.status === PaymentStatus.Success
    ) {
      throw new ConflictException('This booking has already been paid for');
    }

    const lineItems = buildStripeLineItems(items);
    const checkoutSession = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: this.stripeConfig.successUrl,
      cancel_url: this.stripeConfig.cancelUrl,
      payment_intent_data: {
        metadata: {
          bookingId,
          accountId,
          accommodationId: existingBooking.accommodationId,
        },
      },
    });

    return checkoutSession.url;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.stripeConfig.webhookSecret,
    );

    let paymentStatus: PaymentStatus = PaymentStatus.Pending;

    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentStatus = PaymentStatus.Success;
        break;

      case 'payment_intent.payment_failed':
        paymentStatus = PaymentStatus.Declined;
        break;

      case 'payment_intent.canceled':
        paymentStatus = PaymentStatus.Canceled;
        break;

      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    const { amount, id, metadata } = extractPaymentIntent(event);
    const { bookingId, accommodationId } = extractStripeMetadata<{
      bookingId: string;
      accommodationId: string;
    }>(metadata);

    await this.paymentsService.savePaymentRecord({
      amount: amount,
      status: paymentStatus,
      transactionId: id,
      bookingId: bookingId,
    });

    if (paymentStatus !== PaymentStatus.Success) {
      return;
    }

    await this.bookingsService.updateStatus({
      bookingId,
      newStatus: BookingStatus.Upcoming,
    });

    await this.accommodationsService.updateAvailability({
      accommodationId,
      newStatus: false,
    });

    return { received: true };
  }
}
