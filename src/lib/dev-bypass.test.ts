import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isDevBypass, DEV_BYPASS_TURNSTILE_TOKEN } from './dev-bypass'

describe('isDevBypass', () => {
  it('is true only when DEV_BYPASS is exactly "1"', () => {
    expect(isDevBypass({ DEV_BYPASS: '1' })).toBe(true)
    expect(isDevBypass({ DEV_BYPASS: '0' })).toBe(false)
    expect(isDevBypass({ DEV_BYPASS: 'true' })).toBe(false)
    expect(isDevBypass({ DEV_BYPASS: '' })).toBe(false)
    expect(isDevBypass({})).toBe(false)
    expect(isDevBypass(undefined)).toBe(false)
    expect(isDevBypass(null)).toBe(false)
  })
})

it('exposes a stable sentinel token', () => {
  expect(DEV_BYPASS_TURNSTILE_TOKEN).toBe('dev-bypass')
})

// The safety property the whole feature rests on: DEV_BYPASS must exist ONLY in the top-level
// (local `wrangler dev`) config and NEVER in a deployed environment. wrangler does not inherit
// top-level vars into named environments, so this guards against someone hand-adding it to a
// deploy env; if that ever happens, `pnpm test` fails before it can ship.
describe('wrangler.jsonc prod-safety gate', () => {
  const raw = readFileSync(fileURLToPath(new URL('../../wrangler.jsonc', import.meta.url)), 'utf8')
  const stripped = raw.replace(/^\s*\/\/.*$/gm, '') // drop full-line // comments (JSONC -> JSON)
  const cfg = JSON.parse(stripped)

  it('declares DEV_BYPASS at the top level only', () => {
    expect(cfg.vars?.DEV_BYPASS).toBe('1')
  })

  it('never declares DEV_BYPASS in staging or production', () => {
    expect(cfg.env?.staging?.vars?.DEV_BYPASS).toBeUndefined()
    expect(cfg.env?.production?.vars?.DEV_BYPASS).toBeUndefined()
  })
})
