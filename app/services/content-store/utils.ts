import { allContentTypes, type BaseEntry, type ContentType } from '~/server/entities/content';

export type UrlPath = {
  type: ContentType;
  slug: string;
};

// Entry validator, given the type and slug
function validateTypeSlug(type: string, slug: string): UrlPath {
  // type must be of ContentType
  if (!isContentType(type)) {
    throw new Error('Invalid request');
  }

  // Should be a valid slug
  if (!slug) {
    throw new Error('Invalid request');
  }

  return { type, slug };
}

// KV validator, given a URL
function validateRequest(url: URL): UrlPath {
  // URL must be in the format of /:type/:slug e.g. /Products/:slug, /Blog/:slug, /FAQ/:slug
  const urlPath = new URL(url).pathname
    .split('/')
    .filter((x) => x)
    .map((x) => x.toLowerCase());
  if (urlPath.length !== 2) {
    throw new Error('Invalid request');
  }

  return validateTypeSlug(urlPath[0], urlPath[1]);
}

function isContentType(str: string): str is ContentType {
  return allContentTypes().includes(str);
}

function makeCacheKey(contentType: string, contentSlug: string): string {
  return `${contentType}:${contentSlug}`;
}

function splitCacheKey(key: string) {
  return key.split(':');
}

/**
 * Given a content type and a slug, returns a URI string that represents the content's location.
 * If the content type is 'general', the URI will only contain the slug.
 * If the content contains separator '~', the function will return undefined.
 * @param contentType The type of the content.
 * @param slug The slug of the content.
 * @returns A URI string that represents the content's location, or undefined if the slug starts with 'section~'.
 */
function makeUriFromContentTypeSlug(contentType: ContentType, slug: string): string | undefined {
  if (slug.includes('~')) {
    return undefined;
  }
  if (contentType === 'general') {
    return `/${slug}`;
  }
  return `/${contentType}/${slug}`;
}

function makeUrlFromContentTypeSlug(hostName: string, contentType: ContentType, slug: string): URL | undefined {
  const uri = makeUriFromContentTypeSlug(contentType, slug);
  if (!uri) {
    return undefined;
  }
  return new URL(uri, hostName);
}

function makeUrlFromContent(hostName: string, content: BaseEntry): URL | undefined {
  return makeUrlFromContentTypeSlug(hostName, content.type, content.slug);
}

export {
  validateTypeSlug,
  validateRequest,
  isContentType,
  makeCacheKey,
  splitCacheKey,
  makeUriFromContentTypeSlug,
  makeUrlFromContentTypeSlug,
  makeUrlFromContent,
};
