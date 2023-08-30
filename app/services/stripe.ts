import type { AppLoadContext } from '@remix-run/cloudflare';
import Stripe from 'stripe';

export function getStripe({ env: { STRIPE_SECRET_KEY } }: AppLoadContext) {
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
    typescript: true,
  });
}
