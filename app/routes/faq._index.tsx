/**
 * FAQ list page
 */

import { ContentStoreEntry } from '~/services/content-store';
import { Link as RemixLink, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';

type Metadata = {
    title: string;
    tags: string[];
};

function FaqRow({
    hostUrl,
    entry,
}: {
    hostUrl: string;
    entry: ContentStoreEntry;
}) {
    const metadata = entry.metadata;
    return (
        <RemixLink
            to={`${hostUrl}/faq/${entry.slug}`}
            className="flex flex-row justify-between"
        >
            <span className="text-xl">{metadata?.title as string}</span>
            <ChevronRight />
        </RemixLink>
    );
}

export default function FaqIndex() {
    const matches = useMatches();
    if (!matches) {
        return null;
    }
    const loaderData =
        matches.find((element: any) => element.id === 'routes/faq')?.data ?? [];

    const hostUrl = loaderData.host as string;
    const data = loaderData.data as ContentStoreEntry[];

    return (
        <div className="flex flex-col">
            <div className="content-wrapper bg-ht-light-green">
                <div className="content-container">
                    <h1 className="title title-section text-center">
                        Frequently Asked Questions
                    </h1>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="content-container my-16">
                    <ul role="list" className="divide-y divide-gray-100">
                        {data?.map((entry: ContentStoreEntry) => (
                            <li key={entry.slug} className="m-4 p-4">
                                <FaqRow hostUrl={hostUrl} entry={entry} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
