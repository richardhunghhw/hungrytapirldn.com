import type { SessionKv } from '~/server/repositories/session-kv';
import type { Session } from '@remix-run/cloudflare';
import type { CartFlashData, CartItem, CartSessionData } from '~/server/entities/cart';

export class Cart {
  #sessionKv: SessionKv<CartSessionData, CartFlashData>;
  #session: Session | null = null;
  cartContent: Array<CartItem> = [];
  checkoutSessionId: string | undefined;
  orderId: string | undefined;

  constructor(sessionKv: SessionKv<CartSessionData, CartFlashData>) {
    this.#sessionKv = sessionKv;
  }

  async init(request: Request) {
    this.#session = await this.#sessionKv.getSession(request.headers.get('Cookie') as string);
    const cartStr = this.#session.get('cart');
    this.cartContent = cartStr ? JSON.parse(cartStr) : [];
  }

  async addToCart(item: CartItem) {
    if (!this.#session) throw new Error('Session not initialized');

    const exisitingItem = this.cartContent.find((cartItem) => cartItem.slug === item.slug);
    if (exisitingItem) {
      exisitingItem.quantity += item.quantity;
    } else {
      this.cartContent.push(item);
    }
  }

  async removeFromCart(item: CartItem) {
    if (!this.#session) throw new Error('Session not initialized');

    const exisitingItem = this.cartContent.find((cartItem) => cartItem.slug === item.slug);
    if (exisitingItem) {
      exisitingItem.quantity -= item.quantity;
      if (exisitingItem.quantity <= 0) {
        this.cartContent = this.cartContent.filter((cartItem) => cartItem.slug !== item.slug);
      }
    }
    console.log(`removeFromCart: ${JSON.stringify(this.cartContent)}`);
  }

  async updateCart(item: CartItem) {
    if (!this.#session) throw new Error('Session not initialized');

    const exisitingItem = this.cartContent.find((cartItem) => cartItem.slug === item.slug);
    if (exisitingItem) {
      exisitingItem.quantity = item.quantity;
      if (exisitingItem.quantity <= 0) {
        this.cartContent = this.cartContent.filter((cartItem) => cartItem.slug !== item.slug);
      }
    } else {
      this.cartContent.push(item);
    }
    console.log(`updateCart: ${JSON.stringify(this.cartContent)}`);
  }

  async clearCart() {
    if (!this.#session) throw new Error('Session not initialized');

    this.cartContent = [];
  }

  async setCheckoutSession(checkoutSessionId: string, orderId?: string) {
    if (!this.#session) throw new Error('Session not initialized');

    this.checkoutSessionId = checkoutSessionId;
    this.orderId = orderId;
  }

  async commit() {
    if (!this.#session) throw new Error('Session not initialized');

    this.#session.set('cart', JSON.stringify(this.cartContent));
    return await this.#sessionKv.commitSession(this.#session);
  }
}
