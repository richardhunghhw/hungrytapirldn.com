import type { AppLoadContext } from '@remix-run/cloudflare';
import Stripe from 'stripe';

export function getStripe({ STRIPE_SECRET_KEY }: AppLoadContext) {
	return new Stripe(STRIPE_SECRET_KEY as string, {
		apiVersion: '2022-11-15',
		typescript: true,
	});
}
