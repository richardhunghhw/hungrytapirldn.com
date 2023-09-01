import { allContentTypes } from '~/server/entities/content';
import type {
  BaseEntry,
  ContentStoreBlogEntry,
  ContentStoreFaqEntry,
  ContentStoreGeneralEntry,
  ContentStoreProductEntry,
  ContentStoreStallDateEntry,
} from '~/server/entities/content';
import type { AppLoadContext } from '@remix-run/cloudflare';

async function getGeneral(_: AppLoadContext, slug: string): Promise<ContentStoreGeneralEntry | undefined> {
  const entry = await _.repos.contentKv.getEntry('general', slug);
  return entry as ContentStoreGeneralEntry | undefined;
}

async function getGeneralEntry(_: AppLoadContext, slug: string) {
  const result = await getGeneral(_, slug);
  if (!result) {
    // todo sentry error
    throw new Error('Entry not found');
  }
  return result;
}

async function listGenerals(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listKeys('general');
  return entries;
}

async function listGeneralLocations(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listNestedKeys('general', 'location');
  return entries;
}

async function getBlog(_: AppLoadContext, slug: string): Promise<ContentStoreBlogEntry | undefined> {
  const entry = await _.repos.contentKv.getEntry('blog', slug);
  return entry as ContentStoreBlogEntry | undefined;
}

async function listBlogs(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listKeys('blog');
  return entries;
}

async function getProduct(_: AppLoadContext, slug: string): Promise<ContentStoreProductEntry | undefined> {
  const entry = await _.repos.contentKv.getEntry('product', slug);
  return entry as ContentStoreProductEntry | undefined;
}

async function getAllProducts(_: AppLoadContext): Promise<ContentStoreProductEntry[]> {
  const entries = await listProducts(_);
  const result = await Promise.all(entries.map((e) => getProduct(_, e.slug)));
  return result as ContentStoreProductEntry[];
}

async function listProducts(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listKeys('product');
  return entries;
}

async function getFaq(_: AppLoadContext, slug: string): Promise<ContentStoreFaqEntry | undefined> {
  const entry = await _.repos.contentKv.getEntry('faq', slug);
  return entry as ContentStoreFaqEntry | undefined;
}

async function listFaqs(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listKeys('faq');
  return entries;
}

async function getStallDate(_: AppLoadContext, slug: string): Promise<ContentStoreStallDateEntry | undefined> {
  const entry = await _.repos.contentKv.getEntry('stalldate', slug);
  return entry as ContentStoreStallDateEntry | undefined;
}

async function listStallDates(_: AppLoadContext): Promise<BaseEntry[]> {
  const entries = await _.repos.contentKv.listKeys('stalldate');
  return entries;
}

async function getLatestStallDate(_: AppLoadContext): Promise<ContentStoreStallDateEntry> {
  const datetime = new Date();
  // Get existing latest entry
  const latest = await getStallDate(_, 'latest');
  const latestEndDate = latest ? new Date(latest?.data.endDT) : undefined;

  // If latest entry is not set or is expired, re-evaluate
  const reeval = !latest || !latestEndDate || datetime > latestEndDate;
  if (!reeval) {
    return latest;
  }

  // Get all stall dates, find the next upcoming one
  const stallDates = await listStallDates(_);
  const newLatest = stallDates
    .filter((e) => new Date(e.slug.split('~')[1]) >= datetime) // filter out past dates
    .sort((a, b) => new Date(a.slug.split('~')[1]) - new Date(b.slug.split('~')[1]))[0]; // sort date asc
  const newLatestEntry = (await getStallDate(_, newLatest.slug)) as ContentStoreStallDateEntry;

  // Update latest entry
  await _.repos.contentKv.putEntry('stalldate', 'latest', newLatestEntry?.metadata, newLatestEntry?.data);
  return newLatestEntry;
}

// Get all entries, for sitemap generation
async function listAll(_: AppLoadContext): Promise<BaseEntry[]> {
  const result: BaseEntry[] = [];
  await Promise.all(
    allContentTypes().flatMap(async (type) => {
      await _.repos.contentKv.listKeys(type).then((entries) => {
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
  getAllProducts,
  listProducts,
  getFaq,
  listFaqs,
  getStallDate,
  listStallDates,
  getLatestStallDate,
  listAll,
};
