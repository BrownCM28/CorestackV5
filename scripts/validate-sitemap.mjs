#!/usr/bin/env node
// Fetches the live sitemap.xml and asserts every URL is a real final
// destination -- no redirects, no query params, no admin/dashboard routes.
// Run manually (`node scripts/validate-sitemap.mjs`) or wire into CI.
//
// This exists because the apex domain (corestackjobs.com) redirects to
// www.corestackjobs.com at the DNS/Vercel level. Any URL hardcoded to the
// apex domain anywhere in the app -- sitemap entries, canonical/OG URLs,
// JSON-LD -- silently 308s, and Google Search Console flags every such
// sitemap URL as "Page with redirect" instead of indexing it.

const SITEMAP_URL = process.argv[2] ?? 'https://www.corestackjobs.com/sitemap.xml'
const DISALLOWED_PREFIXES = ['/admin', '/dashboard', '/post', '/onboarding', '/signin', '/signup', '/auth']

async function main() {
  const res = await fetch(SITEMAP_URL)
  if (!res.ok) {
    console.error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`)
    process.exit(1)
  }
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

  if (urls.length === 0) {
    console.error('No <loc> entries found in sitemap -- parsing failed or sitemap is empty.')
    process.exit(1)
  }

  console.log(`Checking ${urls.length} URLs from ${SITEMAP_URL}...\n`)

  const failures = []

  for (const url of urls) {
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      failures.push({ url, reason: 'not a valid absolute URL' })
      continue
    }

    if (parsed.search) {
      failures.push({ url, reason: 'contains query params' })
    }

    if (DISALLOWED_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix))) {
      failures.push({ url, reason: `matches disallowed prefix (${parsed.pathname})` })
    }

    let res
    try {
      res = await fetch(url, { redirect: 'manual' })
    } catch (err) {
      failures.push({ url, reason: `fetch failed: ${err.message}` })
      continue
    }

    if (res.status >= 300 && res.status < 400) {
      failures.push({
        url,
        reason: `redirects (${res.status}) -> ${res.headers.get('location')}`,
      })
    } else if (res.status >= 400) {
      failures.push({ url, reason: `returned ${res.status}` })
    }
  }

  if (failures.length > 0) {
    console.error(`${failures.length} of ${urls.length} sitemap URLs failed:\n`)
    for (const f of failures) {
      console.error(`  ${f.url}\n    -> ${f.reason}`)
    }
    process.exit(1)
  }

  console.log(`All ${urls.length} sitemap URLs are valid, redirect-free final destinations.`)
}

main()
