// Custom Cloudflare Worker entrypoint: re-exports the Astro adapter's fetch handler, so
// page/SSR behavior is identical to the adapter's default entrypoint.

import { handle } from '@astrojs/cloudflare/handler'

export default {
  fetch: handle,
} satisfies ExportedHandler<Env>
