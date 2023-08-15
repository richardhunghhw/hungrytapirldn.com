/**
 * linkinbio page for Socials, QR code...
 */
import { Link, useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import SocialIcons from '~/components/social-icons';

import { Button } from '~/components/ui/button';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry, getLatestStallDate } from '~/services/content-store/get-content';
import { TapirTransparent } from '~/utils/svg/tapir';
import type { HTLoaderArgs } from '~/utils/types';
import { NextStall } from '~/components/next-stall';
import type { V2_MetaArgs } from '@remix-run/cloudflare';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';

const LINKINBIO_LINKS = [
  // { name: 'Website', to: '/', icon: undefined, cssOverride: undefined },
  // { name: 'Blog', to: '/blog', icon: undefined, cssOverride: undefined },
  { name: 'FAQ', to: '/faq', icon: undefined, cssOverride: undefined },
  {
    name: 'Pre-Order for stall collection',
    to: '//buy.hungrytapirldn.com/',
    icon: undefined,
    cssOverride: undefined,
  },
  {
    name: 'DELLI - Order Online',
    to: '//delli.app.link/Uo9albLUl0-601hOCxLTAQ/hungrytapirldn',
    icon: undefined,
    cssOverride: 'text-ht-black bg-[#DBAF1F] hover:bg-[#DBAF1F] border-[#DBAF1F] hover:opacity-80',
  },
];

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: data?.metadata?.title ? data.metadata.title + ' | Hungry Tapir' : undefined,
    description:
      'Find all the latest links, socials and more from Hungry Tapir in one place. Follow us on @hungrytapirldn.',
  });
}

export async function loader({ context }: HTLoaderArgs) {
  const stalldate = await getLatestStallDate(context);
  const location = await getGeneralEntry(context, 'location~' + stalldate.data.location);
  // if (!location)
  // TODO Sentry error

  return {
    entry: (await getGeneralEntry(context, 'linkinbio')) as ContentStoreGeneralEntry,
    stalldate,
    location,
  };
}

export default function LinkInBio() {
  const pageData = useLoaderData<typeof loader>();

  return (
    <main className='flex min-h-screen flex-col justify-center bg-ht-pink-highlight'>
      <div className='content-wrapper'>
        <div className='mx-auto max-w-screen-sm'>
          <div className='mb-32 mt-16 flex flex-col items-center space-y-8 font-mono'>
            <header className='flex flex-col items-center font-bold'>
              <TapirTransparent className='text-8xl' color='#1C1C1C' />
              <p className='text-sm'>@hungrytapirldn</p>
              <h1 className='title mt-4 text-center text-4xl tracking-tight md:text-6xl'>Hungry Tapir LDN</h1>
              <div className='mt-4 text-center text-base'>
                {pageData.entry?.data.general.map((line, index) => (
                  <Markdown key={index}>{line}</Markdown>
                ))}
              </div>
            </header>
            <NextStall
              startDT={pageData.stalldate.data.startDT}
              endDT={pageData.stalldate.data.endDT}
              location={pageData.location}
            />
            <div className='flex w-full flex-col space-y-4'>
              {LINKINBIO_LINKS.map((link) => (
                <Button variant='dark' asChild key={link.to} className={link.cssOverride ? link.cssOverride : ''}>
                  <Link to={link.to} target='_blank' rel='noopener noreferrer' aria-label={link.name}>
                    {link.icon && <span className='flex-start'>{link.icon}</span>}
                    {link.name}
                  </Link>
                </Button>
              ))}
            </div>
            <div>
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
