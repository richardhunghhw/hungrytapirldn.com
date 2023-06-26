import { HTAppLoadContext } from '~/utils/types';
import { getContentByTypeSlug, listAllContentByType } from './store';

async function getProduct(context: HTAppLoadContext, slug: string) {
    const entry = await getContentByTypeSlug(context, 'product', slug);
    return entry;
}

async function listProducts(context: HTAppLoadContext) {
    const entries = await listAllContentByType(context, 'product');
    return entries;
}

export { getProduct, listProducts };
