import type { Cart } from './cart';
import type { Content } from './content';
import * as Sentry from '@sentry/remix';

export class ConversionDispatcher {
  #isDev: boolean;
  #queue: Queue<any>;
  #cart: Cart;
  #content: Content;

  constructor(isDev: boolean, queue: Queue<any>, cart: Cart, content: Content) {
    this.#isDev = isDev;
    this.#queue = queue;
    this.#cart = cart;
    this.#content = content;
  }

  async dispatchStripeCart(stripeSessionId: string) {
    console.log('ConversionDispatcher: dispatchStripeCart', stripeSessionId);

    const order_id = this.#cart.orderId;

    const order_line_items = await Promise.all(
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

    const stripe_session_id = this.#cart.checkoutSessionId;
    if (stripe_session_id !== stripeSessionId) {
      Sentry.captureException('Stripe createCheckoutSession called with invalid session id: ' + stripeSessionId);
      // throw new Error('Stripe createCheckoutSession called with invalid session id: ' + stripeSessionId);
      // TODO what do we do here
    }

    const message = {
      created: new Date().toISOString(),
      order_id,
      order_line_items,
      payment_channel: 'stripe',
      stripe_session_id,
    };

    // Queues are currently in Beta and are not supported in wrangler dev remote mode
    console.log(`ConversionDispatcher: ${JSON.stringify(message)}`);
    if (this.#isDev) {
      console.log('ConversionDispatcher: skipping queue send in dev mode');
    } else {
      await this.#queue.send(message, { contentType: 'json' });
    }
  }
}
