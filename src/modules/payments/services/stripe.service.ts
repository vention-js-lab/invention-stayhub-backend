import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CheckoutReqDto } from '../dto/request/checkout.req';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { PaymentsService } from './payments.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { BookingStatus } from '#/shared/constants/booking-status.constant';
import { StripeApiService } from './stripe-api.service';
import { PaymentIntentMetadata } from '../types/payment-intent-metadata.type';
import { extractPaymentIntent, extractStripeMetadata } from '../utils/stripe.util';
import { PaymentIntentEventsMap } from '../constants/payment-intent-events-map.constant';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
    private stripeApiService: StripeApiService,
    private configService: ConfigService<EnvConfig, true>,
  ) {}

  async createPaymentIntent(accountId: string, checkoutReqDto: CheckoutReqDto) {
    const { bookingId } = checkoutReqDto;

    const existingBooking = await this.bookingsService.getBookingById(bookingId, accountId);

    if (!existingBooking) {
      throw new BadRequestException('Booking does not exist');
    }

    const existingPayment = await this.paymentsService.getPaymentByBookingId(bookingId);

    if (existingPayment && existingPayment.status === PaymentStatus.Success) {
      throw new ConflictException('This booking has already been paid for');
    }

    const paymentIntent = await this.stripeApiService.stripe.paymentIntents.create({
      amount: checkoutReqDto.amount,
      currency: 'usd',
      metadata: {
        bookingId,
        accountId,
      },
    });

    return paymentIntent.client_secret;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (!signature) {
      throw new BadRequestException('No webhook signature header was provided');
    }

    if (!Buffer.isBuffer(rawBody)) {
      throw new BadRequestException('Invalid raw body: Expected a Buffer');
    }

    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET', { infer: true });
    let event: Stripe.Event;

    try {
      event = this.stripeApiService.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook signature verification failed');
    }

    const paymentStatus = PaymentIntentEventsMap.get(event.type) ?? PaymentStatus.Pending;
    const { amount, id, metadata } = extractPaymentIntent(event);
    const { bookingId } = extractStripeMetadata<PaymentIntentMetadata>(metadata);

    await this.paymentsService.savePayment({
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
  }
}
