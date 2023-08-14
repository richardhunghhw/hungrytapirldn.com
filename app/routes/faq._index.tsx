/**
 * FAQ list page
 */

import type { ContentStoreEntry } from '~/services/content-store';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import type { loader as rootLoader } from '~/root';
import { getSeoMetas } from '~/utils/seo';

function FaqRow({ hostUrl, entry }: { hostUrl: string; entry: ContentStoreEntry }) {
  const metadata = entry.metadata;
  return (
    <Link to={`${hostUrl}/faq/${entry.slug}`} className='flex flex-row justify-between'>
      <span className='text-xl'>{metadata?.title as string}</span>
      <ChevronRight />
    </Link>
  );
}

export function meta({ matches, location, data }: V2_MetaArgs<unknown, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Frequently Asked Questions | Hungry Tapir',
    description:
      "Explore Hungry Tapir LDN's comprehensive FAQ page for all your questions about our delicious Kaya. From ingredients, shelf life, and vegan options to delivery, payment, and ordering details, we have answers to all your inquiries. Learn more about our commitment to quality, taste, and customer satisfaction.",
  });
}

export default function FaqIndex() {
  const matches = useMatches();
  if (!matches) {
    return null;
  }
  const loaderData = matches.find((element: any) => element.id === 'routes/faq')?.data ?? [];

  const hostUrl = loaderData.host as string;
  const data = loaderData.data as ContentStoreEntry[];

  return (
    <div className='flex flex-col'>
      <div className='content-wrapper bg-ht-green-highlight'>
        <div className='content-container'>
          <h1 className='title title-section text-center'>Frequently Asked Questions</h1>
        </div>
      </div>
      <div className='content-wrapper'>
        <div className='content-container my-16'>
          <ul role='list' className='divide-y divide-gray-100'>
            {data?.map((entry: ContentStoreEntry) => (
              <li key={entry.slug} className='m-4 p-4'>
                <FaqRow hostUrl={hostUrl} entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
