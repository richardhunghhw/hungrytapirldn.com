# Migration Plan — Hungry Tapir London

**Date:** 2026-04-02
**Branches:** `develop` → TEST environment · `main` → PROD environment
**Deployment:** Push to `develop` or `main` triggers Cloudflare Pages deploy, followed by automatic content refresh via `refresh-trigger.yml`

---

## Deployment Flow Reference

```
Feature branch → develop (TEST) → validate → main (PROD)
```

- `develop` push → Cloudflare Pages TEST deploy → auto refresh `/api/refresh-content?purge=true` on TEST host
- `main` push → Cloudflare Pages PROD deploy → auto refresh `/api/refresh-content?purge=true` on PROD host
- Scheduled Notion refreshes: every 2 days on TEST, every Sunday on PROD (disable once Phase 2 is complete)

---

## Phase 1 — Dependency Updates

> **Goal:** Bring all major dependencies to current versions. This is the highest-risk phase and must be fully stable before proceeding.

### 1.1 — Remix 1.x → 2.x

**Tasks:**
- [ ] Update `@remix-run/cloudflare`, `@remix-run/react`, `@remix-run/dev` to `^2`
- [ ] Enable Remix v2 future flags in `remix.config.mjs` incrementally (`v2_routeConvention`, `v2_meta`, `v2_errorBoundary`, `v2_headers`, `v2_normalizeFormMethod`, `v2_dev`)
- [ ] Migrate all route `meta` exports to the new array-based v2 API
- [ ] Migrate `ErrorBoundary` / `CatchBoundary` exports — v2 merges these into a single `ErrorBoundary`
- [ ] Migrate `headers` exports to v2 signature
- [ ] Update `entry.server.tsx` and `entry.client.tsx` (Remix 2 changed server render streaming APIs)
- [ ] Verify `createPagesFunctionHandler` import from `@remix-run/cloudflare-pages` still works under v2
- [ ] Run `npm run typecheck` and resolve all type errors introduced by the upgrade
- [ ] Run `npm test` and fix any broken tests

**Checkpoint — TEST:**
- Push to `develop`
- Verify Cloudflare Pages build succeeds in CI
- Smoke test: home page, product listing, product detail, blog, FAQ, cart add/remove, checkout redirect
- Check Sentry TEST environment for new errors introduced by the migration

**Checkpoint — PROD:**
- Merge to `main` after TEST is stable for 24 hours
- Repeat smoke test on PROD URL
- Monitor Sentry PROD for 24 hours post-deploy

**Acceptance Criteria:**
- [ ] CI build passes on `develop` and `main`
- [ ] Zero new Sentry errors in TEST before promoting to PROD
- [ ] All existing routes return HTTP 200 (no regressions)
- [ ] Cart functionality works end-to-end (add item → checkout → Stripe redirect)
- [ ] `npm run typecheck` exits 0

---

### 1.2 — Wrangler 2 → 3 + Cloudflare Types

**Tasks:**
- [ ] Update `wrangler` devDep to `^3`
- [ ] Update `@cloudflare/workers-types` to `^4`
- [ ] Update `compatibility_date` in `wrangler.toml` to `2024-09-23` (latest stable)
- [ ] Update GitHub Actions `wranglerVersion` in `deploy-cf-pages.yml` (already set to `'3'` — confirm correct)
- [ ] Review `onRequest` handler in `server.ts` for any CF Pages v3 API changes
- [ ] Test local dev with `npm run dev` to confirm wrangler local server starts correctly

**Checkpoint — TEST:**
- Push to `develop`
- Verify KV bindings still resolve (`CONTENT_STORE`, `SESSION_STORE`)
- Verify session-backed cart survives across requests

**Checkpoint — PROD:**
- Merge after 24h stable TEST

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors locally
- [ ] KV reads/writes work in TEST (content loads, cart persists)
- [ ] No regression in `npm run typecheck`

---

### 1.3 — Sentry 7 → 8

**Tasks:**
- [ ] Update `@sentry/remix` to `^8`
- [ ] Update Sentry initialisation in `entry.server.tsx` to v8 API (`Sentry.init` options changed)
- [ ] Update Sentry initialisation in `entry.client.tsx`
- [ ] Update Cloudflare Workers integration (v8 uses `Sentry.cloudflareWorkers()` or `wrapRequestHandler`)
- [ ] Verify source map upload in `deploy-cf-pages.yml` still works with `getsentry/action-release@v1`
- [ ] Confirm `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` env vars still satisfy v8 CLI

**Checkpoint — TEST:**
- Push to `develop`
- Trigger a deliberate error (or check Sentry TEST dashboard) to confirm events are arriving
- Confirm source maps resolve stack traces correctly in Sentry TEST

**Checkpoint — PROD:**
- Merge after Sentry TEST events confirmed

**Acceptance Criteria:**
- [ ] Sentry TEST environment receives error events with correct stack traces
- [ ] Sentry release is created and linked to source maps in CI
- [ ] No `SENTRY_DEBUG` noise in production logs

---

### 1.4 — Stripe, Jest, and Remaining Packages

**Tasks:**
- [ ] Update `stripe` to `^14` — review breaking changes in `stripe.ts` (checkout session API, `shipping_options` format)
- [ ] Update `jest` to `^29` — update `jest.config.*`, replace deprecated `testEnvironment` value if needed
- [ ] Update `tailwindcss` to `^3.4`
- [ ] Update `lucide-react` to latest — audit icon names that may have been renamed/removed
- [ ] Update all `@radix-ui/*` packages to latest
- [ ] Update `zod` to `^3.24`
- [ ] Update `imagekit` to `^5`, `imagekitio-react` to latest
- [ ] Update `markdown-to-jsx` to latest
- [ ] Update `remix-utils` to latest (check for Remix v2 compatibility)
- [ ] Update GitHub Actions: `actions/checkout@v3` → `@v4`, `cloudflare/pages-action@v1` → latest

**Checkpoint — TEST:**
- Push to `develop`
- Full smoke test (all routes, cart, checkout)
- Run full test suite: `npm test`
- Visual check on all pages for icon/style regressions (lucide, Radix, Tailwind changes)

**Checkpoint — PROD:**
- Merge after TEST smoke test passes

**Acceptance Criteria:**
- [ ] `npm test` passes
- [ ] `npm run typecheck` exits 0
- [ ] No visual regressions on key pages (home, product, cart)
- [ ] Stripe checkout redirect still works in TEST (Stripe test mode)

---

## Phase 2 — Static Local Content (Notion CMS Removal)

> **Goal:** Replace live Notion API calls with static JSON files bundled into the deployment. Keep Notion implementation behind a `USE_LOCAL_CONTENT` feature flag.

### 2.1 — Export Notion Content to Static Files

**Tasks:**
- [ ] Write a one-time export script (`scripts/export-content.ts`) that:
  - Calls the existing `ApiRefreshService` flow (or reads KV directly via Wrangler CLI)
  - Writes output to `server/content/{type}/{slug}.json` matching `ContentStore*` entity shapes
  - Exports all 5 content types: `general`, `blog`, `product`, `faq`, `stalldate`
- [ ] Run the export against TEST KV: `wrangler kv:key list` + `wrangler kv:key get` for each entry
- [ ] Commit the exported JSON files to the repo under `server/content/`
- [ ] Verify JSON files are complete and match expected entity shapes (spot-check 3–5 entries per type)

**Checkpoint — Local only (no deploy yet)**

**Acceptance Criteria:**
- [ ] `server/content/` contains JSON for all content types
- [ ] Each JSON file validates against the corresponding `ContentStore*` TypeScript type
- [ ] Exported products include Stripe IDs, prices, images, and enabled flag
- [ ] Exported stall dates include future dates (if any) and location data

---

### 2.2 — Feature Flag + LocalContentRepository

**Tasks:**
- [ ] Add `USE_LOCAL_CONTENT: z.coerce.boolean().default(false)` to `server/env.ts`
- [ ] Make all Notion-specific env vars (5x `NOTION_API_DB_*`, `NOTION_API_SECRET`, `CACHE_TTL_DAYS`) `.optional()` when `USE_LOCAL_CONTENT=true` — use a Zod `.superRefine()` cross-field validator
- [ ] Create `server/repositories/local-content.ts`:
  - Loads all JSON files from `server/content/` at module initialisation (bundled as static assets)
  - Implements same interface as `ContentKVRepository`: `getEntry(type, slug)`, `listKeys(type)`
  - Returns `null` for missing entries (matches existing KV behaviour)
- [ ] Update `server.ts` dependency injection:
  ```ts
  const contentRepo = env.USE_LOCAL_CONTENT
    ? new LocalContentRepository()
    : new ContentKVRepository(env.CONTENT_STORE);
  const notionRepo = env.USE_LOCAL_CONTENT ? null : new NotionRepository(env);
  ```
- [ ] Update `ApiRefreshService` to accept `notionRepo` as nullable (no-op when null)
- [ ] Set `USE_LOCAL_CONTENT=true` in TEST Cloudflare Pages environment variable (via Cloudflare dashboard or `wrangler pages env`)

**Checkpoint — TEST:**
- Push to `develop` with `USE_LOCAL_CONTENT=true` set in TEST env
- The automatic `refresh-trigger.yml` post-deploy call to `/api/refresh-content` should no-op gracefully
- Smoke test all content routes: home, product listing, product detail, blog, FAQ, about/general pages
- Verify stall dates display correctly
- Check Sentry TEST for any errors during content loading

**Checkpoint — PROD:**
- Set `USE_LOCAL_CONTENT=true` in PROD Cloudflare Pages environment variable
- Merge to `main`
- Repeat smoke test on PROD

**Acceptance Criteria:**
- [ ] All content routes load correctly from static files (no KV reads for content)
- [ ] Notion API is never called when `USE_LOCAL_CONTENT=true` (confirm by checking no outbound Notion requests in logs)
- [ ] `/api/refresh-content` returns a graceful 200/no-op response when `USE_LOCAL_CONTENT=true`
- [ ] `npm run typecheck` exits 0
- [ ] No new Sentry errors in TEST after 24 hours

---

### 2.3 — Disable Notion Scheduled Workflows

**Tasks:**
- [ ] Disable the scheduled cron triggers in `refresh-trigger.yml` (`0 5 * * 0` and `0 7 */2 * *`) — keep the `workflow_run` trigger as a no-op safety net
- [ ] Remove Notion secrets from `refresh-trigger.yml` 1Password load steps (or leave commented for rollback)
- [ ] Update CI to no longer require `NOTION_API_*` secrets (add conditional skip to build if `USE_LOCAL_CONTENT=true`)

**Checkpoint — TEST then PROD (same flow as 2.2)**

**Acceptance Criteria:**
- [ ] No scheduled Notion refresh runs after this change
- [ ] CI build still passes without Notion secrets being required
- [ ] Rollback path documented: set `USE_LOCAL_CONTENT=false` in Cloudflare env vars to revert to Notion

---

## Phase 3 — Performance Optimisations

> **Goal:** Reduce cold start time, page load latency, and bundle size under Cloudflare Workers.

### 3.1 — Eliminate getAllProducts N+1 KV Fetches

**Tasks:**
- [ ] Add a `products/all.json` aggregate file to `server/content/products/all.json` (generated during Phase 2.1 export)
- [ ] Update `LocalContentRepository` to serve `listProducts()` from the aggregate file as a single read
- [ ] Update `ContentService.getAllProducts()` to use `listProducts()` aggregate instead of fetching each product individually
- [ ] Verify `root.tsx` still receives the correct product list on every request

**Checkpoint — TEST then PROD**

**Acceptance Criteria:**
- [ ] Product listing page loads with a single content read (verify via Sentry performance trace or CF logs)
- [ ] No functional regression in product data displayed

---

### 3.2 — Pre-compute Stall Date Queries

**Tasks:**
- [ ] Add `server/content/stalldate/upcoming.json` containing stall dates sorted by start time (generated in export script)
- [ ] Update `ContentService.getNextStallDates(n)` to read from `upcoming.json` and slice, removing the sort-on-every-call logic
- [ ] Remove the TODO comment: "optimise this with a cache" from `content.ts`

**Checkpoint — TEST then PROD**

**Acceptance Criteria:**
- [ ] Next stall dates component renders correctly on home page
- [ ] `getNextStallDates` makes a single file read

---

### 3.3 — HTTP Cache Headers

**Tasks:**
- [ ] Add `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` to all static content routes (product, blog, FAQ, general pages) via `headers` export in each route
- [ ] Update `public/_headers` to add aggressive caching for font and image assets (`Cache-Control: public, max-age=31536000, immutable`)
- [ ] Ensure cart and checkout routes are excluded from caching (`Cache-Control: no-store`)

**Checkpoint — TEST then PROD**

**Acceptance Criteria:**
- [ ] `curl -I` on a product page returns correct `Cache-Control` header
- [ ] Cart state is not cached (confirm with browser devtools)
- [ ] Cloudflare edge cache hit rate improves (visible in CF dashboard analytics)

---

### 3.4 — Bundle Size Reduction

**Tasks:**
- [ ] Audit bundle with `wrangler pages functions build --outdir=dist` + analyse output size
- [x] Replace `imagekitio-react` with a custom `IKImage` component (`app/components/ik-image.tsx`) — package shipped Babel-compiled async generators requiring `regeneratorRuntime`, causing a crash on every page load
- [ ] Re-implement LQIP (low-quality image placeholder) in `IKImage` — was dropped as part of the crash fix; use a blurred low-res ImageKit URL as a CSS background then crossfade to the full image on load
- [ ] Remove `@notionhq/client` from the bundle when `USE_LOCAL_CONTENT=true` — ensure it's only imported inside server-only modules that are not bundled when the flag is off
- [ ] Remove unused Radix UI imports (import only the specific `@radix-ui/react-*` packages in use)
- [ ] Review `dompurify` — use `isomorphic-dompurify` or server-only import to avoid bundling browser polyfills

**Checkpoint — TEST then PROD**

**Acceptance Criteria:**
- [ ] Worker bundle size reduced by ≥10% compared to Phase 1 baseline (record baseline before starting)
- [ ] `npm run build` completes without warnings about large bundle size
- [ ] All pages still render correctly after tree-shaking changes

---

### 3.5 — Sentry Performance Tuning

**Tasks:**
- [ ] Audit current `SENTRY_TRACES_SAMPLE_RATE` and replay sample rates in 1Password — confirm not set to `1.0` in PROD
- [ ] Recommended PROD values: `SENTRY_TRACES_SAMPLE_RATE=0.1`, `SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.05`, `SENTRY_REPLAYS_ONERROR_SAMPLE_RATE=1.0`
- [ ] Update 1Password vault values accordingly

**Checkpoint — TEST then PROD**

**Acceptance Criteria:**
- [ ] Sentry PROD is not sampling 100% of traces
- [ ] Sentry still receives error events (confirm with a test error)

---

## Phase 4 — Bug Fixes & Cleanup

> These can be addressed alongside Phase 3 or in a dedicated cleanup pass.

### 4.1 — Fix Session Cookie Max-Age

**Tasks:**
- [ ] Locate session cookie `maxAge` setting in `server/repositories/session-kv.ts`
- [ ] Change from 60 seconds to an appropriate duration (e.g. `60 * 60 * 24 * 7` = 7 days)
- [ ] Test cart persistence across browser tab close and reopen

**Acceptance Criteria:**
- [ ] Cart contents persist for 7 days without activity
- [ ] Session cookie `Max-Age` header reflects the new value in browser devtools

---

### 4.2 — KV List Pagination Guard

**Tasks:**
- [ ] Update `ContentKVRepository.listKeys()` to use cursor-based pagination instead of a hard limit of 1000
- [ ] Remove Sentry warning once pagination is implemented (the warning becomes unnecessary)
- [ ] This applies even when `USE_LOCAL_CONTENT=true` — the KV repo is still used for sessions

**Acceptance Criteria:**
- [ ] `listKeys()` returns all entries regardless of count
- [ ] No Sentry warning about KV list limit

---

### 4.3 — Remove Dead Code

**Tasks:**
- [ ] Remove or archive `server/services/conversion-dispatcher.ts` and `workers/conversion-dispatcher/` (marked "WNSA: we are not selling anything")
- [ ] Remove `CONVERSION_DISPATCHER_QUEUE` from `server/env.ts` if no longer used
- [ ] Remove the `ConversionDispatcher` instantiation from `server.ts`
- [ ] Remove `deploy-cf-worker-store-config.yml` trigger if `store-config` worker is no longer needed (audit first)

**Acceptance Criteria:**
- [ ] No references to `ConversionDispatcher` remain in active code
- [ ] `npm run typecheck` and `npm test` still pass

---

### 4.4 — API Refresh Route Hardening

**Tasks:**
- [ ] Add proper query param validation on `app/routes/api.refresh-content.tsx` for `purge`, `types`, and `images` params (Zod parse)
- [ ] When `USE_LOCAL_CONTENT=true`, return a 200 with `{ message: "Notion refresh disabled (USE_LOCAL_CONTENT=true)" }` body
- [ ] Ensure auth check runs before any param validation

**Acceptance Criteria:**
- [ ] Invalid `types` param returns 400 with clear error message
- [ ] Route is still protected by basic auth

---

## Rollback Procedures

| Phase | Rollback Action |
|-------|----------------|
| Phase 1 (deps) | Revert version bumps, push to `develop`, re-merge `main` |
| Phase 2 (local content) | Set `USE_LOCAL_CONTENT=false` in Cloudflare Pages env vars (no redeploy needed) |
| Phase 3 (perf) | Revert specific cache header or bundle changes, push to `develop` |
| Phase 4 (bugs) | Standard git revert |

---

## Environment Variable Changes Summary

| Variable | Phase | Change |
|----------|-------|--------|
| `USE_LOCAL_CONTENT` | 2.2 | New — set to `true` in both TEST and PROD |
| `NOTION_API_*` (×6) | 2.3 | Becomes optional once `USE_LOCAL_CONTENT=true` |
| `CACHE_TTL_DAYS` | 2.3 | Becomes optional once `USE_LOCAL_CONTENT=true` |
| `SENTRY_TRACES_SAMPLE_RATE` | 3.5 | Reduce to `0.1` in PROD |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | 3.5 | Reduce to `0.05` in PROD |
