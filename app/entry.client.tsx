/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/remix';

Sentry.init({
  debug: __sentryDebug__,
  dsn: '__sentryDsn__',
  environment: '__sentryEnv__',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(useEffect, useLocation, useMatches),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: __sentryTracesSampleRate__,
  // Session Replay
  replaysSessionSampleRate: __sentryReplaysSessionSampleRate__,
  replaysOnErrorSampleRate: __sentryReplaysOnErrorSampleRate__,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
