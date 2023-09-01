import { json, type ActionArgs } from '@remix-run/cloudflare';
import * as Sentry from '@sentry/remix';

export async function action({
  request,
  context: {
    services: { cart },
  },
}: ActionArgs) {
  // Handle Add To Bag action
  const formData = await request.formData();

  // Validate form data TODO

  // Extract slug and quantity from form data
  const action = formData.get('action') as 'update' | 'remove';
  const slug = formData.get('slug') as string;
  const quantity = parseInt(formData.get(`${slug}-quantity-input`) as string);

  // Update cart
  if (action === 'remove') {
    cart.removeFromCart({ slug: slug, quantity: quantity });
  } else if (action === 'update') {
    cart.updateCart({ slug: slug, quantity: quantity });
  } else {
    Sentry.captureException(`Invalid cart action: ${action} for slug: ${slug} and quantity: ${quantity}`);
  }

  return json({ cart: cart.cartContent, state: 'success' });
}
