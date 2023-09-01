/**
 * Blog page
 */

import { type ActionArgs, redirect } from '@remix-run/cloudflare';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { ContentStoreBlogEntry } from '~/server/entities/content';
import { ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '~/components/markdown-content';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';
import { validateRequest } from '~/utils/content';

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: data?.metadata?.title ? data.metadata.title + ' | Hungry Tapir' : undefined,
    // description: data?.metadata?.description, TODO SEO Description
  });
}

export async function loader({ request: { url }, context, params }: ActionArgs) {
  // Fetch blog data content-store
  try {
    const urlPath = validateRequest(new URL(url));
    const result = await context.services.content.getBlog(urlPath.slug);
    if (!result) {
      // todo sentry error
      throw new Error('Entry not found');
    }
    return result;
  } catch (error) {
    console.error(error); // TODO badlink
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export default function Blog() {
  const blogData = useLoaderData<ContentStoreBlogEntry>();
  if (!blogData || !blogData.data) return null;
  const blogContent = blogData.data.blog;

  return (
    <>
      <header className='content-wrapper bg-ht-turquoise'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <Link to='/blog' className='text-base'>
              <ArrowLeft className='inline' /> Back to Blogs
            </Link>
            <h1 className='title text-center'>{blogData.metadata.title}</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4'>
          <MarkdownContent data={blogContent} />
        </div>
      </article>
    </>
  );
}
