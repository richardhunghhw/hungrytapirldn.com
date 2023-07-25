/**
 * Deliveries and Returns Page
 */

import { useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry } from '~/services/get-general-entry';
import type { HTActionArgs } from '~/utils/types';

export async function loader({ context }: HTActionArgs) {
  return getGeneralEntry(context, 'deliveries-and-returns');
}

export default function DeliveriesAndReturns() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return (
    <div className='prose prose-lg max-w-none'>
      {pageData.data.general.map((line, index) => (
        <Markdown key={index}>{line}</Markdown>
      ))}
    </div>
  );
}
