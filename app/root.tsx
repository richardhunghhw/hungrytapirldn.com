import type { LinksFunction, LoaderArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';

import stylesheet from '~/styles/tailwind.css';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Navbar />
                <Outlet />
                <Footer />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesheet }];
};

export function ErrorBoundary() {
    const error = useRouteError();

    // when true, this is what used to go to `CatchBoundary`
    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>Oops</h1>
                <p>Status: {error.status}</p>
                <p>{error.data.message}</p>
            </div>
        );
    }

    // Don't forget to typecheck with your own logic.
    // Any value can be thrown, not just errors!
    let errorMessage = 'Unknown error';
    // if (isDefinitelyAnError(error)) {
    //     errorMessage = error.message;
    // }

    return (
        <div>
            <h1>Uh oh ...</h1>
            <p>Something went wrong.</p>
            <pre>{errorMessage}</pre>
        </div>
    );
}

export default withSentry(App);
