import { z } from 'zod';

export let EnvSchema = z.object({
  NODE_ENV: z.string().min(1),
  HOST_URL: z.string().url(),

  SESSION_SECRET: z.string().min(1),
  ENCRYPTION_SECRET: z.string().min(1),

  BASIC_AUTH_USERNAME: z.string().min(1),
  BASIC_AUTH_PASSWORD: z.string().min(1),

  CONTENT_STORE: z.any(),
  SESSION_STORE: z.any(),

  CONFIGSTORE_WORKER: z.any(),

  STRIPE_PUBLIC_KEY: z.string().length(107),
  STRIPE_SECRET_KEY: z.string().length(107),

  CACHE_TTL_DAYS: z.coerce.number().min(1),
  NOTION_API_SECRET: z.string().length(50),
  NOTION_API_DB_GENERAL: z.string().length(32),
  NOTION_API_DB_BLOG: z.string().length(32),
  NOTION_API_DB_FAQ: z.string().length(32),
  NOTION_API_DB_PRODUCT: z.string().length(32),
  NOTION_API_DB_STALLDATE: z.string().length(32),

  IMAGEKIT_PUBLIC_KEY: z.string().length(35),
  IMAGEKIT_PRIVATE_KEY: z.string().length(36),

  SENTRY_DEBUG: z.coerce.boolean(),
  SENTRY_ENV: z.string().min(1),
  SENTRY_DSN: z.string().url(),
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number(),
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number(),
  SENTRY_REPLAYS_ONERROR_SAMPLE_RATE: z.coerce.number(),
});

export type Env = z.infer<typeof EnvSchema>;
