/**
 * Sitemap page, generated from the content-store data
 */

import type { LoaderArgs } from '@remix-run/cloudflare';
import { makeUrlFromContent } from '~/utils/content';

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
export async function loader({ context }: LoaderArgs) {
  const allContent = await context.services.content.listAll(context);
  const sitemapData: SitemapData = {
    hostname: context.env.HOST_URL,
    urls: allContent
      .map((content) => ({
        url: makeUrlFromContent(context.env.HOST_URL, content)!,
        lastMod: new Date().toISOString(),
        changeFreq: 'daily',
        priority: '0.6',
      }))
      .filter((entry) => entry.url !== undefined),
  };

  return new Response(generateSitemapXml(sitemapData), {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      'encoding': 'UTF-8',
    },
  });
}
