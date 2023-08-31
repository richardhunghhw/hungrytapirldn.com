import type { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type FullPageResponse = PageObjectResponse & {
  content: Array<BlockObjectResponse>;
};
