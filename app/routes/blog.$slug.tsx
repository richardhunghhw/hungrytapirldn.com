/**
 * Blog page
 */

import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';
import type { ContentStoreEntry } from '~/services/content-store';
import { getContentByUrl } from '~/services/content-store';

// Fetch blog data content-store
export async function loader({
    request: { url },
    context,
    params,
}: HTActionArgs) {
    try {
        const result = await getContentByUrl(context, new URL(url));
        console.log(`result ${JSON.stringify(context)}`);
        if (!result || !result.entryExists) {
            throw new Error('Entry not found');
        }
        return result;
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(context)) return redirect('/404');
        return null;
    }
}

export default function Blog() {
    const blogData = useLoaderData<ContentStoreEntry>();
    if (!blogData || !blogData.data) return null;
    const blog = blogData.data.blog;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div>
                <h1 className="text-6xl font-bold">
                    {blog.Post.title[0].text.content}
                </h1>
                <div className="mt-4">
                    <div className="prose prose-lg">
                        {blog.Content.rich_text.map((line) => {
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: line.text.content,
                                }}
                            />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
