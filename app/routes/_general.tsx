import { redirect } from '@remix-run/cloudflare';
import {
    Outlet,
    RouteMatch,
    useLoaderData,
    useMatches,
} from '@remix-run/react';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneral } from '~/services/content-store';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';

export async function loader({
    request: { url: requestUrl },
    context,
}: HTActionArgs) {
    try {
        const url = new URL(requestUrl);
        const urlPath = url.pathname
            .split('/')
            .filter((x) => x)
            .map((x) => x.toLowerCase());
        if (urlPath.length !== 1) {
            throw new Error('Invalid request');
        }
        const result = await getGeneral(context, urlPath[0]);
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

export default function GeneralLayout() {
    const matches = useMatches();
    const outletEntry = matches.find(
        (route: RouteMatch) =>
            !new Set(['root', 'routes/_general']).has(route.id)
    );
    if (!outletEntry?.data) throw new Error('Invalid route');
    const outletData: ContentStoreGeneralEntry = outletEntry?.data;

    return (
        <div className="flex min-h-screen flex-col">
            <div className="content-wrapper bg-ht-yellow">
                <div className="content-container">
                    <div className="title-section flex flex-col">
                        <h1 className="title text-center">
                            {outletData.metadata.title}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="content-container mt-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
