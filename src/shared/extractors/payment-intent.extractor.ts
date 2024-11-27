import Stripe from 'stripe';

export function extractPaymentIntent(event: Stripe.Event) {
  return event.data.object as Stripe.PaymentIntent;
}

export function extractStripeMetadata<T>(metadata: Stripe.Metadata) {
  return metadata as T;
}
