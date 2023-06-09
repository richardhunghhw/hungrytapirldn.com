/**
 * The client used to fetch data from Notion API
 * - Fetch data from content-store, given type (blog, faq, products) and slug
 * - Use Notion API as a fallback if content-store does not have the data
 * - Rebuild content-store using Notion API on request from admin
 */

import { Client } from '@notionhq/client';
import { HTAppLoadContext, JSONValue } from '~/utils/types';
import { ContentType } from './content-store';

// Setup Notion client
async function getClient({
    NOTION_API_SECRET,
}: HTAppLoadContext): Promise<Client> {
    return new Client({ auth: NOTION_API_SECRET, notionVersion: '2022-06-28' });
}

// Fetch data from Notion DB, given the filter
async function queryDbWithFilter(
    notion: Client,
    databaseId: string,
    filter: any
): Promise<JSONValue[]> {
    const results: JSONValue[] = [];
    let data: any = {};

    do {
        data = await notion.databases.query({
            database_id: databaseId,
            filter: filter,
            start_cursor: data?.next_cursor ?? undefined,
        });

        data.results.forEach((row: any) => results.push(row.properties));
    } while (data?.has_more);

    return results;
}

// Query Notion API for all entries in a Database entries given its ContentType
async function queryDbByType(
    context: HTAppLoadContext,
    type: ContentType
): Promise<JSONValue[] | undefined> {
    const notion = await getClient(context);
    const databaseId = context[`NOTION_API_DB_${type.toUpperCase()}`] as string;

    const results: any = await queryDbWithFilter(notion, databaseId, {
        and: [
            {
                property: 'Environment',
                multi_select: {
                    contains: context.NODE_ENV,
                },
            },
        ],
    });

    return results;
}

// Query Notion API for a single entry in a Database given its ContentType and slug
async function queryDbByTypeSlug(
    context: HTAppLoadContext,
    type: ContentType,
    slug: string
): Promise<JSONValue | undefined> {
    const notion = await getClient(context);
    const databaseId = context[`NOTION_API_DB_${type.toUpperCase()}`] as string;

    const results: any = await queryDbWithFilter(notion, databaseId, {
        and: [
            {
                property: 'Environment',
                multi_select: {
                    contains: context.NODE_ENV,
                },
            },
            {
                property: 'Slug',
                url: {
                    equals: slug,
                },
            },
        ],
    });

    if (results.length === 0) {
        console.debug(`getDbEntryby: ${slug} not found in ${databaseId}`);
        return undefined;
    } else if (results.length > 1) {
        console.debug(
            `getDbEntryby: ${slug} found multiple times in ${databaseId}`
        );
        return undefined;
    }

    return results[0];
}

export { queryDbByType, queryDbByTypeSlug };
