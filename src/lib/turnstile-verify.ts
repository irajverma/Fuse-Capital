// Server-side Cloudflare Turnstile siteverify: the single place a widget token is validated, so every
// route (the inquiry form, any future gated action) checks the same way. Returns a small result
// rather than throwing so each caller picks its own status code, and never throws on a network or
// non-JSON response (those become a 'bad-response' the caller can surface as a retryable error).

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'no-token' | 'bad-response' | 'rejected'; errorCode?: string }

export async function verifyTurnstile(secret: string, token: string | undefined): Promise<TurnstileVerifyResult> {
  if (!token) return { ok: false, reason: 'no-token' }

  let res: Response
  try {
    res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })
  } catch {
    return { ok: false, reason: 'bad-response' }
  }

  const text = await res.text()
  let parsed: { success: boolean; 'error-codes'?: string[] }
  try {
    parsed = JSON.parse(text)
  } catch {
    console.error('[turnstile] non-JSON siteverify response:', text.slice(0, 200))
    return { ok: false, reason: 'bad-response' }
  }

  if (!parsed.success) return { ok: false, reason: 'rejected', errorCode: parsed['error-codes']?.[0] }
  return { ok: true }
}
