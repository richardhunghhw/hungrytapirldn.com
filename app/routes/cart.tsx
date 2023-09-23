import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useLoaderData, useMatches } from '@remix-run/react';
import { Angry, HeartCrack, ExternalLink } from 'lucide-react';
import * as Sentry from '@sentry/remix';

import type { CartItem } from '~/server/entities/cart';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

/**
 * This loader needs to validate:
 * 1. If a GET param of status=cancelled exists, and reset the cart checkout session
 * 2. If an exisiting checkout session exists in the cart
 */
export async function loader({
  request,
  context: {
    services: { cart },
  },
}: LoaderArgs): Promise<{ exisitingCheckoutError: boolean; checkoutSessionId?: string; orderId?: string }> {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  if (status === 'cancelled' || cart.checkoutSessionId) {
    const exisitiingSession = await cart.resetCheckoutSession();
    return { ...exisitiingSession, exisitingCheckoutError: true };
  }

  return { exisitingCheckoutError: false };
}

/**
 * This action needs to handle User submitting the checkout form
 */
export async function action({
  request,
  context: {
    env: { CONFIGSTORE_WORKER_URL },
    services: { cart, stripe, apiAuth },
  },
}: ActionArgs): Promise<{ emptyCartError: boolean }> {
  // Check if checkout session exists, reset if so

  // Check empty cart
  if (!cart.cartContent || cart.cartContent.length === 0) {
    return { emptyCartError: true };
  }

  // Get a unique order ID from worker
  let orderId: string | undefined = undefined;
  try {
    const response = await fetch(CONFIGSTORE_WORKER_URL + '/orderId', {
      method: 'POST',
      headers: { Authorization: apiAuth.getAuthString() },
    });
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch order ID from worker. Status: ${response.status}, message: ${response.statusText}`,
      );
    }
    const responseBody: { orderId: string } = await response.json();
    orderId = responseBody.orderId;
    // console.debug(`Fetched order ID from worker: ${orderId}`);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error occurred fetching orderId, proceeding without.', error);
  }

  // Create checkout session
  const checkoutSession = await stripe.createCheckoutSession(orderId);
  if (!checkoutSession?.url) throw new Error('Unable to create Stripe Checkout Session.'); // TODO handle this better

  // Save session to cart
  cart.setCheckoutSession(checkoutSession.id, orderId);

  // Redirect to checkout
  return redirect(checkoutSession.url);
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

  // const loaderData = useLoaderData();
  const actionData = useActionData();

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
        <div className='content-container mt-4 flex flex-col'>
          {/* {loaderData && loaderData.exisitingCheckoutError && (
            <Alert variant='success' className='mb-4'>
              <HeartCrack />
              <AlertTitle>Checkout {loaderData.orderId} cancelled!</AlertTitle>
              <AlertDescription>
                <Link to={`//checkout.stripe.com/c/pay/${loaderData.checkoutSessionId}`}>
                  Resume your checkout <ExternalLink className='inline h-4 w-4' />
                </Link>
              </AlertDescription>
            </Alert>
          )} */}
          {actionData && actionData.emptyCartError && (
            <Alert variant='error' className='mb-4'>
              <Angry />
              <AlertTitle>Your cart is empty!</AlertTitle>
              <AlertDescription>Add some more items to your cart before checking out.</AlertDescription>
            </Alert>
          )}
          <CartInformation products={products} cart={cart} />
          <div className='mt-8 flex flex-col space-y-2 self-end rounded-md border p-8 font-mono md:mt-12 md:max-w-5xl'>
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
              <Button type='submit' className='w-full font-extralight uppercase' disabled={!cart || cart.length === 0}>
                Check out
              </Button>
            </Form>
          </div>
        </div>
      </article>
    </main>
  );
}
