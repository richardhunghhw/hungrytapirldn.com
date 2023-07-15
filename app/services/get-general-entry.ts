import { redirect } from '@remix-run/cloudflare';
import { isProd } from '~/utils/misc';
import type { HTAppLoadContext } from '~/utils/types';
import { getGeneral } from './content-store';

async function getGeneralEntry(context: HTAppLoadContext, slug: string) {
  try {
    const result = await getGeneral(context, slug);
    if (!result) {
      // todo sentry error
      throw new Error('Entry not found');
    }
    return result;
  } catch (error) {
    console.error(error); // TODO badlink
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export { getGeneralEntry };
