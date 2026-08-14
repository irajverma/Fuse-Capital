import { afterEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstile } from './turnstile-verify'

// Server-side enforcement for checklist #10 ("inquiry captcha works, verified server-side"). The
// browser E2E harness intentionally CANNOT cover this: DEV_BYPASS stubs the Turnstile widget and
// skips siteverify locally (that is the whole point of the bypass), so the "a token is required and
// verified" behaviour only exists with the bypass off. That guarantee lives here instead: the one
// place every gated route (the inquiry form today) validates a token.

function mockFetch(impl: () => Promise<Response> | Response) {
  vi.stubGlobal('fetch', vi.fn(impl))
}

afterEach(() => vi.unstubAllGlobals())

describe('verifyTurnstile', () => {
  it('rejects a missing token without calling siteverify', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    expect(await verifyTurnstile('secret', undefined)).toEqual({ ok: false, reason: 'no-token' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('accepts a token Cloudflare reports as successful', async () => {
    mockFetch(() => new Response(JSON.stringify({ success: true })))
    expect(await verifyTurnstile('secret', 'tok')).toEqual({ ok: true })
  })

  it('rejects a token Cloudflare declines, surfacing the first error code', async () => {
    mockFetch(() => new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] })))
    expect(await verifyTurnstile('secret', 'tok')).toEqual({
      ok: false,
      reason: 'rejected',
      errorCode: 'invalid-input-response',
    })
  })

  it('treats a network failure as a retryable bad-response (never throws)', async () => {
    mockFetch(() => {
      throw new Error('network down')
    })
    expect(await verifyTurnstile('secret', 'tok')).toEqual({ ok: false, reason: 'bad-response' })
  })

  it('treats a non-JSON siteverify body as a bad-response', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch(() => new Response('<html>gateway error</html>'))
    expect(await verifyTurnstile('secret', 'tok')).toEqual({ ok: false, reason: 'bad-response' })
  })
})
