/**
 * Blog list page
 */

import { ContentStoreEntry } from '~/services/content-store';
import { Link as RemixLink, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '~/components/ui/badge';

type Metadata = {
    title: string;
    tags: string[];
};

function BlogRow({
    hostUrl,
    entry,
}: {
    hostUrl: string;
    entry: ContentStoreEntry;
}) {
    const metadata = entry.metadata;
    return (
        <RemixLink
            to={`${hostUrl}/Blog/${entry.slug}`}
            className="flex flex-row justify-between"
        >
            <span className="text-xl">{metadata?.title as string}</span>
            <ChevronRight />
        </RemixLink>
    );
}

export default function BlogIndex() {
    const matches = useMatches();
    if (!matches) {
        return null;
    }
    const loaderData =
        matches.find((element: any) => element.id === 'routes/blog')?.data ??
        [];

    const hostUrl = loaderData.host as string;
    const data = loaderData.data as ContentStoreEntry[];

    return (
        <div className="flex flex-col">
            <div className="content-wrapper bg-ht-turquoise">
                <div className="content-container">
                    <h1 className="title title-section text-center">Blog</h1>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="content-container my-16">
                    <ul role="list" className="divide-y divide-gray-100">
                        {data?.map((entry: ContentStoreEntry) => (
                            <li key={entry.slug} className="m-4 p-4">
                                <BlogRow hostUrl={hostUrl} entry={entry} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
