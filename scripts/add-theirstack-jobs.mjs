import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, THEIRSTACK_API_KEY } = process.env
const TARGET_NEW_JOBS = 50
const MAX_PAGES = 8

for (const [name, value] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  THEIRSTACK_API_KEY,
})) {
  if (!value) {
    console.error(`Missing ${name} in .env.local`)
    process.exit(1)
  }
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Same mapping as the initial sync (scripts/sync-theirstack-jobs.mjs) --
// see that file for why these 7 map onto existing categories rather than
// extending lib/constants.ts's Category list.
const CATEGORY_RULES = [
  { category: 'operations', keywords: ['technician', 'facilities', 'operator', 'facility manager', 'dcim'] },
  { category: 'construction', keywords: ['construction', 'superintendent', 'site manager', 'builder'] },
  { category: 'electrical_power', keywords: ['electrician', 'power', 'ups', 'generator', 'switchgear', 'pdu'] },
  { category: 'cooling_mechanical', keywords: ['hvac', 'cooling', 'chiller', 'mechanical', 'thermal'] },
  { category: 'networking', keywords: ['fiber', 'cabling', 'rcdd', 'low voltage', 'network infrastructure'] },
  { category: 'electrical_power', keywords: ['commissioning', 'cx', 'test and balance', 'ist'] },
  { category: 'construction', keywords: ['project manager', 'program manager', 'pmo', 'owners representative'] },
  { category: 'construction', keywords: ['site selector', 'real estate', 'land', 'development manager'] },
  { category: 'operations', keywords: ['ehs', 'safety', 'osha', 'environmental health'] },
  { category: 'operations', keywords: ['procurement', 'supply chain', 'buyer', 'vendor management'] },
  { category: 'electrical_power', keywords: ['mep engineer', 'pe', 'design engineer', 'architect'] },
  { category: 'operations', keywords: ['colocation', 'colo', 'multi-tenant'] },
]

function keywordMatches(title, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(title)
}

function assignCategory(title) {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => keywordMatches(title, kw))) {
      return rule.category
    }
  }
  return null
}

// Known job-board/aggregator domains -- everything else (including ATS
// platforms like Greenhouse/Lever/Workday/BambooHR, which are first-party
// hiring flows embedded on the company's own hiring process even though
// SaaS-hosted) is treated as "the company's own site" for prioritization.
const AGGREGATOR_DOMAINS = [
  'linkedin.com',
  'indeed.com',
  'ziprecruiter.com',
  'glassdoor.com',
  'monster.com',
  'careerbuilder.com',
  'simplyhired.com',
  'dice.com',
  'snagajob.com',
  'jobs2careers.com',
  'theladders.com',
  'jooble.org',
  'talent.com',
  'neuvoo.com',
  'jobrapido.com',
  'adzuna.com',
  'jobright.ai',
  'getwork.com',
  'appcast.io',
]

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function isAggregatorUrl(url) {
  const host = hostnameOf(url)
  if (!host) return true // unparseable URL -- don't prioritize it
  return AGGREGATOR_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))
}

const REQUEST_BODY_BASE = {
  job_title_or: [
    'Data Center Technician',
    'Critical Facilities Engineer',
    'Commissioning Engineer',
    'Data Center Construction Manager',
    'Critical Power Engineer',
    'Data Center Project Manager',
    'Data Center HVAC',
    'MEP Engineer Data Center',
    'Data Center Electrician',
    'Site Superintendent Data Center',
  ],
  job_country_code_or: ['US'],
  posted_at_max_age_days: 20,
  limit: 25,
}

async function fetchPage(page) {
  const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${THEIRSTACK_API_KEY}`,
    },
    body: JSON.stringify({ ...REQUEST_BODY_BASE, page }),
  })
  const raw = await response.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error(`Page ${page}: response was not JSON (status ${response.status}): ${raw}`)
  }
  if (!response.ok) {
    throw new Error(`Page ${page} failed (status ${response.status}): ${JSON.stringify(data)}`)
  }
  return data.data ?? []
}

async function main() {
  // --- existing DB rows, for dedup + to know how many we already have ---
  const { data: existingRows, error: existingError } = await supabase
    .from('jobs')
    .select('company, title, location')
  if (existingError) {
    console.error('Failed to read existing jobs:', existingError.message)
    process.exit(1)
  }
  const existingKeys = new Set(
    existingRows.map((r) => `${r.company}|${r.title}|${r.location}`.toLowerCase())
  )
  console.log(`${existingRows.length} job(s) already in the table.\n`)

  // --- fetch pages until we have enough valid candidates ---
  const skipped = { notUs: [], tooOld: [], noUrl: [], noLocation: [], duplicate: [] }
  const fallbackCategoryJobs = []
  const companySite = []
  const aggregatorSite = []
  const seenThisRun = new Set()
  const cutoff = Date.now() - 20 * 24 * 60 * 60 * 1000
  let totalFetched = 0

  for (let page = 1; page <= MAX_PAGES; page++) {
    console.log(`Fetching page ${page}...`)
    let jobs
    try {
      jobs = await fetchPage(page)
    } catch (err) {
      console.log(`  Stopped paginating: ${err.message}`)
      break
    }
    if (jobs.length === 0) {
      console.log('  (no more results)')
      break
    }
    totalFetched += jobs.length

    for (const job of jobs) {
      const title = job.job_title ?? job.title
      const company = job.company ?? job.company_name
      const isUs =
        job.country_code === 'US' ||
        (Array.isArray(job.country_codes) && job.country_codes.includes('US'))
      if (!isUs) {
        skipped.notUs.push(`${title} — ${company}`)
        continue
      }

      const postedAt = job.date_posted ? new Date(job.date_posted).getTime() : null
      if (!postedAt || postedAt < cutoff) {
        skipped.tooOld.push(`${title} — ${company} (posted ${job.date_posted ?? 'unknown'})`)
        continue
      }

      const applyTarget = job.url ?? job.job_url ?? job.apply_url ?? job.listing_url ?? null
      if (!applyTarget) {
        skipped.noUrl.push(`${title} — ${company}`)
        continue
      }

      const location = job.location ?? job.short_location ?? job.long_location ?? null
      if (!location) {
        skipped.noLocation.push(`${title} — ${company}`)
        continue
      }

      const dedupeKey = `${company}|${title}|${location}`.toLowerCase()
      if (existingKeys.has(dedupeKey) || seenThisRun.has(dedupeKey)) {
        skipped.duplicate.push(`${title} — ${company} — ${location}`)
        continue
      }
      seenThisRun.add(dedupeKey)

      let category = assignCategory(title)
      if (!category) {
        category = 'operations'
        fallbackCategoryJobs.push(`${title} — ${company}`)
      }

      const row = {
        title,
        company,
        location,
        category,
        remote: job.remote ?? false,
        description: job.description ?? null,
        salary_min: job.min_annual_salary_usd ?? job.salary_min ?? null,
        salary_max: job.max_annual_salary_usd ?? job.salary_max ?? null,
        apply_target: applyTarget,
        posted_by: null,
        status: 'active',
        is_featured: false,
        is_hot: false,
        paid_amount_cents: 0,
      }

      if (isAggregatorUrl(applyTarget)) {
        aggregatorSite.push(row)
      } else {
        companySite.push(row)
      }
    }

    if (companySite.length >= TARGET_NEW_JOBS) break
  }

  // Company/ATS-sourced jobs first, back-filled with aggregator-sourced
  // ones only if there aren't enough to reach the target.
  const rows = [...companySite, ...aggregatorSite].slice(0, TARGET_NEW_JOBS)
  const companySiteUsed = rows.filter((r) => !isAggregatorUrl(r.apply_target)).length
  const aggregatorUsed = rows.length - companySiteUsed

  // --- insert ---
  let inserted = []
  if (rows.length > 0) {
    const { data: insertedRows, error: insertError } = await supabase
      .from('jobs')
      .insert(rows)
      .select('title, company, location, apply_target')
    if (insertError) {
      console.error('Insert failed:', insertError.message)
      process.exit(1)
    }
    inserted = insertedRows ?? []
  }

  // --- summary ---
  console.log('\n=== SUMMARY ===')
  console.log(`Pages fetched: up to ${MAX_PAGES}, total jobs seen: ${totalFetched}`)
  console.log(`Skipped — not US: ${skipped.notUs.length}`)
  console.log(`Skipped — too old (>20 days): ${skipped.tooOld.length}`)
  console.log(`Skipped — no direct listing URL: ${skipped.noUrl.length}`)
  console.log(`Skipped — no location: ${skipped.noLocation.length}`)
  console.log(`Skipped — duplicate (already in DB or already fetched this run): ${skipped.duplicate.length}`)
  if (fallbackCategoryJobs.length > 0) {
    console.log(`Jobs with no keyword match, defaulted to 'operations': ${fallbackCategoryJobs.length}`)
  }
  console.log(
    `\nCandidate pool before insert: ${companySite.length} from company/ATS sites, ${aggregatorSite.length} from aggregators`
  )
  console.log(
    `Inserted ${inserted.length} job(s) — ${companySiteUsed} from company/ATS sites, ${aggregatorUsed} from aggregators (back-filled only because company/ATS pool ran short)`
  )
  inserted.forEach((j, i) => {
    console.log(`  ${i + 1}. ${j.title} — ${j.company} — ${j.location} [${hostnameOf(j.apply_target)}]`)
  })
}

main()
