import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { verifyTurnstile } from '@/lib/turnstile-verify';
import { isDevBypass } from '@/lib/dev-bypass';

export const prerender = false;

// Validate-only stub: the real partner intake lives elsewhere. This endpoint verifies
// Turnstile, rate-limits, and validates the payload, then discards it. Keep the
// request/response contract stable; the frontend is built against it — note the client
// branches on `ok` and `kind`, not `success`.
const BodySchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  role: z.enum(['broker', 'vc']),
  email: z.email().max(254).trim(),
  // 10 national digits, or empty/absent: the phone is optional for a VC.
  phone: z.string().max(10).optional(),
  // The VC note travels as sanitized-on-display HTML; cap what arrives.
  message: z.string().max(40_000).optional(),
  // The client always sends a token; kept optional at the schema layer so a missing one
  // yields our own 'invalid-input' below rather than a generic zod error.
  token: z.string().min(1).optional(),
});

const cfEnv = env;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate Origin/Referer against the site the client actually requested
    const siteOrigin = new URL(request.url).origin;
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (origin) {
      if (origin !== siteOrigin) {
        return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
      }
    } else if (referer) {
      if (!referer.startsWith(siteOrigin + '/')) {
        return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
      }
    } else {
      return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }

    // Rate limit by IP; fail fast before parsing body
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const { success: allowed } = await cfEnv.RATE_LIMITER_PARTNER.limit({ key: ip });
    if (!allowed) {
      return Response.json({ ok: false, error: 'rate-limited' }, { status: 429 });
    }

    const contentLength = parseInt(request.headers.get('content-length') ?? '0', 10);
    if (contentLength > 100_000) {
      return Response.json({ ok: false, error: 'payload-too-large' }, { status: 413 });
    }

    const raw = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ ok: false, error: 'invalid-input' }, { status: 400 });
    }
    const { role, token } = parsed.data;

    // Dev bypass skips siteverify so local submissions don't need a real Turnstile token.
    const verdict = isDevBypass(cfEnv)
      ? ({ ok: true } as const)
      : await verifyTurnstile(cfEnv.turnstile_secret_key, token);
    if (!verdict.ok) {
      if (verdict.reason === 'no-token') {
        return Response.json({ ok: false, error: 'invalid-input' }, { status: 400 });
      }
      if (verdict.reason === 'bad-response') {
        return Response.json({ ok: false, error: 'verification-failed' }, { status: 503 });
      }
      return Response.json({ ok: false, error: verdict.errorCode ?? 'verification-failed' }, { status: 403 });
    }

    return Response.json({ ok: true, kind: role });
  } catch (err) {
    console.error(JSON.stringify({ event: 'partnerships_error', error: String(err) }));
    return Response.json({ ok: false, error: 'internal' }, { status: 500 });
  }
};
