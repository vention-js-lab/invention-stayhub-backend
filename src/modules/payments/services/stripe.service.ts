import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import { PaymentsService } from './payments.service';
import { BookingsService } from '#/modules/bookings/bookings.service';
import { StripeApiService } from './stripe-api.service';
import { PaymentIntentMetadata } from '../types/payment-intent-metadata.type';
import { extractPaymentIntent, extractStripeMetadata } from '../utils/stripe.util';
import { PaymentIntentEventsMap } from '../constants/payment-intent-events-map.constant';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';
import Stripe from 'stripe';
import { EmailService } from '#/modules/emails/email.service';
import { UsersService } from '#/modules/users/users.service';
import { readableDate } from '#/shared/utils/readable-date.util';
import { BookingStatus } from '#/shared/constants/booking-status.constant';

interface Booking {
  accommodation: { name: string };
  startDate: string | Date;
  endDate: string | Date;
}

@Injectable()
export class StripeService {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
    private stripeApiService: StripeApiService,
    private configService: ConfigService<EnvConfig, true>,
    private emailService: EmailService,
    private userService: UsersService,
  ) {}

  async handleWebhook(rawBody: Buffer, signature: string) {
    this.validateWebhookInput(rawBody, signature);

    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET', { infer: true });
    const event = this.verifyWebhookSignature(rawBody, signature, webhookSecret);

    const { paymentStatus, paymentData, accountId, bookingId } = this.extractWebhookData(event);

    await this.processPayment(paymentStatus, paymentData, bookingId, accountId);
  }

  async createPaymentIntent(amount: number, metadata: PaymentIntentMetadata) {
    const paymentIntent = await this.stripeApiService.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { ...metadata },
    });

    return paymentIntent.client_secret;
  }

  private validateWebhookInput(rawBody: Buffer, signature: string): void {
    if (!signature) {
      throw new BadRequestException('No webhook signature header was provided');
    }
    if (!Buffer.isBuffer(rawBody)) {
      throw new BadRequestException('Invalid raw body: Expected a Buffer');
    }
  }

  private verifyWebhookSignature(rawBody: Buffer, signature: string, webhookSecret: string): Stripe.Event {
    try {
      return this.stripeApiService.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  private extractWebhookData(event: Stripe.Event) {
    const paymentStatus = PaymentIntentEventsMap.get(event.type) ?? PaymentStatus.Pending;
    const { amount, id, metadata = {} } = extractPaymentIntent(event);
    const { bookingId } = extractStripeMetadata<PaymentIntentMetadata>(metadata);
    const accountId: string = (metadata as { accountId?: string }).accountId ?? '';

    if (!bookingId) {
      throw new BadRequestException('Booking ID is missing in the metadata');
    }

    return { paymentStatus, paymentData: { amount, id }, accountId, bookingId };
  }

  private async processPayment(
    paymentStatus: PaymentStatus,
    paymentData: { amount: number; id: string },
    bookingId: string,
    accountId: string,
  ) {
    await this.paymentsService.savePayment({
      amount: paymentData.amount,
      status: paymentStatus,
      transactionId: paymentData.id,
      bookingId: bookingId,
    });

    if (paymentStatus !== PaymentStatus.Success) {
      return;
    }

    await this.bookingsService.updateStatus(bookingId, { newStatus: BookingStatus.Upcoming });

    const booking = await this.bookingsService.getBookingById(bookingId, accountId);
    if (!booking) {
      throw new BadRequestException(`Booking with ID ${bookingId} not found`);
    }

    const { email: userEmail, firstName } = await this.userService.getUserEmailAndFirstNameByAccountId(accountId);
    if (!userEmail) {
      throw new BadRequestException(`User email not found for account ID ${accountId}`);
    }

    await this.sendPaymentConfirmationEmail(userEmail, firstName, booking, paymentData.amount);
  }

  private async sendPaymentConfirmationEmail(userEmail: string, userName: string | null, booking: Booking, amount: number) {
    const totalCost = `${amount}`;
    await this.emailService.sendMail({
      to: userEmail,
      subject: 'Payment Confirmation',
      userName: userName || 'Guest',
      accommodationName: booking.accommodation.name,
      bookingDates: `${readableDate(booking.startDate)} to ${readableDate(booking.endDate)}`,
      totalCost,
    });
  }
}
