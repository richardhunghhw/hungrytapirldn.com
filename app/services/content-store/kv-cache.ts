/**
 * KV Cache client for content-store
 */

import type { HTAppLoadContext, JSONObject, JSONValue } from '~/utils/types';
import { ContentType } from './store';
import * as Sentry from '@sentry/remix';
import { makeCacheKey } from './utils';

export type KVStoreEntry = {
    cacheKey: string;
    cacheValue?: JSONValue;
    cacheHit: boolean;
};

// Get cached entry from KV
async function getEntry(
    context: HTAppLoadContext,
    contentType: ContentType,
    contentSlug: string
): Promise<KVStoreEntry> {
    const CONTENT_STORE = context.CONTENT_STORE;
    const cacheKey = makeCacheKey(contentType, contentSlug);
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
    contentType: ContentType,
    contentSlug: string,
    cacheValue: JSONValue,
    metadata?: JSONObject
) {
    const cacheKey = makeCacheKey(contentType, contentSlug);
    await CONTENT_STORE.put(cacheKey, JSON.stringify(cacheValue), {
        metadata: { ...metadata },
    });
}

// Get all keys from KV by ContentType
async function listAllKeysByType<T extends JSONObject>(
    { CONTENT_STORE }: HTAppLoadContext,
    contentType: string
): Promise<KVNamespaceListKey<T>[]> {
    const response = await CONTENT_STORE.list({
        prefix: contentType,
        limit: 1000, // Default limit, revisit if needed
    });
    if (!response.list_complete) {
        // Should never happen give the 1000 limit
        Sentry.captureMessage(
            `KV list incomplete for ${contentType}, exceeded limit`,
            'error'
        );
    }

    return response.keys as KVNamespaceListKey<T>[];
}

// Purge all entries in KV, given a ContentType
async function purgeEntriesByType(
    context: HTAppLoadContext,
    contentType: string
) {
    const CONTENT_STORE = context.CONTENT_STORE;
    const keys = await listAllKeysByType(context, contentType);
    for (const key of keys) {
        console.debug(`purgeEntriesByType: Deleting ${key.name}`);
        await CONTENT_STORE.delete(key.name);
    }
}

export { getEntry, putEntry, listAllKeysByType, purgeEntriesByType };
