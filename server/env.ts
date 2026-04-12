import { z } from 'zod';

export let EnvSchema = z
  .object({
    NODE_ENV: z.string().min(1),
    HOST_URL: z.string().url(),

    SESSION_SECRET: z.string().min(1),
    ENCRYPTION_SECRET: z.string().min(1),

    BASIC_AUTH_USERNAME: z.string().min(1),
    BASIC_AUTH_PASSWORD: z.string().min(1),

    CONTENT_STORE: z.any().optional(),
    SESSION_STORE: z.any(),

    // CONFIGSTORE_WORKER: z.any(),
    CONFIGSTORE_WORKER_URL: z.string().url(),

    CONVERSION_DISPATCHER_QUEUE: z.any().optional(),

    STRIPE_PUBLIC_KEY: z.string().length(107),
    STRIPE_SECRET_KEY: z.string().length(107),

    /** Feature flag: serve content from bundled JSON files instead of KV + Notion */
    USE_LOCAL_CONTENT: z.coerce.boolean().default(false),

    /** Notion — only required when USE_LOCAL_CONTENT=false */
    CACHE_TTL_DAYS: z.coerce.number().min(1).optional(),
    NOTION_API_SECRET: z.string().length(50).optional(),
    NOTION_API_DB_GENERAL: z.string().length(32).optional(),
    NOTION_API_DB_BLOG: z.string().length(32).optional(),
    NOTION_API_DB_FAQ: z.string().length(32).optional(),
    NOTION_API_DB_PRODUCT: z.string().length(32).optional(),
    NOTION_API_DB_STALLDATE: z.string().length(32).optional(),

    IMAGEKIT_PUBLIC_KEY: z.string().length(35),
    IMAGEKIT_PRIVATE_KEY: z.string().length(36),

    SENTRY_DEBUG: z.coerce.boolean(),
    SENTRY_ENV: z.string().min(1),
    SENTRY_DSN: z.string().url(),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number(),
    SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number(),
    SENTRY_REPLAYS_ONERROR_SAMPLE_RATE: z.coerce.number(),
  })
  .superRefine((data, ctx) => {
    if (!data.USE_LOCAL_CONTENT) {
      // Notion + KV vars are required when not using local content
      if (!data.CONTENT_STORE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CONTENT_STORE'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.CACHE_TTL_DAYS) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['CACHE_TTL_DAYS'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_SECRET) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_SECRET'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_DB_GENERAL) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_DB_GENERAL'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_DB_BLOG) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_DB_BLOG'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_DB_FAQ) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_DB_FAQ'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_DB_PRODUCT) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_DB_PRODUCT'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
      if (!data.NOTION_API_DB_STALLDATE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['NOTION_API_DB_STALLDATE'], message: 'Required when USE_LOCAL_CONTENT=false' });
      }
    }
  });

export type Env = z.infer<typeof EnvSchema>;
