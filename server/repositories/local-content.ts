/**
 * Local static content repository — reads from JSON files bundled at build time.
 * Drop-in replacement for ContentKv when USE_LOCAL_CONTENT=true.
 * putEntry and purgeEntries are no-ops (content is read-only at runtime).
 */
import type { BaseEntry, ContentStoreEntry, ContentType, EntryMetadata } from '../entities/content';
import type { IContentRepository } from './content-repository';

import generalContent from '../content/general.json';
import blogContent from '../content/blog.json';
import productContent from '../content/product.json';
import faqContent from '../content/faq.json';
import stalldateContent from '../content/stalldate.json';

const CONTENT_MAP: Record<ContentType, ContentStoreEntry[]> = {
  general: generalContent as ContentStoreEntry[],
  blog: blogContent as ContentStoreEntry[],
  product: productContent as ContentStoreEntry[],
  faq: faqContent as ContentStoreEntry[],
  stalldate: stalldateContent as ContentStoreEntry[],
};

export class LocalContent implements IContentRepository {
  async getEntry(type: ContentType, slug: string): Promise<ContentStoreEntry | undefined> {
    return CONTENT_MAP[type].find((e) => e.slug === slug);
  }

  async putEntry(
    _type: ContentType,
    _slug: string,
    _metadata: EntryMetadata,
    _entry: ContentStoreEntry['data'],
  ): Promise<undefined> {
    // No-op: local content is read-only at runtime
    return undefined;
  }

  async listKeys(type: ContentType): Promise<BaseEntry[]> {
    return CONTENT_MAP[type].map(({ type, slug, metadata }) => ({ type, slug, metadata }));
  }

  async listNestedKeys(type: ContentType, nested: string): Promise<BaseEntry[]> {
    const prefix = `${nested}~`;
    return CONTENT_MAP[type]
      .filter((e) => e.slug.startsWith(prefix))
      .map(({ type, slug, metadata }) => ({ type, slug, metadata }));
  }

  async purgeEntries(_type: ContentType, _entries: BaseEntry[]): Promise<undefined> {
    // No-op: local content is read-only at runtime
    return undefined;
  }
}
