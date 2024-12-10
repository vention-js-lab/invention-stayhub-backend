import { Injectable, BadRequestException } from '@nestjs/common';
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

  async createPaymentIntent(amount: number, metadata: PaymentIntentMetadata) {
    const paymentIntent = await this.stripeApiService.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { ...metadata },
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
