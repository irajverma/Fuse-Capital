// Server-side resolution of the Turnstile *site* key (public, safe to render into HTML).
//
// Convention: pages must NOT pass a `sitekey` prop to <TurnstileWidget>. The component
// calls this resolver so the Worker runtime binding (`turnstile_site_key`), correct for
// whichever environment actually served the request, always wins over the build-time
// `import.meta.env` value, which is frozen at compile and can go stale if envs ever diverge.
// The build-time value is only a dev/fallback when the runtime binding is absent.
//
// Empty strings are treated as "absent" so a present-but-blank binding falls through instead
// of rendering a broken (keyless) widget.
export function resolveTurnstileSiteKey(
  runtimeKey?: string,
  buildKey?: string,
): string | undefined {
  return runtimeKey || buildKey || undefined
}
