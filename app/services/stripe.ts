import Stripe from 'stripe';
import { HTAppLoadContext } from '~/utils/types';

export function getStripe({ STRIPE_SECRET_KEY }: HTAppLoadContext) {
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
    typescript: true,
  });
}
