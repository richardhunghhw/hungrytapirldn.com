/**
 * Sitemap page, generated from the content-store data
 */

import type { HTAppLoadContext, HTLoaderArgs } from '~/utils/types';

const generateRobotText = ({ NODE_ENV, HOST_URL }: HTAppLoadContext) => {
    if (NODE_ENV === 'PROD') {
        return `
        User-agent: Googlebot
        Disallow: /nogooglebot/
    
        User-agent: *
        Allow: /
    
        Sitemap: ${HOST_URL}/sitemap.xml
        `;
    } else {
        return `
        User-agent: *
        Disallow: /
        `;
    }
};

// Fetch all content data from content-store
export async function loader({ context }: HTLoaderArgs) {
    return new Response(generateRobotText(context), {
        headers: {
            'content-type': 'text/plain',
        },
    });
}
