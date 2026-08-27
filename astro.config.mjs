// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const isDev = process.env.NODE_ENV !== 'production';

// NOTE: `preview` builds for Cloudflare like a deploy does and serves it through wrangler
// (workerd + the real bindings), so what you preview is what deploys. A plain `astro preview`
// cannot serve this app: the /api routes are on-demand (`prerender = false`), which a static
// build rejects.

// https://astro.build/config
export default defineConfig({
  // output: 'server' deploys a Cloudflare Worker that handles /_image requests via the IMAGES
  // binding (Cloudflare Images). Pages opt into pre-rendering individually with
  // `export const prerender = true`, so static pages are served from the ASSETS binding (CDN)
  // while the Worker stays lean, only invoked for image transformation.
  output: 'server',

  // @astrojs/cloudflare v13 uses @cloudflare/vite-plugin, which runs workerd inside Vite's dev
  // server; HMR still works and D1/KV/secrets are available via .dev.vars without a full build.
  // imageService falls back to passthrough in dev since the IMAGES binding isn't simulated locally.
  //
  // In production we split the image service: `build: 'compile'` runs Sharp at build time for
  // prerendered routes, baking real AVIF/WebP files served straight from the ASSETS binding (edge
  // CDN, immutable cache, no Worker invocation, no /_image roundtrip, no transform billing). The
  // IMAGES binding ('cloudflare-binding') is kept as the runtime service so any future on-demand
  // page can still transform images on the fly. Binding responses are NOT auto-cached, so we keep
  // it off the hot path for static pages.
  //
  // remoteBindings defaults to TRUE in @cloudflare/vite-plugin, which makes dev/build call the
  // Cloudflare API at startup to wire up remote bindings. Nothing here needs that - every binding
  // is either simulated locally (rate limiters, assets) or unused in dev (IMAGES, see above) - and
  // on a proxied network that call comes back as a plain-text error page, which the plugin parses
  // with .json(), crashing `astro dev` before it serves anything. This replaces the
  // CLOUDFLARE_VITE_FORCE_LOCAL=true prefix the build scripts used to carry: that env var's only
  // effect in the plugin is setting this exact field, and a POSIX env prefix breaks on Windows.
  adapter: cloudflare({
    imageService: isDev ? 'passthrough' : { build: 'compile', runtime: 'cloudflare-binding' },
    remoteBindings: false,
  }),

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [mdx()],

  redirects: {
    '/resources/blog': '/blog',
    '/solutions/apply': '/apply',
  },

  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'strip-html-comments',
        transformIndexHtml: (html) => html.replace(/<!--(?!\[if)[\s\S]*?-->/g, ''),
      },
    ],

    optimizeDeps: {
      exclude: ['astro:content', '@astrojs/cloudflare'],
      // Pre-bundle every real dep that reaches the SSR graph so Vite never
      // re-optimizes mid-session. Re-optimization rewrites the deps_ssr hash and
      // deletes the old folder, but the workerd runner keeps stale `?v=` refs,
      // surfacing as intermittent "file does not exist in the optimize deps
      // directory" errors on the first navigation that pulls in a new dep.
      // Deep subpaths are optimized as separate entries, so list them explicitly.
      //
      // This must cover Astro's OWN internal modules too, not just npm deps: the
      // Cloudflare adapter's frontmatter scanner doesn't seed them, so they're
      // discovered lazily. The content-collection runtime is the classic offender:
      // it isn't pulled until the first `/blog*` hit, which lands mid-session and
      // triggers the re-optimize → stale `astro_content_runtime.js?v=` 404.
      // (astro:content stays in `exclude` above: that's the virtual module, which
      // can't be pre-bundled; these are the real files it re-exports.) See
      // withastro/astro#16248 (closed unfixed). Add the matching
      // astro/virtual-modules/transitions-*.js entries here if view transitions
      // are ever adopted; same failure mode.
      include: [
        'astro/content/runtime',
        'astro/content/runtime-assets',
        'astro/assets/services/noop',
        'astro/app/entrypoint/dev',
        // astro/zod is Astro's re-exported zod, pulled in by astro:actions /
        // astro:schema. Discovered lazily on the first request that reaches it
        // → stale astro_zod.js?v= 404.
        'astro/zod',
        'zod',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',

        // @data-slot/* are hydrated island UI components, so they land in the
        // CLIENT optimize dir (.vite/deps/, not deps_ssr/), but the same stale
        // `?v=<hash>` re-optimize race applies: each is discovered lazily on the
        // first page that renders it, triggering the "file does not exist in the
        // optimize deps directory" 404. Seed every one that's imported.
        '@data-slot/accordion',
        '@data-slot/collapsible',
        '@data-slot/combobox',
        '@data-slot/dialog',
        '@data-slot/dropdown-menu',
        '@data-slot/radio-group',
        '@data-slot/select',
        '@data-slot/slider',
        '@data-slot/tabs',
        '@data-slot/tooltip',
        // Quill (the rich-text editor) MUST be pre-bundled, not excluded: its
        // transitive dep quill-delta ships CommonJS (`exports.default = Delta`), and without
        // esbuild's CJS→ESM interop the browser gets the raw CJS file and throws "does not
        // provide an export named 'default'". Pre-bundling flattens quill + quill-delta into
        // one ESM module with a real default export, and also stabilises it against the
        // re-optimize race like the entries above.
        'quill',
      ],
    },
  }
});