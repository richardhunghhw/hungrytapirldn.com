import type { HTAppLoadContext } from '~/utils/types';
import { getEntry, listKeys } from './kv-cache';
import { allContentTypes } from './utils';
import type {
    BaseEntry,
    ContentStoreBlogEntry,
    ContentStoreFaqEntry,
    ContentStoreGeneralEntry,
    ContentStoreProductEntry,
} from '.';

async function getGeneral(
    context: HTAppLoadContext,
    slug: string
): Promise<ContentStoreGeneralEntry | undefined> {
    const entry = await getEntry(context, 'general', slug);
    return entry as ContentStoreGeneralEntry | undefined;
}

async function listGenerals(context: HTAppLoadContext): Promise<BaseEntry[]> {
    const entries = await listKeys(context, 'general');
    return entries;
}

async function getBlog(
    context: HTAppLoadContext,
    slug: string
): Promise<ContentStoreBlogEntry | undefined> {
    const entry = await getEntry(context, 'blog', slug);
    return entry as ContentStoreBlogEntry | undefined;
}

async function listBlogs(context: HTAppLoadContext): Promise<BaseEntry[]> {
    const entries = await listKeys(context, 'blog');
    return entries;
}

async function getProduct(
    context: HTAppLoadContext,
    slug: string
): Promise<ContentStoreProductEntry | undefined> {
    const entry = await getEntry(context, 'product', slug);
    return entry as ContentStoreProductEntry | undefined;
}

async function listProducts(context: HTAppLoadContext): Promise<BaseEntry[]> {
    const entries = await listKeys(context, 'product');
    return entries;
}

async function getFaq(
    context: HTAppLoadContext,
    slug: string
): Promise<ContentStoreFaqEntry | undefined> {
    const entry = await getEntry(context, 'faq', slug);
    return entry as ContentStoreFaqEntry | undefined;
}

async function listFaqs(context: HTAppLoadContext): Promise<BaseEntry[]> {
    const entries = await listKeys(context, 'faq');
    return entries;
}

// Get all entries, for sitemap generation
async function listAll(context: HTAppLoadContext): Promise<BaseEntry[]> {
    const result: BaseEntry[] = [];
    await Promise.all(
        allContentTypes().flatMap(async (type) => {
            await listKeys(context, type).then((entries) => {
                result.push(...entries);
            });
        })
    );
    return result;
}

export {
    getGeneral,
    listGenerals,
    getBlog,
    listBlogs,
    getProduct,
    listProducts,
    getFaq,
    listFaqs,
    listAll,
};
