// The single definition of the DEV-ONLY bypass toggle. When `DEV_BYPASS` is '1', Turnstile
// verification is skipped: the widget reports verified without loading the challenge, the client
// submits the sentinel token below, and the API endpoints skip siteverify.
//
// The `DEV_BYPASS` binding is declared ONLY at the top level of wrangler.jsonc (the local
// `wrangler dev` / default environment); wrangler does not inherit top-level vars into named
// environments, so this can never be true in a deployed worker. dev-bypass.test.ts fails the build
// if that safety regresses.
//
// Imported by client code (turnstile.ts), so this module must stay free of server-only imports:
// pass `env` in, never read a binding here.

/**
 * Sentinel the client submits in place of a real Turnstile response when bypassing. The server never
 * verifies it: under DEV_BYPASS the endpoints skip verifyTurnstile entirely.
 */
export const DEV_BYPASS_TURNSTILE_TOKEN = 'dev-bypass'

export function isDevBypass(env: { DEV_BYPASS?: string } | null | undefined): boolean {
  return env?.DEV_BYPASS === '1'
}
