import { PaymentStatus } from '#/shared/constants/payment-status.constant';
import type Stripe from 'stripe';

export const PaymentIntentEventsMap = new Map<Stripe.Event.Type, PaymentStatus>([
  ['payment_intent.succeeded', PaymentStatus.Success],
  ['payment_intent.payment_failed', PaymentStatus.Declined],
  ['payment_intent.canceled', PaymentStatus.Canceled],
]);
