# Agent notes for this repo

- This is the **frontend-only marketing site**. Work here is frontend work:
  pages, components, styles, content.
- The three endpoints under `src/pages/api/` (`inquiry`, `apply`, `partnerships`) are
  validate-only stubs whose request/response contracts are fixed - the real backend is
  built against them elsewhere. Do not change their schemas, paths, or response shapes,
  and do not add new backend logic.
- Run tests with `pnpm test` (never `npx vitest` - it pulls an incompatible runner).
- Local forms work without real Turnstile keys: `DEV_BYPASS` in `wrangler.jsonc`
  auto-verifies the widget and the stubs skip verification.
- Deploy with `pnpm deploy:prod` (`scripts/deploy.mjs`), never a bare
  `astro build && wrangler deploy`: the form pages are prerendered, so a default build
  bakes `DEV_BYPASS` and the test Turnstile sitekey into the shipped HTML. See the
  Deploying section of the README before changing anything in that path.

## UI Design & Dark Mode Contrast Rules

- **No Emojis**: Do not use emojis anywhere on the website (headings, buttons, cards, badges, or microcopy). Use clean SVG icons or pure typography instead.
- **No Decorative Dots**: Do not put decorative colored dots (`w-2 h-2 rounded-full`, yellow/green/primary category dots) next to section kickers, headers, or badges across the website.
- **No Gradients or Translucent Glows**: Do not use multi-hue background gradients, gradient text clips (`bg-clip-text`), or translucent colored pill backgrounds/glows (e.g. `bg-emerald-500/10 border-emerald-500/20`). Keep all surfaces flat, solid, clean, and high-trust.
- **Shorter Descriptions & Microcopy**: Keep hero descriptions, section subtitles, card summaries, and microcopy concise, direct, and punchy (1-2 short sentences max). Eliminate wordy filler.
- **High-Contrast Section Kickers**: Section kickers (e.g. `PROGRAM OVERVIEW`, `CONSTRUCTION & TRADES FUNDING`) must be legible in both Light Mode and Dark Mode. Do NOT use `text-xs text-primary` on dark backgrounds (since `--primary` in dark mode is low contrast). Use `text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-400` or `text-slate-700 dark:text-slate-300`.


