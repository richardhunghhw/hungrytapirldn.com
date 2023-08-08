/**
 * linkinbio page for Socials, QR code...
 */
import { Link, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import SocialIcons from '~/components/social-icons';

import { Button } from '~/components/ui/button';
import type { ContentStoreGeneralEntry, ContentStoreStallDateEntry } from '~/services/content-store';
import { getLatestStallDate } from '~/services/content-store/get-content';
import { getGeneralEntry } from '~/services/get-general-entry';
import { TapirTransparent } from '~/utils/svg/tapir';
import type { HTLoaderArgs } from '~/utils/types';

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

type LinkInBioLoaderData = {
  entry: ContentStoreGeneralEntry;
  stalldate: ContentStoreStallDateEntry;
};

export async function loader({ context }: HTLoaderArgs): Promise<LinkInBioLoaderData> {
  return {
    entry: await getGeneralEntry(context, 'linkinbio') as ContentStoreGeneralEntry,
    stalldate: await getLatestStallDate(context),
  };
}

function AddDaySuffix(date: string) {
  const day = parseInt(date.split(' ')[0]);
  let suffix;
  if (day > 3 && day < 21) {
    suffix = 'th';
  } else {
    switch (day % 10) {
      case 1:
        suffix = 'st';
      case 2:
        suffix = 'nd';
      case 3:
        suffix = 'rd';
      default:
        suffix = 'th';
    }
  }
  return day + suffix + date.substring(2);
}

function NextStallSection({ pageData: { stalldate } }: { pageData: LinkInBioLoaderData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Stall date information
  const stallStartDT = new Date(stalldate.data.startDT);
  const stallEndDT = new Date(stalldate.data.endDT);

  const stallStartDate = AddDaySuffix(
    stallStartDT.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
  );
  const stallStartTime = stallStartDT.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });

  const stallEndDate = AddDaySuffix(
    stallEndDT.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
  );
  const stallEndTime = stallEndDT.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div className='mt-4 rounded-md border-2 border-solid border-ht-black bg-ht-orange p-6 text-left font-bold'>
      <div className='flex flex-wrap justify-center'>
        <span className='mr-2 underline'>Next Stall</span>
        <span className='text-center'>
          {stallStartDate == stallEndDate ? (
            <>
              {stallStartTime} - {stallEndTime}, {stallEndDate}
            </>
          ) : (
            <>
              {stallStartTime}, {stallStartDate} - {stallEndTime}, {stallEndDate}
            </>
          )}
        </span>
      </div>
      <div className='mt-3 flex flex-wrap justify-center'>
        <span className='mr-2 underline'>Location</span>
        <span className='text-center'>BRADY ARTS & COMMUNITY CENTRE
192-196, Hanbury St, Whitechapel, E1 5HU</span>
      </div>
    </div>
  );
}

export default function LinkInBioLayout() {
  const pageData = useLoaderData<LinkInBioLoaderData>();

  return (
    <div className='flex min-h-screen flex-col justify-center bg-ht-pink-highlight'>
      <div className='content-wrapper'>
        <div className='mx-auto max-w-screen-sm'>
          <div className='mb-32 mt-16 flex flex-col items-center space-y-8 font-mono'>
            <div className='flex flex-col items-center font-bold'>
              <TapirTransparent className='text-8xl' color='#1C1C1C' />
              <p className='text-sm'>@hungrytapirldn</p>
              <h1 className='title mt-4 text-center text-4xl tracking-tight md:text-6xl'>Hungry Tapir LDN</h1>
              <div className='mt-4 text-center text-base'>
                {pageData.entry?.data.general.map((line, index) => (
                  <Markdown key={index}>{line}</Markdown>
                ))}
              </div>
            </div>
            <NextStallSection pageData={pageData} />
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
    </div>
  );
}
