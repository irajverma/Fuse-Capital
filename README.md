# Funded Experts Frontend 

The public marketing site for Funded Experts: Astro 6 on Cloudflare Workers
(`@astrojs/cloudflare`), Tailwind CSS 4, and a small set of island UI components.

Every page is prerendered. The only server code is three small API endpoints
(`/api/inquiry`, `/api/apply`, `/api/partnerships`) that verify Cloudflare Turnstile,
rate-limit, and validate form submissions. They are **validate-only stubs**: the real
intake runs elsewhere, so keep their request/response contracts exactly as they are.

## Getting started

Prerequisites: Node >= 22.12 and Corepack (`corepack enable` — Corepack ships with
Node and pins [pnpm](https://pnpm.io) to the version in `packageManager`, so you get
the right one without installing pnpm globally).

pnpm 10.25+ is required, and older versions fail in ways that do not name the real
cause: `pnpm-workspace.yaml` here carries settings (no `packages:` key, `allowBuilds`)
that only newer pnpm parses. On 9.x and 10.0–10.5 `pnpm install` aborts with
"packages field missing or empty"; on 10.6–10.24 it installs but warns
"Ignored build scripts: esbuild, sharp, workerd". Let Corepack handle it.

```bash
cp .env.dev.example .env.dev
pnpm install
pnpm dev
```

Local dev needs no real secrets: the `DEV_BYPASS` var in `wrangler.jsonc` makes the
Turnstile widget auto-verify and the API stubs skip verification, so every form works
out of the box.

## Commands

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Dev server with HMR (regenerates `.dev.vars` from `.env.dev` live)  |
| `pnpm dev:wrangler` | Full build served through `wrangler dev` (closest to production)    |
| `pnpm build`        | Production build into `dist/`                                       |
| `pnpm preview`      | Build, then serve the built output on :8788                         |
| `pnpm test`         | Unit tests (Vitest); `pnpm test:watch` for watch mode               |
| `pnpm astro check`  | Type-check `.astro` and `.ts` files                                 |
| `pnpm deploy:dry`   | Full production build + every deploy check, uploading nothing       |
| `pnpm deploy:prod`  | Deploy to the `fundedexperts-frontend` worker                       |

`pnpm run deploy:prod`, not `pnpm deploy` — pnpm has a built-in `deploy` command that
would shadow a script by that name, which is why the script is not called `deploy`.

## Deploying

One worker, one environment: `fundedexperts-frontend`, declared as `env.production` in
`wrangler.jsonc`. Deploying needs a Cloudflare account with permission to create/update
Workers — `wrangler login` (or `CLOUDFLARE_API_TOKEN`) first.

```bash
cp .env.prod.example .env.prod   # real Turnstile keys, git-ignored
pnpm deploy:dry                  # builds and runs every check, uploads nothing
pnpm deploy:prod                 # the real thing
```

Then, once per worker, push the runtime secrets (a deploy never uploads them):

```bash
wrangler secret put turnstile_site_key --env production
wrangler secret put turnstile_secret_key --env production
```

`pnpm deploy:prod` is `scripts/deploy.mjs` rather than a bare `astro build &&
wrangler deploy`, because two things about this stack fail silently and only in
production:

- **`wrangler deploy` does not read `wrangler.jsonc`.** The Astro adapter writes a
  resolved copy to `dist/server/wrangler.json` and redirects wrangler at it, so the
  *build* decides what ships. The script builds with `CLOUDFLARE_ENV=production` (set
  in-process, since a `VAR=value cmd` prefix does not work on Windows).
- **The form pages are prerendered**, so the Turnstile widget is frozen into static HTML
  at build time. A plain `pnpm build` bakes in `DEV_BYPASS=1` and Cloudflare's always-pass
  *test* sitekey — a deployed site whose captcha does nothing in the browser and whose
  form posts are then rejected server-side. `env.production` declares no `vars` (wrangler
  never inherits top-level `vars` into a named environment) so `DEV_BYPASS` is dropped,
  and `.env.prod` becomes `.dev.vars.production`, which the production build loads
  *instead of* `.dev.vars`.

The script asserts both against the built output before it uploads anything, and refuses
to deploy if it finds test keys. The first deploy also provisions the `SESSION` KV
namespace the Astro adapter declares; wrangler prompts for it, so run that one
interactively.

## Pages

| Route                     | Source                                  |
| ------------------------- | --------------------------------------- |
| `/`                       | `src/pages/index.astro`                 |
| `/products` + 5 subpages  | `src/pages/products{,.astro}/`          |
| `/industries`             | `src/pages/industries.astro`            |
| `/blog` + posts           | `src/pages/blog{,.astro}/` + MDX        |
| `/apply`                  | `src/pages/apply/index.astro`           |
| `/resources/partnerships` | `src/pages/resources/partnerships.astro`|

Some nav and footer links point at routes that don't exist yet — those pages are
planned, not broken; build them out as designs land.

## Project structure

- `src/layouts/Layout.astro` — site chrome (nav, footer, theme toggle); `BlogPost.astro` wraps posts
- `src/components/` — marketing components; `src/components/ui/` are shadcn-style primitives
- `src/data/` — nav structure and product/industry/funding copy that drives the pages
- `src/content/blog/` — blog posts (MDX)
- `src/styles/global.css` — Tailwind entry + design tokens
- `src/pages/api/` — the three form stubs (contracts are fixed; see above)
- `public/` — static assets served as-is

Light/dark theme is class-based: `ThemeInit` sets it before paint, `ThemeToggle` flips
it, and both are already wired into the layout.

## Stale Deps/dep issue with using Astro Cloudflare adapter;
delete cache `rm -rf node_modules/.vite`, it's an OptimizeDeps issue