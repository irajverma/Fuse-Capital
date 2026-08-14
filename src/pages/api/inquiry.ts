import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { verifyTurnstile } from '@/lib/turnstile-verify';
import { isDevBypass } from '@/lib/dev-bypass';

export const prerender = false;

// Validate-only stub: the real backend handles inquiries elsewhere. This endpoint
// verifies Turnstile, rate-limits, and validates the payload, then discards it.
// Keep the request/response contract stable; the frontend is built against it.
const BodySchema = z.object({
  email: z.email().max(254).trim(),
  // Every submission must pass Turnstile, so the client always sends a token; kept
  // optional at the schema layer so a missing one yields our own 'invalid-input'
  // below rather than a generic zod error.
  token: z.string().min(1).optional(),
  html: z.string().min(1).max(50_000),
  context: z.string().max(100).default(''),
  prompt: z.string().max(500).default(''),
  topic: z.string().trim().max(60).default(''),
  // url must be a relative path (starts with /) or empty; prevents protocol injection
  url: z.string().max(500).default('').refine(u => !u || u.startsWith('/'), { message: 'url must be a relative path' }),
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
        return Response.json({ success: false, error: 'forbidden' }, { status: 403 });
      }
    } else if (referer) {
      if (!referer.startsWith(siteOrigin + '/')) {
        return Response.json({ success: false, error: 'forbidden' }, { status: 403 });
      }
    } else {
      return Response.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    // Rate limit by IP; fail fast before parsing body
    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    const { success: allowed } = await cfEnv.RATE_LIMITER.limit({ key: ip });
    if (!allowed) {
      return Response.json({ success: false, error: 'rate-limited' }, { status: 429 });
    }

    const contentLength = parseInt(request.headers.get('content-length') ?? '0', 10);
    if (contentLength > 100_000) {
      return Response.json({ success: false, error: 'payload-too-large' }, { status: 413 });
    }

    const raw = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ success: false, error: 'invalid-input' }, { status: 400 });
    }
    const { token } = parsed.data;

    // Dev bypass skips siteverify so local submissions don't need a real Turnstile token.
    const verdict = isDevBypass(cfEnv)
      ? ({ ok: true } as const)
      : await verifyTurnstile(cfEnv.turnstile_secret_key, token);
    if (!verdict.ok) {
      if (verdict.reason === 'no-token') {
        return Response.json({ success: false, error: 'invalid-input' }, { status: 400 });
      }
      if (verdict.reason === 'bad-response') {
        return Response.json({ success: false, error: 'verification-failed' }, { status: 503 });
      }
      return Response.json({ success: false, error: verdict.errorCode ?? 'verification-failed' }, { status: 403 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(JSON.stringify({ event: 'inquiry_error', error: String(err) }));
    return Response.json({ success: false, error: 'internal' }, { status: 500 });
  }
};
