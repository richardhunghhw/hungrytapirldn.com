import type { HTAppLoadContext } from '~/utils/types';
import type { ContentStoreEntry, ContentType, EntryMetadata } from '.';
import type { FullPageResponse } from './notion';
import { getPageContent, queryDbByType } from './notion';
import { allContentTypes } from './';
import { listKeys, purgeEntries, putEntry } from './kv-cache';
import { blockToMarkdown, blocksToMarkdown } from '~/utils/notion-block-to-markdown';
import { isProd } from '~/utils/misc';
import { upload } from '../image-store';

// Extract metadata from notion entry TODO sentry capture errors
function makeMetadata(type: ContentType, { properties }: FullPageResponse): EntryMetadata {
  let slug = properties.Slug?.url as string;
  if (type === 'stalldate') {
    const location = properties.Location?.select.name as string;
    const startDate = (properties.Date?.date.start as string).split('T')[0];
    slug = location + '~' + startDate;
  }
  const title =
    properties.Question?.title?.[0]?.plain_text ??
    properties.Product?.title?.[0]?.plain_text ??
    properties.Post?.title?.[0]?.plain_text ??
    properties.Title?.title?.[0]?.plain_text ??
    properties.Event?.title?.[0]?.plain_text ??
    undefined;
  const tags = properties.Tags?.multi_select?.map((x: { name: any }) => x.name);
  const category = properties.Category?.select.name as string;
  return {
    slug,
    title,
    tags: tags ?? [],
    category,
  };
}

// Santize entry from notion, extract data fields
function makeContentStoreEntry(isProd: boolean, type: ContentType, entry: FullPageResponse): ContentStoreEntry {
  const metadata: EntryMetadata = makeMetadata(type, entry);
  const slug: string = metadata.slug;
  if (!slug) {
    // TODO sentry
    throw new Error(`Failed to extract slug for entry type ${type}`);
  }

  let data = {};
  if (type === 'general') {
    data = {
      general: blocksToMarkdown(entry.content),
      url: entry.properties.URL?.url as string,
    };
  } else if (type === 'blog') {
    data = {
      blog: blocksToMarkdown(entry.content),
      seoDescription: entry.properties['SEO Description']?.rich_text[0]?.plain_text as string,
    };
  } else if (type === 'faq') {
    data = {
      faq: blocksToMarkdown(entry.content),
      productSectionRef: entry.properties['Product Section Ref']?.rich_text[0]?.plain_text as string,
      seoDescription: entry.properties['SEO Description']?.rich_text[0]?.plain_text as string,
    };
  } else if (type === 'product') {
    data = {
      stripeId: (isProd
        ? entry.properties['Stripe ID TEST']?.rich_text[0]?.plain_text
        : entry.properties['Stripe ID PROD']?.rich_text[0]?.plain_text) as string,
      id: entry.properties.Id?.rich_text[0].plain_text as string,
      unit: entry.properties.Unit?.rich_text[0].plain_text as string,
      price: entry.properties.Price?.number,
      images: entry.properties.Images?.files.map(
        (x: { name: string; type: string; file: { url: string; expiry_time: string } }) => ({
          url: x.file.url,
          alt: x.name,
        }),
      ) as Array<{ name: string; url: string; alt: string }>,
      ingredients: entry.properties.Ingredients?.multi_select.map((x: { name: any }) => x.name) as Array<string>,
      product: blocksToMarkdown(entry.content),
      productCart: blockToMarkdown({
        // Todo revisit hack
        type: 'text',
        text: entry.properties['Cart Description'],
      }),
      productSection: blockToMarkdown({
        // Todo revisit hack
        type: 'text',
        text: entry.properties['Section Description'],
      }),
      imageColour: entry.properties['Image Colour']?.rich_text[0].plain_text as string,
      backgroundColour: entry.properties['Background Colour']?.rich_text[0].plain_text as string,
      seoDescription: entry.properties['SEO Description']?.rich_text[0]?.plain_text as string,
    };
  } else if (type === 'stalldate') {
    // Store date in UTC fomrat
    data = {
      location: entry.properties.Location?.select.name as string,
      startDT: new Date(entry.properties.Date?.date.start as string),
      endDT: new Date(entry.properties.Date?.date.end as string),
      collectionEnabled: entry.properties['Allow Collection']?.checkbox as boolean,
    };
  } else {
    // TODO sentry
    throw new Error(`Invalid type ${type}`);
  }
  return { type, slug, metadata, data: data };
}

// Search a block of strings for Notion Image URLs, upload to image-store, and replace URLs
async function replaceNotionImageUrlByBlocks(
  context: HTAppLoadContext,
  replaceImages: boolean,
  type: ContentType,
  blocks: Array<string>,
): Promise<Array<string>> {
  // eslint-disable-next-line no-useless-escape
  // prettier-ignore
  const mdLinkRegex = /^\!\[(.+)\]\(((https?:\/\/)[\w\d./?=#%\-&]+)\)$/

  const newBlocks = [];
  for (const line of blocks) {
    if (mdLinkRegex.test(line)) {
      const x = line.split('](');
      const altText = x[0].split('~')[0].replace('![', '');
      const fileName = x[0].split('~')[1];
      const notionImageUrl = x[1].replace(')', '');

      const imageUrl = await upload(context, replaceImages, notionImageUrl, fileName, type);
      newBlocks.push(`![${altText}](${imageUrl})`);
    } else {
      newBlocks.push(line);
    }
  }
  return newBlocks;
}

// Search ContentStoreEntry for Notion Image URLs, upload to image-store, and replace URLs
async function replaceNotionImageUrls(
  context: HTAppLoadContext,
  replaceImages: boolean,
  entry: ContentStoreEntry,
): Promise<void> {
  const { type } = entry;

  if (type === 'general') {
    const faq = entry.data?.general;
    entry.data.general = await replaceNotionImageUrlByBlocks(context, replaceImages, entry.type, faq);
  } else if (type === 'blog') {
    const blog = entry.data?.blog;
    entry.data.blog = await replaceNotionImageUrlByBlocks(context, replaceImages, entry.type, blog);
  } else if (type === 'faq') {
    const faq = entry.data?.faq;
    entry.data.faq = await replaceNotionImageUrlByBlocks(context, replaceImages, entry.type, faq);
  } else if (type === 'product') {
    for (const image of entry.data?.images ?? []) {
      const imageUrl = await upload(context, replaceImages, image.url, image.name, entry.type);
      image.url = imageUrl;
    }
  } else if (type === 'stalldate') {
    // empty
  } else {
    // TODO sentry
    throw new Error(`Invalid type ${type}`);
  }
}

/**
 * Replace entries in content-store for a given type using Notion API
 * @param context
 * @param type
 * @param purge, default false, purge all entries for type prior to refresh
 * @returns
 */
async function refreshEntries(
  context: HTAppLoadContext,
  type: ContentType,
  purge: boolean = false,
  replaceImages: boolean = false,
): Promise<undefined> {
  // Fetch a list of entries (keys, metadata only) from Notion
  console.debug(`Querying notion db for type [${type}]`);
  const databaseEntries = await queryDbByType(context, type);
  if (!databaseEntries) {
    // TODO catch error to sentry
    throw new Error(`Failed to fetch data from Notion for ${type}`);
  }

  // Fetch the content for each entry
  const pageContents: Array<FullPageResponse> = [];
  console.debug(`Querying notion for page blocks for [${type}]`);
  for (const dbEntry of databaseEntries) {
    // Cannot run this concurrently as this will break notion API limits
    pageContents.push(await getPageContent(context, dbEntry));
  }

  // Map each entry to a content-store entry
  const csEntries: Array<ContentStoreEntry> = [];
  pageContents.forEach((entry) => {
    try {
      csEntries.push(makeContentStoreEntry(isProd(context), type, entry));
    } catch (err) {
      console.error(`Failed to create CS entry for [${type}], ${JSON.stringify(entry)}`, err);
      // TODO sentry error
      throw new Error(`Failed to create CS entry for [${type}], ${JSON.stringify(entry)}`);
    }
  });

  // Upload images to image-store
  console.debug(`Uploading images for [${type}]`);
  for (const entry of csEntries) {
    await replaceNotionImageUrls(context, replaceImages, entry);
  }

  // If purge KV
  if (purge) {
    console.debug(`Purging cache of type [${type}]`);
    await listKeys(context, type).then(async (keys) => {
      await purgeEntries(context, type, keys).catch((err) => {
        console.error(`Failed to purge cache for type [${type}]`, err);
        // TODO sentry error
        throw new Error(`Failed to purge cache for type [${type}]`);
      });
    });
  }

  // Write to KV
  for (const entry of csEntries) {
    console.debug(`Writing entry type [${entry.type}] slug [${entry.slug}]`);
    await putEntry(context, type, entry.metadata.slug, entry.metadata, entry.data).catch((err) => {
      console.error(`Failed to write entries for [${type}]`, err);
      // TODO sentry error
    });
  }
}

async function refreshAllEntries(
  context: HTAppLoadContext,
  purge: boolean = false,
  typesFilter: string[] = [],
  replaceImages: boolean = false,
) {
  for (const type of allContentTypes().filter((x) => typesFilter.length === 0 || typesFilter.includes(x))) {
    await refreshEntries(context, type as ContentType, purge, replaceImages);
  }
}

export { refreshEntries, refreshAllEntries };
