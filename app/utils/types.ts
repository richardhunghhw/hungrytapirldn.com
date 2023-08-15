import type { AppLoadContext } from '@remix-run/cloudflare';

export type JSONObject = { [key: string]: JSONValue };

export type JSONValue = JSONObject | Array<JSONValue> | string | number | boolean;

export type HTAppLoadContext = AppLoadContext & {
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
  readonly CONFIGSTORE_WORKER: ServiceWorkerGlobalScope;

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
  readonly IMAGEKIT_URL_ENDPOINT: string;
  readonly IMAGEKIT_PUBLIC_KEY: string;
  readonly IMAGEKIT_PRIVATE_KEY: string;
};

interface HTDataFunctionArgs {
  request: Request;
  context: HTAppLoadContext;
  params: Params;
}

export type HTLoaderArgs = HTDataFunctionArgs;
export type HTActionArgs = HTDataFunctionArgs;

export type Product = {
  id: string;
  stripe_id: string;
  slug: string;

  name: string;
  sectionDescription: string;
  description: string;
  ingredients: string[];

  imageSrc: string;
  imageAlt: string;

  price: number;
  unit: string;
};
