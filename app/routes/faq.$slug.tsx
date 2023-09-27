/**
 * FAQ page
 */

import { type ActionArgs, redirect } from '@remix-run/cloudflare';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';
import * as Sentry from '@sentry/remix';

import { isProd } from '~/utils/misc';
import type { ContentStoreFaqEntry } from '~/server/entities/content';
import { validateRequest } from '~/utils/content';
import { ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '~/components/markdown-content';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: data?.metadata?.title ? data.metadata.title + ' | Hungry Tapir' : undefined,
    // description: data?.metadata?.description, TODO SEO Description
  });
}

export async function loader({ request: { url }, context, params }: ActionArgs) {
  // Fetch faq data from content-store
  const urlPath = validateRequest(new URL(url));
  const result = await context.services.content.getFaq(urlPath.slug);
  if (!result) {
    Sentry.captureMessage(`FAQ Entry not found for slug: ${urlPath.slug}`);
    return redirect('/faq');
  }
  return result;
}

export default function Faq() {
  const faqEntry = useLoaderData<ContentStoreFaqEntry>();
  if (!faqEntry || !faqEntry.data) return null;
  const faqContent = faqEntry.data.faq;

  return (
    <>
      <header className='content-wrapper bg-ht-green-highlight'>
        <div className='content-container'>
          <div className='title-section'>
            <Link to='/faq' className='title-section-backlink'>
              <ArrowLeft className='inline' /> Back to FAQs
            </Link>
            <h1>{faqEntry.metadata.slug}</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4'>
          <MarkdownContent data={faqContent} />
        </div>
      </article>
    </>
  );
}
