/**
 * FAQ page
 */

import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs, HTAppLoadContext } from '~/utils/types';
import type { ContentStoreEntry } from '~/services/content-store';
import { getContentByUrl } from '~/services/content-store';

// Fetch faq data content-store
export async function loader({
    request: { url },
    context,
    params,
}: HTActionArgs) {
    try {
        const result = await getContentByUrl(context, new URL(url));
        if (!result || !result.entryExists) {
            throw new Error('Entry not found');
        }
        return result;
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(context)) return redirect('/404');
    }
    return null;
}

export default function Faq() {
    const faqData = useLoaderData<ContentStoreEntry>();
    if (!faqData || !faqData.data) return null;
    const faq = faqData.data.faq;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div>
                <h1 className="text-6xl font-bold">
                    {faq.Question.title[0].text.content}
                </h1>
                <div className="mt-4">
                    <div className="prose prose-lg">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: faq.Answer.rich_text[0].text.content,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
