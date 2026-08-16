# Funded Experts Frontend 

The public marketing site for Funded Experts: Astro 6 on Cloudflare Workers
(`@astrojs/cloudflare`), Tailwind CSS 4, and a small set of island UI components.

Every page is prerendered. The only server code is three small API endpoints
(`/api/inquiry`, `/api/apply`, `/api/partnerships`) that verify Cloudflare Turnstile,
rate-limit, and validate form submissions. They are **validate-only stubs**: the real
intake runs elsewhere, so keep their request/response contracts exactly as they are.

## Getting started

Prerequisites: Node >= 22.12 and [pnpm](https://pnpm.io).

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