import { redirect, type ActionArgs } from '@remix-run/cloudflare';
import { Form, Link, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';

import type { CartItem } from '~/server/entities/cart';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import { Button } from '~/components/ui/button';

export async function action({
  request,
  context: {
    env: { CONFIGSTORE_WORKER },
    services: { stripe },
  },
}: ActionArgs) {
  // Handle Cart checkout action

  // Get a unique order ID from worker
  let orderId: string | undefined = undefined;
  try {
    const response = await CONFIGSTORE_WORKER.fetch(request.clone());
    if (response.status !== 200) {
      throw new Error(`Failed to fetch order ID from worker. Status: ${response.status}`);
    }
    const responseBody: { orderId: string } = await response.json();
    orderId = responseBody.orderId;
    console.debug(`Fetched order ID from worker: ${orderId}`);
  } catch (error) {
    // TODO Sentry
    console.error('Failed to fetch order ID from worker, proceeding without an order ID.', error);
  }

  // Create checkout session
  const checkoutSession = await stripe.createCheckoutSession(orderId);
  if (!checkoutSession?.url) throw new Error('Unable to create Stripe Checkout Session.'); // TODO handle this better
  const checkoutUrl = checkoutSession.url;
  return redirect(checkoutUrl);
}

const CartInformation = ({ products, cart }: { products: ContentStoreProductEntry[]; cart: CartItem[] }) => {
  return (
    <ul className='-my-6 divide-y divide-gray-200'>
      {!cart || cart.length === 0 ? (
        <div className='mt-12 flex flex-1 flex-col justify-center'>
          <p className='title'>Your cart is empty</p>
        </div>
      ) : (
        cart.map((cartItem) => {
          // TODO optimise this
          const product = products.find((product) => product.slug === cartItem.slug);

          if (!product) {
            Sentry.captureException(`CartItem not found in Products: ${cartItem.slug}`);
            return null;
          }

          const lineTotal = (cartItem.quantity * product.data.price).toFixed(2);

          return (
            <li key={product.metadata.slug} className='flex py-6'>
              <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                <img
                  src={product.data.images[0].url}
                  alt={product.data.images[0].alt}
                  className='h-full w-full object-cover object-center'
                />
              </div>
              <div className='ml-4 flex flex-1 flex-col'>
                <div className='space-y-2'>
                  <div className='flex justify-between font-mono'>
                    <div className='text-base md:text-lg'>
                      <h3 className='title uppercase tracking-tight'>{product.metadata.title}</h3>
                      <p>{product.data.unit}</p>
                      <p>£{product.data.price.toFixed(2)}</p>
                    </div>
                    <div className='ml-4 flex flex-col items-end justify-between md:flex-row md:items-center md:space-x-12'>
                      <p>x{cartItem.quantity}</p>
                      <p>£{lineTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default function Cart() {
  const matches = useMatches();
  const rootLoaderData = matches.find((match) => match.id === 'root')?.data;

  const cart = rootLoaderData.cart as CartItem[];
  const products = rootLoaderData.products as ContentStoreProductEntry[];

  const cartSubTotal = cart
    .reduce((acc, cartItem) => {
      const product = products.find((product) => product.slug === cartItem.slug);
      if (!product) {
        Sentry.captureException(`CartItem not found in Products: ${cartItem.slug}`);
        return acc;
      }
      return acc + cartItem.quantity * product.data.price;
    }, 0)
    .toFixed(2);

  return (
    <main className='flex min-h-screen flex-col'>
      <header className='content-wrapper bg-ht-orange'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <h1 className='title text-center'>Your Cart</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4 flex flex-col space-y-4'>
          <CartInformation products={products} cart={cart} />
          <div className='flex flex-col space-y-2 self-end rounded-md border p-8 font-mono md:max-w-5xl'>
            <div className='flex justify-between'>
              <span>Subtotal</span> <span>£{cartSubTotal}</span>
            </div>
            <div className='flex justify-between font-bold'>
              <span>Total</span> <span>£{cartSubTotal} GBP</span>
            </div>
            <p>
              Tax included.{' '}
              <Button variant='link' asChild>
                <Link to='/deliveries-and-returns'>Shipping</Link>
              </Button>{' '}
              calculated at checkout.
            </p>
            <Form method='post'>
              <Button type='submit' className='w-full font-extralight uppercase'>
                Check out
              </Button>
            </Form>
          </div>
        </div>
      </article>
    </main>
  );
}
