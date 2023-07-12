/**
 * Sitemap page, generated from the content-store data
 */

import { isProd } from '~/utils/misc';
import type { HTAppLoadContext, HTLoaderArgs } from '~/utils/types';

const generateRobotText = (context: HTAppLoadContext) => {
    if (isProd(context)) {
        return `
        User-agent: Googlebot
        Disallow: /nogooglebot/
    
        User-agent: *
        Allow: /
    
        Sitemap: ${context.HOST_URL}/sitemap.xml
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
