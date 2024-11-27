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
import { StripeItemsListReqDto } from '../dto/request/stripe-items.req';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { buildStripeLineItems } from '../helpers/stripe.helper';
import { StripeConfig } from '../types/stripe-config.type';
import { PaymentsService } from './payments.service';
import { BookingsService } from '#/modules/bookings/services/bookings.service';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';

@Injectable()
export class StripeService {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
    private accommodationsService: AccommodationService,
    @Inject('STRIPE') private stripe: Stripe,
    @Inject('STRIPE_CONFIG') private stripeConfig: StripeConfig,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async createCheckoutSession(
    accountId: string,
    stripeItemsListReqDto: StripeItemsListReqDto,
  ) {
    const { bookingId, items } = stripeItemsListReqDto;

    const existingBooking = await this.bookingsService.getBookingById(
      bookingId,
      accountId,
    );

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    const existingPaymentRecord = await this.paymentRepository.findOneBy({
      bookingId,
    });

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

    await this.paymentsService.createPaymentRecord({
      amount: amount,
      status: paymentStatus,
      transactionId: id,
      bookingId: bookingId,
    });

    await this.bookingsService.updateBookingStatus({
      bookingId,
      newStatus: BookingStatus.Upcoming,
    });

    await this.accommodationsService.updateAccommodationStatus({
      accommodationId,
      newStatus: false,
    });
  }
}
