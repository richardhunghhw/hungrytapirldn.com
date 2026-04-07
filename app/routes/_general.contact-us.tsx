/**
 * Contact Us Page
 */
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import * as Sentry from '@sentry/remix';
import { useLoaderData } from '@remix-run/react';
import type { MetaArgs } from '@remix-run/react';

import type { loader as rootLoader } from '~/root';
import { MarkdownContent } from '~/components/markdown-content';
import type { ContentStoreGeneralEntry } from '~/server/entities/content';
import { isProd } from '~/utils/misc';
import { getSeoMetas } from '~/utils/seo';

export function meta({ matches, location, data }: MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Contact Us | Hungry Tapir',
    // description: data?.metadata?.description, TODO SEO Description
  });
}

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    return context.services.content.getGeneralEntry('contact-us');
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (isProd(context)) return redirect('/404');
    else return {};
  }
}

export default function ContactUs() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return <MarkdownContent data={pageData.data.general} />;
}
