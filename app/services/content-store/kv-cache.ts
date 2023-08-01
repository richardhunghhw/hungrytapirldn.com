/**
 * Interface to KV for content-store. For the following operations:
 * - Valdate and generate keys to access KV (type, slug)
 * - Fetch data from KV, given ContentType, slug (optional)
 * - List all cache keys, metadata for a given type
 * - Purge all data from KV for a given type
 */

import type { HTAppLoadContext } from '~/utils/types';
import { makeCacheKey, splitCacheKey } from './utils';
import type { BaseEntry, ContentStoreEntry, ContentType, EntryMetadata } from '.';
import * as Sentry from '@sentry/remix';

// Get an Entry (row) from KV
async function getEntry(
  { CONTENT_STORE }: HTAppLoadContext,
  type: ContentType,
  slug: string,
): Promise<ContentStoreEntry | undefined> {
  const cacheKey = makeCacheKey(type, slug);
  const { value, metadata } = await CONTENT_STORE.getWithMetadata(cacheKey);
  if (!value) {
    return undefined;
  }

  return {
    type: type,
    slug: slug,
    metadata: metadata as EntryMetadata,
    data: {
      ...JSON.parse(value),
    } as ContentStoreEntry['data'],
  };
}

// Add (cache) entry in to KV
async function putEntry(
  { CACHE_TTL_DAYS, CONTENT_STORE }: HTAppLoadContext,
  type: ContentType,
  slug: string,
  metadata: EntryMetadata,
  entry: ContentStoreEntry['data'],
): Promise<undefined> {
  const cacheKey = makeCacheKey(type, slug);
  await CONTENT_STORE.put(cacheKey, JSON.stringify(entry), {
    expirationTtl: 60 * 60 * 24 * CACHE_TTL_DAYS,
    metadata: { ...metadata },
  });
}

// Get all content keys and metadata for a given type
async function listKeys({ CONTENT_STORE }: HTAppLoadContext, type: ContentType): Promise<BaseEntry[]> {
  const data: BaseEntry[] = [];

  const response = await CONTENT_STORE.list({
    prefix: type,
    limit: 1000, // Default limit, revisit if needed
  });
  if (!response.list_complete) {
    // Should never happen give the 1000 limit
    Sentry.captureMessage(`KV list operation incomplete for type [${type}], exceeded limit`, 'error');
  }

  if (response && response.keys && response.keys.length > 0) {
    response.keys.forEach((entry) => {
      data.push({
        type: type,
        slug: splitCacheKey(entry.name)[1],
        metadata: entry.metadata as EntryMetadata,
      });
    });
  }
  return data;
}

// Purge entries for a given type
async function purgeEntries(
  { CONTENT_STORE }: HTAppLoadContext,
  type: ContentType,
  entries: BaseEntry[],
): Promise<undefined> {
  for (const entry of entries) {
    await CONTENT_STORE.delete(makeCacheKey(type, entry.slug));
  }
}

export { getEntry, putEntry, listKeys, purgeEntries };
