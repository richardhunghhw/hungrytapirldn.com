import type { AppLoadContext } from '@remix-run/cloudflare';

export type JSONValue =
    | { [key: string]: JSONValue }
    | Array<JSONValue>
    | string
    | number
    | boolean;

export type HTAppLoadContext = AppLoadContext & {
    /** Base */
    readonly NODE_ENV: string;
    readonly HOST_URL: string;

    readonly SESSION_SECRET: string;
    readonly ENCRYPTION_SECRET: string;

    /** KV namespaces */
    readonly CONTENT_STORE: KVNamespace;
    readonly CONTENT_STORE_CACHE_ENABLED: boolean; // Feature toggle

    readonly SESSION_STORE: KVNamespace;

    /** Store Config Worker */
    readonly CONFIGSTORE_WORKER: ServiceWorkerGlobalScope;

    /** Stripe */
    readonly STRIPE_PUBLIC_KEY: string;
    readonly STRIPE_SECRET_KEY: string;

    /** Notion */
    readonly NOTION_API_SECRET: string;

    readonly NOTION_API_DB_BLOG: string;
    readonly NOTION_API_DB_FAQ: string;
    readonly NOTION_API_DB_PRODUCTS: string;
};

interface HTDataFunctionArgs {
    request: Request;
    context: HTAppLoadContext;
    params: Params;
}

export type HTLoaderArgs = HTDataFunctionArgs;
export type HTActionArgs = HTDataFunctionArgs;
