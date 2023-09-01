/**
 * Sitemap page, generated from the content-store data
 */

import type { AppLoadContext, LoaderArgs } from '@remix-run/cloudflare';
import { isProd } from '~/utils/misc';

const generateRobotText = (context: AppLoadContext) => {
  if (isProd(context)) {
    return `
        User-agent: Googlebot
        Disallow: /nogooglebot/
    
        User-agent: *
        Allow: /
        Disallow: /cart
        Disallow: /checkout
    
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
export async function loader({ context }: LoaderArgs) {
  return new Response(generateRobotText(context), {
    headers: {
      'content-type': 'text/plain',
    },
  });
}
