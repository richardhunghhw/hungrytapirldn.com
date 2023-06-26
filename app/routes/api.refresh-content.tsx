import { AUTH_FAIL_RESPONSE, auth } from '~/services/authenticate';
import type { HTActionArgs } from '~/utils/types';
import { refreshAllEntries } from '~/services/content-store';
import * as Sentry from '@sentry/remix';

// Fetch all content data from content-store
export async function action({ request, context }: HTActionArgs) {
    if (auth(request) === false) {
        console.debug('api/refresh-content auth failed');
        return new Response(
            JSON.stringify({
                message: 'Unauthorized',
            }),
            AUTH_FAIL_RESPONSE
        );
    } else {
        const { searchParams } = new URL(request.url);
        const purgeCache = searchParams.get('purgeCache') === 'true';
        return await refreshAllEntries(context, purgeCache)
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
