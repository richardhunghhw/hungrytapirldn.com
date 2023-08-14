import type { HTAppLoadContext } from '~/utils/types';
import { getEntry, listKeys, listNestedKeys, putEntry } from './kv-cache';
import { allContentTypes } from './';
import type {
  BaseEntry,
  ContentStoreBlogEntry,
  ContentStoreFaqEntry,
  ContentStoreGeneralEntry,
  ContentStoreProductEntry,
  ContentStoreStallDateEntry,
} from '.';

async function getGeneral(context: HTAppLoadContext, slug: string): Promise<ContentStoreGeneralEntry | undefined> {
  const entry = await getEntry(context, 'general', slug);
  return entry as ContentStoreGeneralEntry | undefined;
}

async function getGeneralEntry(context: HTAppLoadContext, slug: string) {
  const result = await getGeneral(context, slug);
  if (!result) {
    // todo sentry error
    throw new Error('Entry not found');
  }
  return result;
}

async function listGenerals(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listKeys(context, 'general');
  return entries;
}

async function listGeneralLocations(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listNestedKeys(context, 'general', 'location');
  return entries;
}

async function getBlog(context: HTAppLoadContext, slug: string): Promise<ContentStoreBlogEntry | undefined> {
  const entry = await getEntry(context, 'blog', slug);
  return entry as ContentStoreBlogEntry | undefined;
}

async function listBlogs(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listKeys(context, 'blog');
  return entries;
}

async function getProduct(context: HTAppLoadContext, slug: string): Promise<ContentStoreProductEntry | undefined> {
  const entry = await getEntry(context, 'product', slug);
  return entry as ContentStoreProductEntry | undefined;
}

async function listProducts(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listKeys(context, 'product');
  return entries;
}

async function getFaq(context: HTAppLoadContext, slug: string): Promise<ContentStoreFaqEntry | undefined> {
  const entry = await getEntry(context, 'faq', slug);
  return entry as ContentStoreFaqEntry | undefined;
}

async function listFaqs(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listKeys(context, 'faq');
  return entries;
}

async function getStallDate(context: HTAppLoadContext, slug: string): Promise<ContentStoreStallDateEntry | undefined> {
  const entry = await getEntry(context, 'stalldate', slug);
  return entry as ContentStoreStallDateEntry | undefined;
}

async function listStallDates(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const entries = await listKeys(context, 'stalldate');
  return entries;
}

async function getLatestStallDate(context: HTAppLoadContext): Promise<ContentStoreStallDateEntry> {
  // Get existing latest entry
  const latest = await getStallDate(context, 'latest');
  const latestEndDate = latest ? new Date(latest?.data.endDT) : undefined;

  const datetime = new Date();

  // If latest entry is not set or is expired, re-evaluate
  const reeval = !latest || !latestEndDate || datetime > latestEndDate;
  if (!reeval) {
    return latest;
  }

  // Get all stall dates, find the next upcoming one
  const stallDates = await listStallDates(context);
  const newLatest = stallDates
    .filter((e) => new Date(e.slug.split('~')[1]) >= datetime) // filter out past dates
    .sort((a, b) => new Date(a.slug.split('~')[1]) - new Date(b.slug.split('~')[1]))[0]; // sort date asc
  const newLatestEntry = (await getStallDate(context, newLatest.slug)) as ContentStoreStallDateEntry;

  // Update latest entry
  await putEntry(context, 'stalldate', 'latest', newLatestEntry?.metadata, newLatestEntry?.data);
  return newLatestEntry;
}

// Get all entries, for sitemap generation
async function listAll(context: HTAppLoadContext): Promise<BaseEntry[]> {
  const result: BaseEntry[] = [];
  await Promise.all(
    allContentTypes().flatMap(async (type) => {
      await listKeys(context, type).then((entries) => {
        result.push(...entries);
      });
    }),
  );
  return result;
}

export {
  getGeneral,
  getGeneralEntry,
  listGenerals,
  listGeneralLocations,
  getBlog,
  listBlogs,
  getProduct,
  listProducts,
  getFaq,
  listFaqs,
  getStallDate,
  listStallDates,
  getLatestStallDate,
  listAll,
};
