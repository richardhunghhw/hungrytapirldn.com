/**
 * The client used to fetch data from Notion API
 * - Fetch data from content-store, given ContentType and slug
 * - Use Notion API as a fallback if content-store does not have the data
 * - Rebuild content-store using Notion API on request from admin
 */
import { Client } from '@notionhq/client';
import { allContentTypes, type ContentType } from '../entities/content';
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { FullPageResponse } from '../entities/notion';
import type { HTEnv } from 'types/ht-context';

type TypeToDbMap = {
  [key in ContentType]: string;
};

export class Notion {
  dbEnv: string;
  client: Client;
  typeToDbMap: TypeToDbMap;

  constructor(env: HTEnv) {
    this.dbEnv = env.NODE_ENV;
    this.client = new Client({ auth: env.NOTION_API_SECRET, notionVersion: '2022-06-28' });
    this.typeToDbMap = allContentTypes().reduce(
      (acc, type) => ((acc[type] = env[`NOTION_API_DB_${type.toUpperCase()}` as keyof HTEnv] as string), acc),
      {} as TypeToDbMap,
    );
  }

  isPageObjectResponse(response: PartialPageObjectResponse | PageObjectResponse): response is PageObjectResponse {
    return (response as PageObjectResponse).object !== undefined;
  }

  // Query Notion API for all entries in a Database entries given its ContentType
  async queryDbByType(type: ContentType): Promise<Array<PageObjectResponse>> {
    const databaseId = this.typeToDbMap[type];

    const filter = {
      property: 'Environment',
      multi_select: {
        contains: this.dbEnv,
      },
    };

    const results: Array<PageObjectResponse> = [];
    let data: any = {};
    do {
      // Todo this is not async
      data = await this.client.databases.query({
        database_id: databaseId,
        filter: filter,
        start_cursor: data?.next_cursor ?? undefined,
      });

      data.results
        .filter((response: PartialPageObjectResponse | PageObjectResponse): response is PageObjectResponse =>
          this.isPageObjectResponse(response),
        )
        .forEach((row: PageObjectResponse) => results.push(row));
    } while (data?.has_more);

    return results;
  }

  isBlockObjectResponse(response: PartialBlockObjectResponse | BlockObjectResponse): response is BlockObjectResponse {
    return (response as BlockObjectResponse).type !== undefined;
  }

  // Get a single Page's content from Notion API given its id
  async getPageContent(entry: PageObjectResponse): Promise<FullPageResponse> {
    const results: Array<BlockObjectResponse> = [];
    let block_id = entry.id;
    let data: any = {};
    do {
      // Todo this is not async
      data = await this.client.blocks.children
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
          this.isBlockObjectResponse(response),
        )
        .forEach((row: BlockObjectResponse) => results.push(row));
    } while (data?.has_more);

    return {
      ...entry,
      content: results,
    };
  }
}
