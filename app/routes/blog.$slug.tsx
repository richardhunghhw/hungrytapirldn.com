/**
 * Blog page
 */

import { LoaderArgs, redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import { HTAppLoadContext } from '~/utils/types';
import { ContentStoreEntry, getContentByUrl } from '~/services/content-store';

// Fetch blog data content-store
export async function loader({
    request: { url },
    context,
    params,
}: LoaderArgs) {
    const htContext = context as HTAppLoadContext;
    try {
        const result = await getContentByUrl(htContext, new URL(url));
        console.log(`result ${JSON.stringify(htContext)}`);
        if (!result || !result.entryExists) {
            throw new Error('Entry not found');
        }
        return result;
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(htContext)) return redirect('/404');
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
