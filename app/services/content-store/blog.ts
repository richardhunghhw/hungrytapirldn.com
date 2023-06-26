import { HTAppLoadContext } from '~/utils/types';
import { getContentByTypeSlug, listAllContentByType } from './store';

async function getBlog(context: HTAppLoadContext, slug: string) {
    const entry = await getContentByTypeSlug(context, 'blog', slug);
    return entry;
}

async function listBlogs(context: HTAppLoadContext) {
    const entries = await listAllContentByType(context, 'blog');
    return entries;
}

export { getBlog, listBlogs };
