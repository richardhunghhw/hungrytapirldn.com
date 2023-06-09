/**
 * The client used to interact with KV content-store (CS)
 * - Fetch data from CS, given type and slug
 * - Fetch data from CS, given type (blog, faq, products)
 * - Fetch all data from CS
 * - Purge & Rebuild CS using Notion service
 */

import { HTAppLoadContext, JSONValue } from '~/utils/types';
import { queryDbByType, queryDbByTypeSlug } from '../notion';
import {
    getAllKeysByType,
    getEntry,
    purgeEntriesByType,
    putEntry,
} from './kv-cache';

export type ContentType = 'blog' | 'faq' | 'product';

export type ContentStoreEntry = {
    data?: { [key in ContentType]: JSONValue };
    slug?: string;
    entryExists: boolean;
    cacheHit: boolean;
};

function isContentType(str: string): str is ContentType {
    return ['blog', 'faq', 'product'].includes(str);
}

type UrlPath = {
    type: ContentType;
    slug: string;
};

// CS Store validator, given a type and slug
function validateTypeSlug(type: string, slug: string): UrlPath {
    // type must be of ContentType
    if (!isContentType(type)) {
        throw new Error('Invalid request');
    }

    // Should be a valid slug
    if (!slug) {
        throw new Error('Invalid request');
    }

    return { type, slug };
}

// CS store validator, given a URL
function validateRequest(url: URL): UrlPath {
    // URL must be in the format of /:type/:slug e.g. /Products/:slug, /Blog/:slug, /FAQ/:slug
    const urlPath = new URL(url).pathname
        .split('/')
        .filter((x) => x)
        .map((x) => x.toLowerCase());
    if (urlPath.length !== 2) {
        throw new Error('Invalid request');
    }

    return validateTypeSlug(urlPath[0], urlPath[1]);
}

// Fetch content data from KV by type and slug
async function getContentByTypeSlug(
    context: HTAppLoadContext,
    type: ContentType,
    slug: string
): Promise<ContentStoreEntry> {
    if (context.CONTENT_STORE_CACHE_ENABLED) {
        // Fetch data from Cache
        const cachedEntry = await getEntry(context, type, slug);
        if (cachedEntry.cacheHit) {
            console.debug(`getContentByTypeSlug: ${slug} found in cache`);
            return {
                data: { [type]: cachedEntry.cacheValue },
                slug: slug,
                entryExists: true,
                cacheHit: true,
            };
        }
    } else {
        // Fetch data from Notion
        const notionEntry = await queryDbByTypeSlug(context, type, slug);
        if (notionEntry) {
            console.debug(
                `getContentByTypeSlug: ${slug} found in Notion API ${type}`
            );
            return {
                data: { [type]: notionEntry },
                slug: slug,
                entryExists: true,
                cacheHit: false,
            };
        }
    }
    return {
        slug: slug,
        entryExists: false,
        cacheHit: false,
    };
}

// Validate and fetch content data from KV by URL
async function getContentByUrl(
    context: HTAppLoadContext,
    url: URL
): Promise<ContentStoreEntry> {
    try {
        const urlPath = validateRequest(url);
        return getContentByTypeSlug(context, urlPath.type, urlPath.slug);
    } catch (e) {
        console.debug(`getContentByUrl: ${url} is not a valid request`);
        return {
            entryExists: false,
            cacheHit: false,
        };
    }
}

// Get all content urls for a given type (for sitemap)
async function getAllContentURLsByType(
    context: HTAppLoadContext,
    type: ContentType
): Promise<URL[]> {
    const data: URL[] = [];
    const entries = await getAllKeysByType(context, type);
    if (entries) {
        entries.forEach((entry) => {
            data.push(new URL(`/${type}/${entry}`, context.HOST_URL));
        });
    }
    return data;
}

// Get all content urls from KV (for sitemap)
async function getAllContentURLs(context: HTAppLoadContext): Promise<URL[]> {
    const data: URL[] = [];
    for (const type of ['blog', 'faq', 'product']) {
        data.push(
            ...(await getAllContentURLsByType(context, type as ContentType))
        );
    }
    return data;
}

// Purge and rebuild content-store by type using Notion API
async function purgeAndRebuildByType(
    context: HTAppLoadContext,
    type: ContentType
): Promise<ContentStoreEntry[] | undefined> {
    // Fetch data from Notion
    const data = await queryDbByType(context, type);
    if (!data) {
        throw new Error(`Failed to fetch data from Notion for ${type}`);
    }

    // Purge KV
    await purgeEntriesByType(context, type);

    // Write to KV
    const storedEntries: ContentStoreEntry[] = [];
    for (const entry of data) {
        try {
            const urlPath = validateTypeSlug(type, entry['Slug'].url);
            await putEntry(context, urlPath.type, urlPath.slug, entry);
            storedEntries.push({
                data: { [type]: entry },
                slug: urlPath.slug,
                entryExists: true,
                cacheHit: false,
            });
        } catch (error) {
            // TODO - log error
            console.error(JSON.stringify(entry), error);
        }
    }

    return storedEntries;
}

// Purge and rebuild the entire content-store using Notion API
async function purgeAndRebuildAll(
    context: HTAppLoadContext
): Promise<ContentStoreEntry[]> {
    const data = [];
    for (const type of ['blog', 'faq', 'product']) {
        const entries = await purgeAndRebuildByType(
            context,
            type as ContentType
        );
        if (entries) {
            console.log(entries);
            data.push(...entries);
        }
    }
    return data;
}

export { getContentByUrl, getAllContentURLs, purgeAndRebuildAll };
