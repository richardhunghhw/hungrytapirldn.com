/**
 * Deliveries and Returns Page
 */
import type { ActionArgs, V2_MetaArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import type { loader as rootLoader } from '~/root';
import { MarkdownContent } from '~/components/markdown-content';
import type { ContentStoreGeneralEntry } from '~/server/entities/content';
import { getGeneralEntry } from '~/services/content-store/get-content';
import { isProd } from '~/utils/misc';
import { getSeoMetas } from '~/utils/seo';

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Deliveries and Returns | Hungry Tapir',
    // description: data?.metadata?.description, TODO SEO Description
  });
}

export async function loader({ context }: ActionArgs) {
  try {
    return getGeneralEntry(context, 'deliveries-and-returns');
  } catch (error) {
    console.error(error); // TODO Sentry badlink
    if (isProd(context)) return redirect('/404');
    else return {};
  }
}

export default function DeliveriesAndReturns() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return <MarkdownContent data={pageData.data.general} />;
}
