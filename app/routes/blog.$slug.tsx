/**
 * Blog page
 */

import { redirect } from '@remix-run/cloudflare';
import { Link, useLoaderData, useMatches } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';
import type { ContentStoreBlogEntry } from '~/services/content-store';
import { getBlog, validateRequest } from '~/services/content-store';
import { ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '~/components/markdown-content';

// Fetch blog data content-store
export async function loader({ request: { url }, context, params }: HTActionArgs) {
  try {
    const urlPath = validateRequest(new URL(url));
    const result = await getBlog(context, urlPath.slug);
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
  const matches = useMatches();
  const loaderData = matches.find((element: any) => element.id === 'routes/blog')?.data ?? [];
  const hostUrl = loaderData.host as string;

  const blogData = useLoaderData<ContentStoreBlogEntry>();
  if (!blogData || !blogData.data) return null;
  const blogContent = blogData.data.blog;

  return (
    <div className='flex flex-col'>
      <div className='content-wrapper bg-ht-turquoise'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <Link to={`${hostUrl}/blog`} className='text-base'>
              <ArrowLeft className='inline' /> Back to Blogs
            </Link>
            <h1 className='title text-center'>{blogData.metadata.title}</h1>
          </div>
        </div>
      </div>
      <div className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4'>
          <div className='prose prose-lg max-w-none'>
            <MarkdownContent data={blogContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
