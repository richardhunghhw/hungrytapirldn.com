import type { HTAppLoadContext } from '~/utils/types';
import type { ContentStoreEntry, ContentType, EntryMetadata } from '.';
import type { FullPageResponse } from './notion';
import { getPageContent, queryDbByType } from './notion';
import { allContentTypes } from './utils';
import { listKeys, purgeEntries, putEntry } from './kv-cache';
import { blockToMarkdown, blocksToMarkdown } from '../notion-block-to-markdown';
import { isProd } from '~/utils/misc';

// Extract metadata from notion entry TODO sentry capture errors
function makeMetadata({ properties }: FullPageResponse): EntryMetadata {
    const slug = properties.Slug?.url as string;
    const title =
        properties.Question?.title?.[0]?.plain_text ??
        properties.Product?.title?.[0]?.plain_text ??
        properties.Post?.title?.[0]?.plain_text ??
        properties.Title?.title?.[0]?.plain_text ??
        undefined;
    const tags = properties.Tags?.multi_select?.map(
        (x: { name: any }) => x.name
    );
    return {
        slug: slug,
        title: title,
        tags: tags ?? [],
    };
}

// Santize entry from notion, extract data fields
function makeContentStoreEntry(
    isProd: boolean,
    type: ContentType,
    entry: FullPageResponse
): ContentStoreEntry {
    const metadata: EntryMetadata = makeMetadata(entry);
    const slug: string = metadata.slug;

    let data = {};
    if (type === 'general') {
        data = {
            general: blocksToMarkdown(entry.content),
        };
    } else if (type === 'blog') {
        data = {
            blog: blocksToMarkdown(entry.content),
        };
    } else if (type === 'faq') {
        data = {
            faq: blocksToMarkdown(entry.content),
        };
    } else if (type === 'product') {
        data = {
            stripeId: (isProd
                ? entry.properties['Stripe ID TEST']?.rich_text[0]?.plain_text
                : entry.properties['Stripe ID PROD']?.rich_text[0]
                      ?.plain_text) as string,
            id: entry.properties.Id?.rich_text[0].plain_text as string,
            unit: entry.properties.Unit?.rich_text[0].plain_text as string,
            price: entry.properties.Price?.number,
            primaryImage: entry.properties['Primary Image'].url as string,
            primaryImageAlt: entry.properties['Primary Image Alt']?.rich_text[0]
                .plain_text as string,
            Ingredients: entry.properties.Ingredients?.multi_select.map(
                (x: { name: any }) => x.name
            ) as Array<string>,
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
            sectionColour: entry.properties['Section Colour']?.rich_text[0]
                .plain_text as string,
        };
    } else {
        // TODO sentry
        throw new Error(`Invalid type ${type}`);
    }
    return { type, slug, metadata, data: data };
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
    purge: boolean = false
): Promise<undefined> {
    // Fetch a list of entries (keys, metadata only) from Notion
    const databaseEntries = await queryDbByType(context, type);
    if (!databaseEntries) {
        // todo catch error to sentry
        throw new Error(`Failed to fetch data from Notion for ${type}`);
    }

    // Fetch the content for each entry
    const pageContents: Array<FullPageResponse> = [];
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
            console.error(
                `Failed to create CS entry for ${type}, ${JSON.stringify(
                    entry
                )}`,
                err
            );
            //todo sentry error
        }
    });

    // If purge KV
    if (purge) {
        await listKeys(context, type).then(async (keys) => {
            await purgeEntries(context, type, keys);
        });
    }

    // Write to KV
    for (const entry of csEntries) {
        console.debug(
            `Writing entry type [${entry.type}] slug [${entry.slug}]`
        );
        try {
            await putEntry(
                context,
                type,
                entry.metadata.slug,
                entry.metadata,
                entry.data
            );
        } catch (error) {
            // TODO sentry - log error
            console.error(JSON.stringify(entry), error);
        }
    }
}

async function refreshAllEntries(
    context: HTAppLoadContext,
    purge: boolean = false
) {
    for (const type of allContentTypes()) {
        await refreshEntries(context, type as ContentType, purge);
    }
}

export { refreshEntries, refreshAllEntries };
