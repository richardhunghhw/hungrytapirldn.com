/**
 * FAQ page
 */

import { redirect } from '@remix-run/cloudflare';
import { Link, useLoaderData, useMatches } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';
import type { ContentStoreEntry } from '~/services/content-store';
import { validateRequest, getFaq } from '~/services/content-store';
import DOMPurify from 'dompurify';
import { ArrowLeft } from 'lucide-react';

// Fetch faq data content-store
export async function loader({
    request: { url },
    context,
    params,
}: HTActionArgs) {
    try {
        const urlPath = validateRequest(new URL(url));
        const result = await getFaq(context, urlPath.slug);
        if (!result || !result.entryExists) {
            throw new Error('FAQ Entry not found');
        }
        return result;
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(context)) return redirect('/404');
    }
    return null;
}

export default function Faq() {
    const matches = useMatches();
    const loaderData =
        matches.find((element: any) => element.id === 'routes/faq')?.data ?? [];
    const hostUrl = loaderData.host as string;

    const faqData = useLoaderData<ContentStoreEntry>();
    if (!faqData || !faqData.data) return null;
    const faq = faqData.data.faq;

    return (
        <div className="flex flex-col">
            <div className="content-wrapper bg-ht-yellow">
                <div className="content-container">
                    <div className="title-section flex flex-col">
                        <Link to={`${hostUrl}/faq`} className="text-base">
                            <ArrowLeft className="inline text-base" /> Back to
                            FAQs
                        </Link>
                        <h1 className="title text-center">
                            {faq.Question.title[0].text.content}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="content-container mt-4">
                    <div className="prose prose-lg">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    faq.Answer.rich_text[0].text.content
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
