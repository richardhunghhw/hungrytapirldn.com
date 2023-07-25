/**
 * linkinbio page for Socials, QR code...
 */
import { Link, useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import SocialIcons from '~/components/social-icons';

import { Button } from '~/components/ui/button';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
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

export async function loader({ context }: HTLoaderArgs) {
  return getGeneralEntry(context, 'linkinbio');
}

export default function FaqLayout() {
  const pageData = useLoaderData<ContentStoreGeneralEntry>();

  return (
    <div className='flex min-h-screen flex-col justify-center bg-ht-pink-highlight'>
      <div className='content-wrapper'>
        <div className='mx-auto max-w-screen-sm'>
          <div className='my-16 flex flex-col items-center space-y-8 font-mono'>
            <div className='flex flex-col items-center font-bold'>
              <TapirTransparent className='text-8xl' color='#1C1C1C' />
              <p className='text-sm'>@hungrytapirldn</p>
              <h1 className='title mt-4 text-center text-4xl tracking-tight md:text-6xl'>Hungry Tapir LDN</h1>
              <div className='mt-4 text-center text-base'>
                {pageData.data.general.map((line, index) => (
                  <Markdown key={index}>{line}</Markdown>
                ))}
              </div>
            </div>
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
