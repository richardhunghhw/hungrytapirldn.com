import * as Sentry from '@sentry/remix';
import type { ActionArgs } from '@remix-run/cloudflare';

// Fetch all content data from content-store
export async function action({ context, request }: ActionArgs) {
  if (!context.services.apiAuth.auth(request.headers)) {
    console.debug('api/refresh-content auth failed');
    return new Response(
      JSON.stringify({
        message: 'Unauthorized',
      }),
      context.services.apiAuth.responseOptions.fail,
    );
  } else {
    console.info('Recieved authenticated request for api/refresh-content');
    const { searchParams } = new URL(request.url);
    const purgeCache = searchParams.get('purge') == 'true';
    const purgeTypes = searchParams.get('types') ? searchParams.get('types')?.split(',') : [];
    const replaceImages = searchParams.get('images') == 'true';
    return await context.services.apiRefresh
      .refreshAllEntries(purgeCache, purgeTypes, replaceImages)
      .then(() => context.services.apiAuth.responseOptions.success)
      .catch((err) => {
        Sentry.captureException(err);
        console.error(err);
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
