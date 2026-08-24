---
name: deploy-check
description: "Run pre-flight checks before production deployment: astro check diagnostics, unit tests (pnpm test), .env.prod key verification, and dry-run build (pnpm deploy:dry). Use when preparing to deploy to Cloudflare Workers or when the user asks to check deployment readiness or run '/deploy-check'."
---

# Deploy Check (`/deploy-check`)

Run a complete pre-flight audit for Cloudflare Workers deployment to ensure zero downtime, valid production Turnstile keys, clean TypeScript types, and passing unit tests.

> [!IMPORTANT]
> **Deployment Rule**: Never deploy using bare `astro build && wrangler deploy`. Production deployments MUST use `pnpm deploy:prod` (`scripts/deploy.mjs`) because form pages are prerendered and require `.env.prod` to bake real Turnstile keys into static HTML.

---

## Pre-Flight Checklist

Perform the following 5 steps sequentially:

### 1. Working Tree & Git Status
Check for uncommitted changes or unpushed commits:
```bash
git status --short
```
* **Pass**: Working tree is clean or changes are intended for release.
* **Warning**: If uncommitted changes exist, ask the user if they should be committed before proceeding.

### 2. TypeScript & Astro Diagnostics
Run Astro's strict diagnostic checker:
```bash
pnpm astro check
```
* **Pass**: 0 errors and 0 warnings.
* **Fail**: Fix any type errors or missing imports before proceeding.

### 3. Unit Tests
Run the project unit test suite:
```bash
pnpm test
```
* **Pass**: All unit tests pass (`vitest run`).
* **Fail**: Never deploy if unit tests fail.

### 4. Production Environment Audit (`.env.prod`)
Inspect `.env.prod` for production keys:
* Ensure `.env.prod` exists (copied from `.env.prod.example`).
* Verify `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are valid production keys (NOT Cloudflare test keys like `1x00000000000000000000AA` or `2x00000000000000000000AB`).
* Ensure `DEV_BYPASS` is **not** set to `1` or `true`.

### 5. Dry-Run Deployment (`pnpm deploy:dry`)
Run `scripts/deploy.mjs` in dry-run mode:
```bash
pnpm deploy:dry
```
* Builds Astro with `CLOUDFLARE_ENV=production`.
* Asserts that `DEV_BYPASS` and test sitekeys are excluded from prerendered HTML output.
* Verifies `dist/server/wrangler.json` build bundle without uploading assets to Cloudflare.

---

## Reporting & Execution

Present the audit summary table:

| Check | Tool / Command | Status |
| :--- | :--- | :--- |
| **Git Status** | `git status --short` | Pass / Warning |
| **Type Check** | `pnpm astro check` | Pass / Fail |
| **Unit Tests** | `pnpm test` | Pass / Fail |
| **Env Keys** | `.env.prod` inspection | Pass / Fail |
| **Dry Run** | `pnpm deploy:dry` | Pass / Fail |

If all checks pass:
- Prompt the user: *"All pre-flight checks passed! Would you like to proceed with live production deployment using `pnpm deploy:prod`?"*
