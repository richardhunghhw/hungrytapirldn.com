import type { ContentStoreEntry, ContentType } from '.';

export type UrlPath = {
    type: ContentType;
    slug: string;
};

function allContentTypes(): ContentType[] {
    return ['general', 'blog', 'product', 'faq'];
}

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

function makeUrlFromContentTypeSlug(
    hostName: string,
    contentType: ContentType,
    slug: string
): URL {
    return new URL(`/${contentType}/${slug}`, hostName);
}

function makeUrlFromContent(hostName: string, content: ContentStoreEntry): URL {
    return makeUrlFromContentTypeSlug(hostName, content.type, content.slug);
}

export {
    allContentTypes,
    validateTypeSlug,
    validateRequest,
    isContentType,
    makeCacheKey,
    splitCacheKey,
    makeUrlFromContentTypeSlug,
    makeUrlFromContent,
};
