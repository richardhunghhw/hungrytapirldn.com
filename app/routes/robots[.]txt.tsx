/**
 * Sitemap page, generated from the content-store data
 */

import type { HTAppLoadContext, HTLoaderArgs } from '~/utils/types';

const generateRobotText = ({ HOST_URL }: HTAppLoadContext) => {
    return `
    User-agent: Googlebot
    Disallow: /nogooglebot/

    User-agent: *
    Allow: /

    Sitemap: ${HOST_URL}/sitemap.xml
    `;
};

// Fetch all content data from content-store
export async function loader({ context }: HTLoaderArgs) {
    return new Response(generateRobotText(context), {
        headers: {
            'content-type': 'text/plain',
        },
    });
}
