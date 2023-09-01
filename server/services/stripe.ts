import type { Stripe as StripeApi } from 'stripe';

export class Stripe {
  #stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.#stripe = stripe;
  }

  async createCheckoutSession({
    lineItems,
    successUrl,
    cancelUrl,
  }: {
    lineItems: StripeApi.Checkout.SessionCreateParams.LineItem[];
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.#stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }
}
