/**
 * Interface to KV for content-store. For the following operations:
 * - Valdate and generate keys to access KV (type, slug)
 * - Fetch data from KV, given ContentType, slug (optional)
 * - List all cache keys, metadata for a given type
 * - Purge all data from KV for a given type
 */
import * as Sentry from '@sentry/remix';
import type { BaseEntry, ContentStoreEntry, ContentType, EntryMetadata } from '../entities/content';

export class ContentKv {
  kv: KVNamespace;
  cacheTtlDays: number = 14;

  constructor(kv: KVNamespace, cacheTtlDays: number) {
    this.kv = kv;
    this.cacheTtlDays = cacheTtlDays;
  }

  makeCacheKey(contentType: string, contentSlug: string): string {
    return `${contentType}:${contentSlug}`;
  }

  splitCacheKey(key: string) {
    return key.split(':');
  }

  async getEntry(type: ContentType, slug: string): Promise<ContentStoreEntry | undefined> {
    // Get an Entry (row) from KV
    const cacheKey = this.makeCacheKey(type, slug);
    const { value, metadata } = await this.kv.getWithMetadata(cacheKey);
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
  async putEntry(
    type: ContentType,
    slug: string,
    metadata: EntryMetadata,
    entry: ContentStoreEntry['data'],
  ): Promise<undefined> {
    const cacheKey = this.makeCacheKey(type, slug);
    await this.kv.put(cacheKey, JSON.stringify(entry), {
      expirationTtl: 60 * 60 * 24 * this.cacheTtlDays,
      metadata: { ...metadata },
    });
  }

  // Process list results from KV
  processListResults(response: KVNamespaceListResult<EntryMetadata>): BaseEntry[] {
    const data: BaseEntry[] = [];

    if (response && response.keys && response.keys.length > 0) {
      response.keys.forEach((entry) => {
        data.push({
          type: this.splitCacheKey(entry.name)[0] as ContentType,
          slug: this.splitCacheKey(entry.name)[1],
          metadata: entry.metadata as EntryMetadata,
        });
      });
    }

    return data;
  }

  // Get all content keys and metadata for a given type
  async listKeys(type: ContentType): Promise<BaseEntry[]> {
    const response = await this.kv.list<EntryMetadata>({
      prefix: type,
      limit: 1000, // Default limit, revisit if needed
    });

    if (!response.list_complete) {
      // Should never happen give the 1000 limit, silently fail
      Sentry.captureMessage(`KV list operation incomplete for type [${type}], exceeded limit`, 'error');
    }

    return this.processListResults(response);
  }

  async listNestedKeys(type: ContentType, nested: string): Promise<BaseEntry[]> {
    const response = await this.kv.list<EntryMetadata>({
      prefix: this.makeCacheKey(type, nested),
      limit: 1000, // Default limit, revisit if needed
    });

    if (!response.list_complete) {
      // Should never happen give the 1000 limit, silently fail
      Sentry.captureMessage(
        `KV list operation incomplete for type [${type}], nested [${nested}], exceeded limit`,
        'error',
      );
    }

    return this.processListResults(response);
  }

  // Purge entries for a given type
  async purgeEntries(type: ContentType, entries: BaseEntry[]): Promise<undefined> {
    for (const entry of entries) {
      await this.kv.delete(this.makeCacheKey(type, entry.slug));
    }
  }
}
