import { StripeItemReqDto } from '../dto/request/stripe-items.req';

export function buildStripeLineItems(items: StripeItemReqDto[]) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.description,
      },
      unit_amount: item.amount,
    },
    quantity: item.quantity,
  }));

  return lineItems;
}
