/**
 * Shared interface for content repositories (KV-backed or local static files).
 * Both ContentKv and LocalContentRepository implement this interface.
 */
import type { BaseEntry, ContentStoreEntry, ContentType, EntryMetadata } from '../entities/content';

export interface IContentRepository {
  getEntry(type: ContentType, slug: string): Promise<ContentStoreEntry | undefined>;
  putEntry(
    type: ContentType,
    slug: string,
    metadata: EntryMetadata,
    entry: ContentStoreEntry['data'],
  ): Promise<undefined>;
  listKeys(type: ContentType): Promise<BaseEntry[]>;
  listNestedKeys(type: ContentType, nested: string): Promise<BaseEntry[]>;
  purgeEntries(type: ContentType, entries: BaseEntry[]): Promise<undefined>;
}
