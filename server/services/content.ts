import {
  allContentTypes,
  type BaseEntry,
  type ContentStoreBlogEntry,
  type ContentStoreFaqEntry,
  type ContentStoreGeneralEntry,
  type ContentStoreProductEntry,
  type ContentStoreStallDateEntry,
} from '~/server/entities/content';
import type { ContentKv } from '~/server/repositories/content-kv';

export class Content {
  #contentKv: ContentKv;

  constructor(contentKv: ContentKv) {
    this.#contentKv = contentKv;
  }

  async getGeneral(slug: string): Promise<ContentStoreGeneralEntry | undefined> {
    const entry = await this.#contentKv.getEntry('general', slug);
    return entry as ContentStoreGeneralEntry | undefined;
  }

  async getGeneralEntry(slug: string) {
    const result = await this.getGeneral(slug);
    if (!result) {
      // todo sentry error
      throw new Error('Entry not found');
    }
    return result;
  }

  async listGenerals(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listKeys('general');
    return entries;
  }

  async listGeneralLocations(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listNestedKeys('general', 'location');
    return entries;
  }

  async getBlog(slug: string): Promise<ContentStoreBlogEntry | undefined> {
    const entry = await this.#contentKv.getEntry('blog', slug);
    return entry as ContentStoreBlogEntry | undefined;
  }

  async listBlogs(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listKeys('blog');
    return entries;
  }

  async getProduct(slug: string): Promise<ContentStoreProductEntry | undefined> {
    const entry = await this.#contentKv.getEntry('product', slug);
    return entry as ContentStoreProductEntry | undefined;
  }

  async getAllProducts(): Promise<ContentStoreProductEntry[]> {
    const entries = await this.listProducts();
    const result = await Promise.all(entries.map((e) => this.getProduct(e.slug)));
    return result as ContentStoreProductEntry[];
  }

  async listProducts(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listKeys('product');
    return entries;
  }

  async getFaq(slug: string): Promise<ContentStoreFaqEntry | undefined> {
    const entry = await this.#contentKv.getEntry('faq', slug);
    return entry as ContentStoreFaqEntry | undefined;
  }

  async listFaqs(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listKeys('faq');
    return entries;
  }

  async getStallDate(slug: string): Promise<ContentStoreStallDateEntry | undefined> {
    const entry = await this.#contentKv.getEntry('stalldate', slug);
    return entry as ContentStoreStallDateEntry | undefined;
  }

  async listStallDates(): Promise<BaseEntry[]> {
    const entries = await this.#contentKv.listKeys('stalldate');
    return entries;
  }

  async getLatestStallDate(): Promise<ContentStoreStallDateEntry> {
    const datetime = new Date();
    // Get existing latest entry
    const latest = await this.getStallDate('latest');
    const latestEndDate = latest ? new Date(latest?.data.endDT) : undefined;

    // If latest entry is not set or is expired, re-evaluate
    const reeval = !latest || !latestEndDate || datetime > latestEndDate;
    if (!reeval) {
      return latest;
    }

    // Get all stall dates, find the next upcoming one
    const stallDates = await this.listStallDates();
    const newLatest = stallDates
      .filter((e) => new Date(e.slug.split('~')[1]) >= datetime) // filter out past dates
      .sort((a, b) => new Date(a.slug.split('~')[1]) - new Date(b.slug.split('~')[1]))[0]; // sort date asc
    const newLatestEntry = (await this.getStallDate(newLatest.slug)) as ContentStoreStallDateEntry;

    // Update latest entry
    await this.#contentKv.putEntry('stalldate', 'latest', newLatestEntry?.metadata, newLatestEntry?.data);
    return newLatestEntry;
  }

  // Get all entries, for sitemap generation
  async listAll(): Promise<BaseEntry[]> {
    const result: BaseEntry[] = [];
    await Promise.all(
      allContentTypes().flatMap(async (type) => {
        await this.#contentKv.listKeys(type).then((entries) => {
          result.push(...entries);
        });
      }),
    );
    return result;
  }
}
