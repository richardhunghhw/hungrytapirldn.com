/**
 * FAQ Layout
 */

import { redirect } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import { listFaqs } from '~/services/content-store';
import type { HTActionArgs } from '~/utils/types';

// Fetch faq data content-store
export async function loader({ context }: HTActionArgs) {
    try {
        const result = await listFaqs(context);
        if (!result || !result.length) {
            throw new Error('FAQ Entries not found');
        }
        return { host: context.HOST_URL, data: result };
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(context)) return redirect('/404');
    }
    return null;
}

export default function FaqLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
}
