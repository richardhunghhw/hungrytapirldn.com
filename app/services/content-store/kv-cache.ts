/**
 * KV Cache client for content-store
 */

import type { HTAppLoadContext, JSONValue } from '~/utils/types';

export type KVStoreEntry = {
    cacheKey: string;
    cacheValue?: JSONValue;
    cacheHit: boolean;
};

function getCacheKey(contentType: string, contentSlug: string): string {
    return `${contentType}:${contentSlug}`;
}

function splitCacheKey(key: string) {
    return key.split(':');
}

// Get cached entry from KV
async function getEntry(
    context: HTAppLoadContext,
    contentType: string,
    contentSlug: string
): Promise<KVStoreEntry> {
    const CONTENT_STORE = context.CONTENT_STORE;
    const cacheKey = getCacheKey(contentType, contentSlug);
    const cacheValue = await CONTENT_STORE.get(cacheKey);

    return {
        cacheKey: cacheKey,
        cacheValue: cacheValue ? JSON.parse(cacheValue) : undefined,
        cacheHit: cacheValue !== null,
    };
}

// Cache entry in KV
async function putEntry(
    { CONTENT_STORE }: HTAppLoadContext,
    contentType: string,
    contentSlug: string,
    cacheValue: JSONValue
) {
    const cacheKey = getCacheKey(contentType, contentSlug);
    await CONTENT_STORE.put(cacheKey, JSON.stringify(cacheValue));
}

// Get all keys from KV by ContentType
async function getAllKeysByType(
    { CONTENT_STORE }: HTAppLoadContext,
    contentType: string
): Promise<string[]> {
    const response = await CONTENT_STORE.list({
        prefix: contentType,
        limit: 1000, // Default limit, revisit if needed
    });
    return response.keys.map((key) => splitCacheKey(key.name)[1]);
}

// Purge all entries in KV, given a ContentType
async function purgeEntriesByType(
    context: HTAppLoadContext,
    contentType: string
) {
    const CONTENT_STORE = context.CONTENT_STORE;
    const keys = await getAllKeysByType(context, contentType);
    for (const key of keys) {
        await CONTENT_STORE.delete(key);
    }
}

export { getEntry, putEntry, getAllKeysByType, purgeEntriesByType };
