import { AUTH_FAIL_RESPONSE, auth } from '~/services/authenticate';
import type { HTActionArgs } from '~/utils/types';
import { refreshAllEntries } from '~/services/content-store';
import * as Sentry from '@sentry/remix';

// Fetch all content data from content-store
export async function action({ context, request }: HTActionArgs) {
  if (auth(context, request) === false) {
    console.debug('api/refresh-content auth failed');
    return new Response(
      JSON.stringify({
        message: 'Unauthorized',
      }),
      AUTH_FAIL_RESPONSE,
    );
  } else {
    console.info('Recieved authenticated request for api/refresh-content');
    const { searchParams } = new URL(request.url);
    const purgeCache = searchParams.get('purge') == 'true';
    const purgeTypes = searchParams.get('types') ? searchParams.get('types')?.split(',') : [];
    const replaceImages = searchParams.get('images') == 'true';
    return await refreshAllEntries(context, purgeCache, purgeTypes, replaceImages)
      .then(() => {
        return {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
          body: {
            message: 'Success',
          },
        };
      })
      .catch((err) => {
        // todo sentry error
        Sentry.captureException(err);
        return {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
          },
          body: {
            message: 'Exception occured while refreshing content',
          },
        };
      });
  }
}
