/**
 * Blog Layout
 */

import { type LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import * as Sentry from '@sentry/remix';
import { Outlet } from '@remix-run/react';
import { isProd } from '~/utils/misc';

// Fetch blog data content-store
export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const result = await context.services.content.listBlogs();
    if (!result || !result.length) {
      throw new Error('Blog Entries not found');
    }
    return result;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export default function BlogLayout() {
  return (
    <main className='flex min-h-screen flex-col'>
      <Outlet />
    </main>
  );
}
