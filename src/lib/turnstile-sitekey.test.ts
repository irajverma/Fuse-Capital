// Unit tests (node project) for Turnstile site-key resolution + a regression guard that the
// form pages keep to the clean convention (no build-time sitekey prop override).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolveTurnstileSiteKey } from './turnstile-sitekey'

describe('resolveTurnstileSiteKey', () => {
  it('prefers the Worker runtime binding over the build-time value', () => {
    expect(resolveTurnstileSiteKey('runtime', 'build')).toBe('runtime')
  })

  it('falls back to the build-time value when the runtime binding is absent or blank', () => {
    expect(resolveTurnstileSiteKey(undefined, 'build')).toBe('build')
    expect(resolveTurnstileSiteKey('', 'build')).toBe('build')
  })

  it('returns undefined when neither source has a usable key', () => {
    expect(resolveTurnstileSiteKey(undefined, undefined)).toBeUndefined()
    expect(resolveTurnstileSiteKey('', '')).toBeUndefined()
  })
})

describe('form pages use the clean Turnstile convention', () => {
  // These pages render <TurnstileWidget> and must let the component resolve the site key
  // from the runtime binding; passing a `sitekey=` prop would re-introduce the build-time
  // override this change removed.
  const pages = ['apply/index.astro', 'resources/partnerships.astro']

  for (const page of pages) {
    it(`${page} renders <TurnstileWidget> without a sitekey prop`, () => {
      const src = readFileSync(fileURLToPath(new URL(`../pages/${page}`, import.meta.url)), 'utf8')
      expect(src).toContain('<TurnstileWidget')
      expect(src).not.toContain('sitekey=')
      expect(src).not.toContain('import.meta.env.turnstile_site_key')
    })
  }
})
