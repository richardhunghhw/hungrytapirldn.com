import { LinksFunction, LoaderArgs, redirect } from '@remix-run/cloudflare';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';

import stylesheet from '~/styles/tailwind.css';
import Navbar from './components/navbar';
import Footer from './components/footer';

export async function loader({ params, request }: LoaderArgs) {
    if (
        params?.NODE_ENV === 'PROD' &&
        new URL(request.url).pathname !== '/coming-soon'
    ) {
        return redirect('/coming-soon');
    }
    return null;
}

export default function App() {
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
