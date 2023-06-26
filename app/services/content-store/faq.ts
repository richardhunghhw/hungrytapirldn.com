import { HTAppLoadContext } from '~/utils/types';
import { getContentByTypeSlug, listAllContentByType } from './store';

async function getFaq(context: HTAppLoadContext, slug: string) {
    const entry = await getContentByTypeSlug(context, 'faq', slug);
    return entry;
}

async function listFaqs(context: HTAppLoadContext) {
    const entries = await listAllContentByType(context, 'faq');
    return entries;
}

export { getFaq, listFaqs };
