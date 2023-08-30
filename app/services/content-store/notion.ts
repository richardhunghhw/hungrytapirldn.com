/**
 * The client used to fetch data from Notion API
 * - Fetch data from content-store, given ContentType and slug
 * - Use Notion API as a fallback if content-store does not have the data
 * - Rebuild content-store using Notion API on request from admin
 */

import { Client } from '@notionhq/client';
import type { ContentType } from '.';
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { AppLoadContext } from '@remix-run/cloudflare';

// Setup Notion client
async function getClient({ env: { NOTION_API_SECRET } }: AppLoadContext): Promise<Client> {
  return new Client({ auth: NOTION_API_SECRET, notionVersion: '2022-06-28' });
}

function isPageObjectResponse(
  response: PartialPageObjectResponse | PageObjectResponse,
): response is PageObjectResponse {
  return (response as PageObjectResponse).object !== undefined;
}

// Query Notion API for all entries in a Database entries given its ContentType
async function queryDbByType(context: AppLoadContext, type: ContentType): Promise<Array<PageObjectResponse>> {
  const notion = await getClient(context);
  const databaseId = context.env[`NOTION_API_DB_${type.toUpperCase()}`] as string;

  const filter = {
    property: 'Environment',
    multi_select: {
      contains: context.env.NODE_ENV,
    },
  };

  const results: Array<PageObjectResponse> = [];
  let data: any = {};
  do {
    // Todo this is not async
    data = await notion.databases.query({
      database_id: databaseId,
      filter: filter,
      start_cursor: data?.next_cursor ?? undefined,
    });

    data.results
      .filter((response: PartialPageObjectResponse | PageObjectResponse): response is PageObjectResponse =>
        isPageObjectResponse(response),
      )
      .forEach((row: PageObjectResponse) => results.push(row));
  } while (data?.has_more);

  return results;
}

export type FullPageResponse = PageObjectResponse & {
  content: Array<BlockObjectResponse>;
};

function isBlockObjectResponse(
  response: PartialBlockObjectResponse | BlockObjectResponse,
): response is BlockObjectResponse {
  return (response as BlockObjectResponse).type !== undefined;
}

// Get a single Page's content from Notion API given its id
async function getPageContent(context: AppLoadContext, entry: PageObjectResponse): Promise<FullPageResponse> {
  const notion = await getClient(context);

  const results: Array<BlockObjectResponse> = [];
  let block_id = entry.id;
  let data: any = {};
  do {
    // Todo this is not async
    data = await notion.blocks.children
      .list({
        block_id,
        start_cursor: data?.next_cursor ?? undefined,
      })
      .catch((err) => {
        //todo sentry errror
        console.error(err);
      });

    // filter out array elements with PartialBlockObjectResponse TODO find out what this is
    data.results
      .filter((response: PartialBlockObjectResponse | BlockObjectResponse): response is BlockObjectResponse =>
        isBlockObjectResponse(response),
      )
      .forEach((row: BlockObjectResponse) => results.push(row));
  } while (data?.has_more);

  return {
    ...entry,
    content: results,
  };
}

export { getPageContent, queryDbByType };
