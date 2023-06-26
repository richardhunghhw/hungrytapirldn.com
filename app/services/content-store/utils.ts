import { ContentStoreEntry, ContentType } from './store';

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
    makeCacheKey,
    splitCacheKey,
    makeUrlFromContentTypeSlug,
    makeUrlFromContent,
};
