import { type LoaderArgs, redirect } from '@remix-run/cloudflare';

export async function loader({
  request,
  context: {
    services: { dispatcher },
  },
}: LoaderArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const session_id = url.searchParams.get('session_id');
  console.log('session_id', session_id);
  console.log('status', status);

  // if (status !== 'success') {
  //   return redirect('/cart');
  // }

  await dispatcher.dispatchStripeCart(session_id);

  return null;
}

export default function Order() {
  return (
    <main className='flex min-h-screen flex-col'>
      <header className='content-wrapper bg-ht-green'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <h1 className='title text-center'>Thank you for your order</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4 flex flex-col'>
          <p>Thank you for your order. We will be in touch shortly.</p>
        </div>
      </article>
    </main>
  );
}
