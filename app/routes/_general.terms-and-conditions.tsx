/**
 * Terms and Conditions Page
 */

import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { MarkdownContent } from '~/components/markdown-content';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry } from '~/services/content-store/get-content';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';

export async function loader({ context }: HTActionArgs) {
  try {
    return getGeneralEntry(context, 'terms-and-conditions');
  } catch (error) {
    console.error(error); // TODO Sentry badlink
    if (isProd(context)) return redirect('/404');
    else return {};
  }
}

export default function TermsAndConditions() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return (
    <div className='prose prose-lg max-w-none'>
      <MarkdownContent data={pageData.data.general} />
    </div>
  );
}
