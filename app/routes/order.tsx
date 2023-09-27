import { type LoaderArgs, redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

/**
 * This loader needs to handle the following scenarios:
 * 1. User is redirected from Stripe with a session_id and status=success
 * 2. GET params of orderId and email
 * with No GET params, user is trying to access the page directly, show form
 */
export async function loader({
  request,
  context: {
    services: { dispatcher, stripe },
  },
}: LoaderArgs) {
  const url = new URL(request.url);

  // Scenario 1
  const status = url.searchParams.get('status');
  const sessionId = url.searchParams.get('sessionId');
  if (sessionId && status === 'success') {
    // Dispatch info to queue
    await dispatcher.dispatchStripeCart(sessionId);

    // Fetch additional order data from Stripe, redirect back to this page with orderId and email
    console.debug(`Fetching Stripe session ${sessionId}`);
    const stripeSession = await stripe.getSession(sessionId);
    const orderId = stripeSession.client_reference_id;
    const email = stripeSession.customer_details?.email;
    console.debug(`Retrieved Stripe session ${sessionId}, with orderId ${orderId} for user ${email}`, stripeSession);
    return redirect(`/order?orderId=${orderId}&email=${email}`);
  }

  // Scenario 2
  const orderId = url.searchParams.get('orderId');
  const email = url.searchParams.get('email');
  if (!orderId || !email) {
    // TODO fetch order data from DB
  }

  return {
    orderId,
    email,
  };
}

export default function Order() {
  const orderData = useLoaderData<typeof loader>();
  return (
    <main className='flex min-h-screen flex-col'>
      <header className='content-wrapper bg-ht-green'>
      <div className='content-container'>
          <div className='title-section text-center'>
            <h1>Thank you for your order</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4 flex flex-col font-mono text-base'>
          <p className='text-xl font-bold'>Thank you for your order. We will be in touch shortly.</p>
          <p>Order Reference: {orderData.orderId}</p>
          <p>Email: {orderData.email}</p>
        </div>
      </article>
    </main>
  );
}
