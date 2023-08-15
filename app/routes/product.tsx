/**
 * Product Layout
 */

import { redirect } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import { listProducts } from '~/services/content-store';
import type { HTActionArgs } from '~/utils/types';

// Fetch faq data content-store
export async function loader({ context }: HTActionArgs) {
  try {
    const result = await listProducts(context);
    if (!result || !result.length) {
      throw new Error('Product Entries not found');
    }
    return result;
  } catch (error) {
    console.error(error); // TODO badlink
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export default function ProductLayout() {
  return (
    <main className='flex min-h-screen flex-col'>
      <Outlet />
    </main>
  );
}
