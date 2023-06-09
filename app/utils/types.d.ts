import { AppLoadContext } from '@remix-run/cloudflare';

export type HTAppLoadContext = AppLoadContext & {
    /** Base **/
    readonly NODE_ENV: string;
    readonly HOST_URL: string;

    readonly SESSION_SECRET: string;

    /** Feature Toggles */
    readonly CONTENT_STORE_CACHE_ENABLED: boolean;

    /** Cloudflare Workers **/

    // KV namespaces
    readonly CONTENT_STORE: KVNamespace;
    readonly SESSION_STORE: KVNamespace;

    // Durable Objects

    /** Stripe **/

    /** Notion **/
    readonly NOTION_API_SECRET: string;

    readonly NOTION_API_DB_BLOG: string;
    readonly NOTION_API_DB_FAQ: string;
    readonly NOTION_API_DB_PRODUCTS: string;
};

export type JSONValue =
    | { [key: string]: JSONValue }
    | Array<JSONValue>
    | string
    | number
    | boolean;
