/**
 * Production deploy: build against the `production` Cloudflare environment, prove the build carries
 * no local-dev state, then push it to the `fundedexperts-frontend` worker.
 *
 * Why this is a script and not a one-line `astro build && wrangler deploy`:
 *
 * 1. `wrangler deploy` does not read wrangler.jsonc directly. The Astro adapter writes a RESOLVED
 *    copy to dist/server/wrangler.json and points wrangler at it through .wrangler/deploy/config.json
 *    ("Using redirected Wrangler configuration" in wrangler's output), so the BUILD, not the deploy
 *    flag, decides what ships. The build therefore has to run with CLOUDFLARE_ENV=production - set
 *    here, in-process, rather than as a `VAR=value cmd` prefix, because that prefix does not work on
 *    Windows (same reason astro.config.mjs stopped using CLOUDFLARE_VITE_FORCE_LOCAL).
 *
 * 2. The three form pages are prerendered, so <Turnstile> is frozen into static HTML at build time:
 *    `data-dev-bypass` (from the DEV_BYPASS var) and `data-sitekey` (from the worker env) are
 *    whatever the BUILD saw, and no runtime binding can correct them afterwards. A plain
 *    `astro build` sees wrangler.jsonc's top-level vars and .dev.vars - that is DEV_BYPASS=1 plus
 *    Cloudflare's always-pass TEST sitekey - so deploying it would ship a site whose captcha is a
 *    no-op in the browser and whose form posts are then rejected by the real siteverify.
 *
 *    Two things prevent that. `env.production` in wrangler.jsonc declares no `vars`, and wrangler
 *    never inherits top-level vars into a named environment, which drops DEV_BYPASS. And this script
 *    writes .dev.vars.production from .env.prod, which wrangler loads INSTEAD OF .dev.vars once an
 *    environment is selected, so the real production sitekey is what gets baked in. The checks after
 *    the build assert both, because both fail silently and only in production.
 *
 * Secrets: .env.prod is the source for the BUILD (the site key above). The deployed worker reads
 * turnstile_secret_key at runtime, which is a Cloudflare secret and is never uploaded by a deploy -
 * push it once with `wrangler secret put`. This script checks it is there and says so if it is not.
 *
 * `--dry-run` (pnpm deploy:dry) runs the whole thing, including every check, and stops wrangler just
 * short of uploading. It needs no Cloudflare credentials, so it is the safe way to confirm a build
 * before handing the real deploy to whoever holds the account.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ENV_NAME = 'production'
const WORKER_NAME = 'fundedexperts-frontend'
const SOURCE = '.env.prod'
const OUT = `.dev.vars.${ENV_NAME}`

/** Read at runtime by the API stubs; needed as a deployed secret, not just at build time. */
const REQUIRED_KEYS = ['turnstile_site_key', 'turnstile_secret_key']

const dryRun = process.argv.includes('--dry-run')

/**
 * Cloudflare's documented always-pass / always-block TEST credentials, which is what .env.dev holds.
 * Any of these reaching production means the captcha is theatre, so they are a hard stop.
 */
const TEST_KEYS = [
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '3x00000000000000000000FF',
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]

function fail(message, ...hints) {
  console.error(`\n[deploy] ✘ ${message}`)
  for (const hint of hints) console.error(`[deploy]   ${hint}`)
  console.error('')
  process.exit(1)
}

/** Minimal dotenv read: enough for `key=value` lines, matching what wrangler itself parses. */
function parseEnvFile(text) {
  const vars = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return vars
}

/** `.env.prod` -> `.dev.vars.production`, the file the production build reads. */
function writeProductionVars() {
  if (!existsSync(SOURCE)) {
    fail(
      `missing ${SOURCE}`,
      `${SOURCE} holds the PRODUCTION Turnstile keys. Without it the build would bake`,
      "Cloudflare's test sitekey into the prerendered forms and every submission would fail.",
      `Copy .env.prod.example to ${SOURCE} and fill in the real keys from the Cloudflare dashboard.`,
    )
  }

  const source = readFileSync(SOURCE, 'utf8')
  const vars = parseEnvFile(source)

  const missing = REQUIRED_KEYS.filter((key) => !vars[key])
  if (missing.length) fail(`${SOURCE} is missing: ${missing.join(', ')}`)

  const testKeys = REQUIRED_KEYS.filter((key) => TEST_KEYS.includes(vars[key]))
  if (testKeys.length) {
    fail(
      `${SOURCE} still holds Cloudflare TEST keys: ${testKeys.join(', ')}`,
      'Those always pass verification, so shipping them disables the captcha entirely.',
      'Use the real production keys from Cloudflare dashboard > Turnstile.',
    )
  }

  writeFileSync(OUT, `# GENERATED by scripts/deploy.mjs from ${SOURCE}. Do not edit.\n${source}\n`, 'utf8')
  console.log(`[deploy] wrote ${OUT} from ${SOURCE}`)
  return vars
}

/**
 * `astro` and `wrangler` are resolved off node_modules/.bin, which pnpm puts on PATH - so this
 * script has to be run as `pnpm deploy:prod`, not `node scripts/deploy.mjs`.
 *
 * shell on Windows for the same reason as scripts/dev-vars.mjs: pnpm writes those bin shims as .CMD,
 * which CreateProcess never finds on its own.
 */
function run(command, args, env) {
  console.log(`[deploy] ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  })
  if (result.error?.code === 'ENOENT') {
    fail(`\`${command}\` not found on PATH`, 'Run this through pnpm: `pnpm deploy:prod` (or `pnpm deploy:dry`).')
  }
  if (result.status !== 0) fail(`\`${command} ${args.join(' ')}\` failed`)
}

function htmlFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...htmlFiles(full))
    else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

/**
 * The build is silent about all three of these, and all three only misbehave once deployed, so they
 * are checked against the artifact that is about to be uploaded rather than trusted.
 */
function verifyBuild(vars) {
  const configPath = 'dist/server/wrangler.json'
  if (!existsSync(configPath)) fail(`${configPath} not found - did the build run?`)
  const config = JSON.parse(readFileSync(configPath, 'utf8'))

  if (config.name !== WORKER_NAME) {
    fail(`build targets worker "${config.name}", expected "${WORKER_NAME}"`, `Check env.${ENV_NAME}.name in wrangler.jsonc.`)
  }
  if (config.vars?.DEV_BYPASS !== undefined) {
    fail(
      'DEV_BYPASS reached the production build config',
      `It must exist only in wrangler.jsonc's top-level (local) block, never under env.${ENV_NAME}.`,
    )
  }

  const pages = htmlFiles('dist/client')
  const bypassed = pages.filter((file) => readFileSync(file, 'utf8').includes('data-dev-bypass'))
  if (bypassed.length) {
    fail(
      `the dev Turnstile bypass is baked into ${bypassed.length} prerendered page(s)`,
      ...bypassed.slice(0, 5).map((file) => `- ${file}`),
      `The build did not run with CLOUDFLARE_ENV=${ENV_NAME}, or env.${ENV_NAME} declares vars.`,
    )
  }

  const withTestKey = pages.filter((file) => TEST_KEYS.some((key) => readFileSync(file, 'utf8').includes(key)))
  if (withTestKey.length) {
    fail(
      `Cloudflare TEST Turnstile keys are baked into ${withTestKey.length} prerendered page(s)`,
      ...withTestKey.slice(0, 5).map((file) => `- ${file}`),
      `The build read .dev.vars instead of ${OUT}.`,
    )
  }

  const sitekey = vars.turnstile_site_key
  const rendered = pages.filter((file) => readFileSync(file, 'utf8').includes(`data-sitekey="${sitekey}"`))
  console.log(`[deploy] verified: no dev bypass, production sitekey on ${rendered.length} prerendered page(s)`)
}

/**
 * Read-only look at what is already on the worker. Advisory on purpose: a first deploy has no worker
 * to ask, and a missing secret is worth a loud warning but is fixable after the fact with one command.
 */
function checkDeployedSecrets() {
  const result = spawnSync('wrangler', ['secret', 'list', '--env', ENV_NAME], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    console.warn(`[deploy] could not list secrets (first deploy, or not logged in) - skipping check`)
    console.warn(`[deploy] after deploying, run: wrangler secret put turnstile_secret_key --env ${ENV_NAME}`)
    return
  }
  const listed = result.stdout ?? ''
  const missing = REQUIRED_KEYS.filter((key) => !listed.includes(key))
  if (missing.length) {
    console.warn(`\n[deploy] ⚠ the worker is missing secret(s): ${missing.join(', ')}`)
    console.warn('[deploy]   Form submissions fail siteverify until they are set:')
    for (const key of missing) console.warn(`[deploy]     wrangler secret put ${key} --env ${ENV_NAME}`)
    console.warn('')
  }
}

const vars = writeProductionVars()
run('astro', ['build'], { CLOUDFLARE_ENV: ENV_NAME })
verifyBuild(vars)
if (!dryRun) checkDeployedSecrets()
run('wrangler', ['deploy', '--env', ENV_NAME, ...(dryRun ? ['--dry-run'] : [])])
console.log(
  dryRun
    ? `\n[deploy] ✓ dry run only - nothing was uploaded. Run \`pnpm deploy:prod\` to deploy.`
    : `\n[deploy] ✓ deployed to the ${WORKER_NAME} worker (${ENV_NAME})`,
)
