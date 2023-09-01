/**
 * FAQ Layout
 */

import { type ActionArgs, redirect } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
import { isProd } from '~/utils/misc';

// Fetch faq data content-store
export async function loader({ context }: ActionArgs) {
  try {
    const result = await context.services.content.listFaqs();
    if (!result || !result.length) {
      throw new Error('FAQ Entries not found');
    }
    return result;
  } catch (error) {
    console.error(error); // TODO badlink
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export default function FaqLayout() {
  return (
    <main className='flex min-h-screen flex-col'>
      <Outlet />
    </main>
  );
}
