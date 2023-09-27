/**
 * Blog list page
 */

import type { ContentStoreEntry } from '~/server/entities/content';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import type { loader as rootLoader } from '~/root';
import { getSeoMetas } from '~/utils/seo';

function BlogRow({ entry }: { entry: ContentStoreEntry }) {
  const metadata = entry.metadata;
  return (
    <Link to={`/blog/${entry.slug}`} className='flex flex-row justify-between'>
      <span className='text-xl'>{metadata?.title as string}</span>
      <ChevronRight />
    </Link>
  );
}

export function meta({ matches, location, data }: V2_MetaArgs<unknown, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Blog | Hungry Tapir',
    description:
      "Dive into Hungry Tapir LDN's blog and explore a world of flavors, traditions, and culinary insights. From delicious recipes featuring our signature Kaya to behind-the-scenes stories, cooking tips, and more, our blog offers a rich and engaging experience for food enthusiasts and Kaya lovers alike.",
  });
}

export default function BlogIndex() {
  // Load additional data from parent loaders
  const matches = useMatches();
  const data = matches.find((element: any) => element.id === 'routes/blog')?.data as ContentStoreEntry[];

  return (
    <>
      <div className='content-wrapper bg-ht-turquoise'>
        <div className='content-container'>
          <div className='title-section text-center'>
            <h1>Blog</h1>
          </div>
        </div>
      </div>
      <div className='content-wrapper'>
        <div className='content-container my-8 font-mono sm:my-16'>
          <ul className='divide-y divide-gray-100'>
            {data?.map((entry: ContentStoreEntry) => (
              <li key={entry.slug} className='m-4 py-4'>
                <BlogRow entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
