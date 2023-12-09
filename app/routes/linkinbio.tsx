/**
 * linkinbio page for Socials, QR code...
 */
import { Link, useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import { promiseHash } from 'remix-utils';
import { json, type LoaderArgs, type V2_MetaArgs } from '@remix-run/cloudflare';
import * as Sentry from '@sentry/remix';

import SocialIcons from '~/components/social-icons';
import { Button } from '~/components/ui/button';
import { TapirTransparent } from '~/utils/svg/tapir';
import { NextStall } from '~/components/next-stall';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';

const LINKINBIO_LINKS = [
  { name: 'Website', to: '/', icon: undefined, cssOverride: undefined },
  {
    name: 'Pre-Order for Stall Collection / Delivery',
    to: '/product/the-pandan-kaya',
    icon: undefined,
    cssOverride: undefined,
  },
  { name: 'Blog', to: '/blog', icon: undefined, cssOverride: undefined },
  { name: 'FAQ', to: '/faq', icon: undefined, cssOverride: undefined },
  // {
  //   name: 'DELLI Market - IOS only!',
  //   to: '//delli.app.link/Uo9albLUl0-601hOCxLTAQ/hungrytapirldn',
  //   icon: undefined,
  //   cssOverride: 'text-ht-black bg-[#DBAF1F] hover:bg-[#DBAF1F] border-[#DBAF1F] hover:opacity-80',
  // },
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

export async function loader({
  context: {
    services: { content },
  },
}: LoaderArgs) {
  const stalldate = await content.getLatestStallDate();

  if (stalldate) {
    try {
      return json(
        await promiseHash({
          entry: content.getGeneralEntry('linkinbio'),
          stalldate,
          location: content.getGeneralEntry('location~' + stalldate.data.location),
        }),
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  return json(
    await promiseHash({
      entry: content.getGeneralEntry('linkinbio'),
      stalldate: undefined,
      location: undefined,
    }),
  );
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
            {pageData.stalldate && pageData.stalldate.data && (
              <NextStall
                startDT={pageData.stalldate.data.startDT}
                endDT={pageData.stalldate.data.endDT}
                location={pageData.location}
              />
            )}
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
