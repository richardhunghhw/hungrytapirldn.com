import { TryCatch } from '@sentry/remix';
import { AUTH_FAIL_RESPONSE, auth } from '~/services/authenticate';
import { purgeAndRebuildAll } from '~/services/content-store';
import { HTActionArgs } from '~/utils/types';
import * as Sentry from '@sentry/remix';

// Fetch all content data from content-store
export async function action({ request, context }: HTActionArgs) {
    // const transaction = Sentry.startTransaction({
    //     name: 'api-refresh-content',
    // });
    // const span = transaction.startChild({
    //     op: 'purgeAndRebuildAll',
    // });

    if (auth(request) === false) {
        console.debug('api/refresh-content auth failed');
        // span.setStatus(Sentry.spanStatusfromHttpCode(500));
        return new Response(
            JSON.stringify({
                message: 'Unauthorized',
            }),
            AUTH_FAIL_RESPONSE
        );
    } else {
        try {
            await purgeAndRebuildAll(context);
            // span.setStatus(Sentry.spanStatusfromHttpCode(200));
        } catch (e) {
            // span.setStatus(Sentry.spanStatusfromHttpCode(500));
            return {
                status: 500,
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: {
                    message: 'Exception occured while refreshing content',
                },
            };
        }
    }
    // span.finish();
    // transaction.finish();
    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: {
            message: 'Success',
        },
    };
}
