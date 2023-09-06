export type CartItem = {
  slug: string;
  quantity: number;
  stripeId?: string;
};

export type CartSessionData = {
  cart: Array<CartItem>;
};

export type CartFlashData = {
  success: string | undefined;
  error: string | undefined;
};
