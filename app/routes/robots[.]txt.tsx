/**
 * Sitemap page, generated from the content-store data
 */

import { LoaderArgs } from '@remix-run/cloudflare';
import { HTAppLoadContext } from '~/utils/types';

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
export async function loader({ context }: LoaderArgs) {
    const htContext = context as HTAppLoadContext;
    return new Response(generateRobotText(htContext), {
        headers: {
            'content-type': 'text/plain',
        },
    });
}
