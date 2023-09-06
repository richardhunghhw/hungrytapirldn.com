import type { Stripe as StripeApi } from 'stripe';
import type { Cart } from './cart';
import type { Content } from './content';

export class Stripe {
  #stripe: StripeApi;
  #hostUrl: string;
  #cart: Cart;
  #content: Content;

  constructor(hostUrl: string, stripe: StripeApi, cart: Cart, content: Content) {
    this.#hostUrl = hostUrl;
    this.#stripe = stripe;
    this.#cart = cart;
    this.#content = content;
  }

  async createCheckoutSession(orderId?: string) {
    const line_items = await Promise.all(
      this.#cart.cartContent
        .filter((item) => item.quantity > 0)
        .map(async (item) => {
          const product = await this.#content.getProduct(item.slug);
          return {
            price: product?.data.stripeId,
            quantity: item.quantity,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          };
        }),
    );

    return this.#stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${this.#hostUrl}/order/success?session_id={CHECKOUT_SESSION_ID}",`,
      cancel_url: `${this.#hostUrl}/cart/cancelled`,
      client_reference_id: orderId,

      allow_promotion_codes: true,
      consent_collection: {
        // promotions: 'auto', consent_collection.promotions` is not available in your country.
        // terms_of_service: 'required', You cannot collect consent to your terms of service unless a URL is set in the Stripe Dashboard. Update
      },
      // custom_fields:
      customer_creation: 'always',
      invoice_creation: {
        enabled: true,
      },
      locale: 'en',
      // payment_intent_data
      // payment_method_collection for bacs
      // payment_method_collection
      payment_method_types: ['card', 'paypal'],
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      // shipping_options:
      submit_type: 'pay',
    });
  }
}
