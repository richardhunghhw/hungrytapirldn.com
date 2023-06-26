/**
 * Sitemap page, generated from the content-store data
 */

import { listAllContent, makeUrlFromContent } from '~/services/content-store';
import type { HTLoaderArgs } from '~/utils/types';

type SitemapData = {
    hostname: string;
    urls: {
        url: URL;
        lastMod: string;
        changeFreq: string;
        priority: string;
    }[];
};

const generateSitemapXml = (sitemapData: SitemapData) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    sitemapData.urls.forEach((entry) => {
        xml += `<url>\n`;
        xml += `<loc>${entry.url.toString()}</loc>\n`;
        xml += `<lastmod>${entry.lastMod}</lastmod>\n`;
        xml += `<changefreq>${entry.changeFreq}</changefreq>\n`;
        xml += `<priority>${entry.priority}</priority>\n`;
        xml += `</url>\n`;
    });

    xml += `</urlset>`;
    return xml;
};

// Generate sitemap manually
export async function loader({ context }: HTLoaderArgs) {
    let sitemapData: SitemapData;
    if (context.NODE_ENV === 'PROD') {
        sitemapData = {
            hostname: context.HOST_URL,
            urls: [
                {
                    url: new URL('/coming-soon', context.HOST_URL),
                    lastMod: new Date().toISOString(),
                    changeFreq: 'daily',
                    priority: '1.0',
                },
            ],
        };
    } else {
        const contentUrls = await listAllContent(context);
        sitemapData = {
            hostname: context.HOST_URL,
            urls: contentUrls.map((content) => ({
                url: makeUrlFromContent(context.HOST_URL, content),
                lastMod: new Date().toISOString(),
                changeFreq: 'daily',
                priority: '1.0',
            })),
        };
    }

    return new Response(generateSitemapXml(sitemapData), {
        headers: {
            'Content-Type': 'application/xml',
            'xml-version': '1.0',
            encoding: 'UTF-8',
        },
    });
}
