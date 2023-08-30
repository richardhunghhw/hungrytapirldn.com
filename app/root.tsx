import type { LinksFunction, LoaderArgs } from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';

import stylesheet from '~/styles/tailwind.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { isDev } from './utils/misc';

export const links: LinksFunction = () => {
  return [
    { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    { rel: 'icon', href: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', href: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'stylesheet', href: stylesheet },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
      href: '/fonts/dela-gothic-one-v10-latin-regular.woff2',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
      href: '/fonts/space-mono-v12-latin-regular.woff2',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
      href: '/fonts/space-mono-v12-latin-700.woff2',
    },
  ];
};

const BYPASS_HEADERFOOTER_PATHS = ['/linkinbio'];

export async function loader({ context }: LoaderArgs) {
  return {
    hostUrl: context.env.HOST_URL,
    isDev: isDev(context),
  };
}

function App() {
  const loaderData = useLoaderData<typeof loader>();
  const isDev = loaderData?.isDev ?? false;

  const matches = useMatches();
  const pathname = matches.pop()?.pathname as string;

  return (
    <html lang='en'>
      <head>
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {!BYPASS_HEADERFOOTER_PATHS.includes(pathname) && <Navbar />}
        <Outlet />
        {!BYPASS_HEADERFOOTER_PATHS.includes(pathname) && <Footer />}
        <ScrollRestoration />
        <Scripts />
        {isDev && <LiveReload />}
      </body>
    </html>
  );
}

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
