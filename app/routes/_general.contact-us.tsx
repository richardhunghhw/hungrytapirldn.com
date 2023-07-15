/**
 * Contact Us Page
 */

import { useLoaderData } from '@remix-run/react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry } from '~/services/get-general-entry';
import type { HTActionArgs } from '~/utils/types';

export async function loader({ context }: HTActionArgs) {
  return getGeneralEntry(context, 'contact-us');
}

export default function ContactUs() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return (
    <div className='prose prose-lg max-w-none'>
      {pageData.data.general.map((line, index) => (
        <ReactMarkdown key={index}>{line}</ReactMarkdown>
      ))}
    </div>
  );
}
