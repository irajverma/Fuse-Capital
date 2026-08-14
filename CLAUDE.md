# Agent notes for this repo

- This branch is the **frontend-only marketing site**. Work here is frontend work:
  pages, components, styles, content.
- The three endpoints under `src/pages/api/` (`inquiry`, `apply`, `partnerships`) are
  validate-only stubs whose request/response contracts are fixed — the real backend is
  built against them elsewhere. Do not change their schemas, paths, or response shapes,
  and do not add new backend logic.
- Run tests with `pnpm test` (never `npx vitest` — it pulls an incompatible runner).
- Never start dev servers (`pnpm dev`, `pnpm dev:wrangler`) as a standalone process;
  the user runs those.
- Local forms work without real Turnstile keys: `DEV_BYPASS` in `wrangler.jsonc`
  auto-verifies the widget and the stubs skip verification.
