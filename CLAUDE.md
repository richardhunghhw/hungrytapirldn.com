# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs CSS watcher + Remix watcher + Wrangler local dev server concurrently)
npm run dev

# Build (runs CSS build + Remix build concurrently)
npm run build

# Type checking
npm run typecheck

# Tests
npm test

# Tail logs
npm run logs:test   # preview environment
npm run logs:prod   # production environment
```

## Architecture

This is a **Remix SSR app** deployed on **Cloudflare Pages** for Hungry Tapir London, a food e-commerce business. The server runtime is Cloudflare Workers.

### Layered structure

```
Routes (app/routes/) → Services (server/services/) → Repositories (server/repositories/) → External APIs
```

**`server.ts`** is the Cloudflare Pages function entry point. It performs dependency injection — instantiating all repositories and services and passing them into the Remix request handler via `context`. Routes access these via `context.services.*`.

### Content system

Content is stored in **Notion** and cached in **Cloudflare Workers KV**. There are 5 content types defined in `server/entities/content.ts`: `general`, `blog`, `product`, `faq`, `stalldate`.

- `NotionRepository` fetches raw data from the Notion API
- `ContentKVRepository` caches that data in KV with configurable TTL
- `ContentService` orchestrates cache-first retrieval
- `ApiRefreshService` triggers a re-fetch from Notion into KV (used by the `/api/refresh-content` route and a GitHub Actions workflow)

### Cart & sessions

Cart state lives in an **encrypted cookie-backed session** stored in KV (`SessionKVRepository`). `CartService` handles add/update/remove operations. The root route (`app/root.tsx`) loads cart state and handles cart form actions.

### Image handling

Images are served via **ImageKit CDN**. `ImageKitRepository` constructs CDN URLs; `ImageService` applies transformations. The `<CdnImage>` component (`app/components/cdn-image.tsx`) is the standard way to render images.

### Environment variables

All env vars are validated at startup using a **Zod schema** in `server/env.ts`. This covers Stripe, Notion, Sentry, ImageKit, KV bindings, and session secrets. The schema is the authoritative reference for required configuration.

### Key external integrations

| Service | Purpose |
|---------|---------|
| Notion API | Headless CMS — products, blog posts, FAQs, stall dates |
| Stripe | Checkout sessions and payment processing |
| ImageKit | Image CDN with on-the-fly transforms |
| Sentry | Error tracking (initialised in `entry.client.tsx` and `entry.server.tsx`) |
| Cloudflare Workers KV | Content cache + encrypted session storage |

### Routing conventions

Remix file-based routing under `app/routes/`. Nested layout routes use the `_layout.page.tsx` naming pattern (e.g. `_general.tsx` wraps `_general.about-us.tsx`). Dynamic segments use `$slug` (e.g. `blog.$slug.tsx`).

### Styling

Tailwind CSS with a custom theme defined in `tailwind.config.ts` (custom `ht-*` brand colours, custom fonts). shadcn/ui components live in `app/components/ui/`. The source stylesheet is `app/styles/tailwind.css`; the compiled output `app/styles/app.css` is gitignored and generated at build time.

## Deployment

Pushes to `main` or `develop` trigger automated Cloudflare Pages deployments via `.github/workflows/deploy-cf-pages.yml`. Infrastructure is defined in `terraform.tf`.
