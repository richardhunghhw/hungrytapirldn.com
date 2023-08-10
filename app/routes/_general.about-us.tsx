/**
 * About Us Page
 */

import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry } from '~/services/content-store/get-content';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';

export async function loader({ context }: HTActionArgs) {
  try {
    return getGeneralEntry(context, 'about-us');
  } catch (error) {
    console.error(error); // TODO Sentry badlink
    if (isProd(context)) return redirect('/404');
    else return {};
  }
}

export default function AboutUs() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return (
    <div className='prose prose-lg max-w-none'>
      {pageData.data.general.map((line, index) => (
        <Markdown key={index}>{line}</Markdown>
      ))}
    </div>
  );
}
