import type { Stripe as StripeApi } from 'stripe';
import * as Sentry from '@sentry/remix';

import type { Cart } from './cart';
import type { Content } from './content';

export class Stripe {
  #isProd: boolean;
  #stripe: StripeApi;
  #hostUrl: string;
  #cart: Cart;
  #content: Content;

  constructor(isProd: boolean, hostUrl: string, stripe: StripeApi, cart: Cart, content: Content) {
    this.#isProd = isProd;
    this.#hostUrl = hostUrl;
    this.#stripe = stripe;
    this.#cart = cart;
    this.#content = content;
  }

  async createCheckoutSession(orderId?: string) {
    console.debug('Creating Stripe checkout Session for order: ' + orderId);
    const line_items = await Promise.all(
      this.#cart.cartContent
        .filter((item) => item.quantity > 0)
        .map(async (item) => {
          const product = await this.#content.getProduct(item.slug);
          if (!product) {
            Sentry.captureException('Stripe createCheckoutSession called with invalid product: ' + item.slug);
            throw new Error('Product not found: ' + item.slug);
          }
          if (product.data.enabled === false) {
            Sentry.captureException('Stripe createCheckoutSession calleed with disabled product: ' + item.slug);
          }
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

    const collectionDateDropdownOptions: { label: any; value: any }[] = [
      {
        label: 'Delivery',
        value: 'delivery',
      },
    ];
    const nextStallDates = await this.#content.getNextStallDates(5);
    for (const stalldate of nextStallDates) {
      const location = await this.#content.getGeneralEntry('location~' + stalldate.data.location);
      collectionDateDropdownOptions.push({
        label:
          new Date(stalldate.data.startDT).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) +
          ' - ' +
          location.metadata.title,
        value: stalldate.slug.replaceAll('-', '').replaceAll('~', ''),
      });
    }

    // Delivery, Collection
    const shipping_options_str = this.#isProd
      ? 'shr_1NnP0XLNU8oiV5Bev3bHssY1,shr_1NnOzGLNU8oiV5Bewqa3y9fm'
      : 'shr_1NnP1vLNU8oiV5BetQqLrvNE,shr_1NnP2BLNU8oiV5BeRpGBof62';
    const shipping_options = shipping_options_str.split(',').map((id) => ({
      shipping_rate: id,
    }));

    const seessionParams = {
      line_items,
      mode: 'payment',
      success_url: `${this.#hostUrl}/order?status=success&session_id={CHECKOUT_SESSION_ID}",`,
      cancel_url: `${this.#hostUrl}/cart?status=cancelled`,
      client_reference_id: orderId,

      allow_promotion_codes: true,
      consent_collection: {
        // promotions: 'auto', consent_collection.promotions` is not available in your country.
        terms_of_service: 'required',
      },
      custom_fields: [
        {
          key: 'collectionDate',
          label: {
            custom: 'Collection Date - For delivery, select "Delivery"',
            type: 'custom',
          },
          type: 'dropdown',
          dropdown: {
            options: collectionDateDropdownOptions,
          },
        },
      ],
      // custom_text:
      customer_creation: 'always',
      invoice_creation: {
        enabled: true,
      },
      locale: 'en',
      // payment_intent_data
      // payment_method_collection for bacs
      // payment_method_collection
      payment_method_types: ['card'],
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      shipping_options,
      submit_type: 'pay',
    };
    return this.#stripe.checkout.sessions.create(seessionParams);
  }
}
