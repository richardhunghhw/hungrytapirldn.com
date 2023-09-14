import type { Notion } from '~/server/repositories/notion';
import type { Cart } from '~/server/services/cart';
import type { ApiAuth } from '~/server/services/api-auth';
import type { Content } from '~/server/services/content';
import type { Stripe } from '~/server/services/stripe';
import type { ContentKv } from '~/server/repositories/content-kv';
import type { ApiRefresh } from '~/server/services/api-refresh';

export type HTEnv = {
  /** Base */
  readonly NODE_ENV: string;
  readonly HOST_URL: string;

  readonly SESSION_SECRET: string;
  readonly ENCRYPTION_SECRET: string;

  /** Basic Auth */
  readonly BASIC_AUTH_USERNAME: string;
  readonly BASIC_AUTH_PASSWORD: string;

  /** KV namespaces */
  readonly CONTENT_STORE: KVNamespace;
  readonly SESSION_STORE: KVNamespace;

  /** Store Config Worker */
  // readonly CONFIGSTORE_WORKER: ServiceWorkerGlobalScope;
  readonly CONFIGSTORE_WORKER_URL: string;

  /** Stripe */
  readonly STRIPE_PUBLIC_KEY: string;
  readonly STRIPE_SECRET_KEY: string;

  /** Notion */
  readonly CACHE_TTL_DAYS: number;
  readonly NOTION_API_SECRET: string;

  readonly NOTION_API_DB_GENERAL: string;
  readonly NOTION_API_DB_BLOG: string;
  readonly NOTION_API_DB_FAQ: string;
  readonly NOTION_API_DB_PRODUCTS: string;
  readonly NOTION_API_DB_STALLDATE: string;

  /** ImageKit */
  readonly IMAGEKIT_PUBLIC_KEY: string;
  readonly IMAGEKIT_PRIVATE_KEY: string;

  /** Sentry */
  readonly SENTRY_DEBUG: boolean;
  readonly SENTRY_ENV: string;
  readonly SENTRY_DSN: string;
  readonly SENTRY_TRACES_SAMPLE_RATE: number;
  readonly SENTRY_REPLAYS_SESSION_SAMPLE_RATE: number;
  readonly SENTRY_REPLAYS_ONERROR_SAMPLE_RATE: number;
};

export type HTRepos = {
  notion: Notion;
  contentKv: ContentKv;
};

export type HTServices = {
  cart: Cart;
  apiAuth: ApiAuth;
  stripe: Stripe;
  content: Content;
  apiRefresh: ApiRefresh;
};

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: HTEnv;
    repos: HTRepos;
    services: HTServices;
  }
}
