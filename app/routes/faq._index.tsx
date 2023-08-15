/**
 * FAQ list page
 */

import type { ContentStoreFaqEntry } from '~/services/content-store';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import type { loader as rootLoader } from '~/root';
import { getSeoMetas } from '~/utils/seo';

function FaqRow({ hostUrl, entry }: { hostUrl: string; entry: ContentStoreFaqEntry }) {
  const metadata = entry.metadata;
  return (
    <Link to={`${hostUrl}/faq/${entry.slug}`} className='flex flex-row justify-between py-6'>
      <span className='grow basis-0 text-xl'>{metadata?.title as string}</span>
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
  // Load additional data from parent loaders
  const matches = useMatches();
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  const data = matches.find((element: any) => element.id === 'routes/faq')?.data as ContentStoreFaqEntry[];

  // Get unique faq headings
  const faqHeadings = Array.from(new Set(data.map((faq) => faq.metadata.category))).sort();

  return (
    <>
      <div className='content-wrapper bg-ht-green-highlight'>
        <div className='content-container'>
          <h1 className='title title-section text-center'>Frequently Asked Questions</h1>
        </div>
      </div>
      <div className='content-wrapper'>
        <div className='content-container mx-4 my-8'>
          <ul className='divide-y divide-gray-800'>
            {faqHeadings.map((faqHeading) => {
              const heading = faqHeading.split('~')[1] as string;
              return (
                <li key={heading} className='pt-4'>
                  <h2 className='title text-2xl'>{heading}</h2>
                  <ul className='divide-y divide-gray-100'>
                    {data
                      ?.filter((faq) => faq.metadata.category === faqHeading)
                      .map((entry) => (
                        <li key={entry.slug}>
                          <FaqRow hostUrl={hostUrl} entry={entry} />
                        </li>
                      ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
