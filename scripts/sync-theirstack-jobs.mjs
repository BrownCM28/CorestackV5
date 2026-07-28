import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, THEIRSTACK_API_KEY } = process.env

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

// Category keyword rules, in priority order (first match wins). The
// original ask used a 12-category taxonomy that doesn't exist in this
// app's Category type/lib/constants.ts (which only has 9) -- per
// explicit user decision, the 7 that don't exist are mapped onto the
// closest existing category rather than extending the app's category
// system: commissioning -> electrical_power, project_management ->
// construction, site_selection -> construction, safety -> operations,
// procurement -> operations, design_engineering -> electrical_power,
// colocation -> operations.
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

const REQUEST_BODY = {
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
  page: 0,
}

async function main() {
  // --- Step 1: delete existing mock seed jobs ---
  const { count: seedCount, error: countError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .is('posted_by', null)

  if (countError) {
    console.error('Failed to count seed jobs:', countError.message)
    process.exit(1)
  }

  console.log(`Found ${seedCount} mock seed job(s) (posted_by IS NULL). Deleting...`)

  const { error: deleteError } = await supabase.from('jobs').delete().is('posted_by', null)
  if (deleteError) {
    console.error('Failed to delete seed jobs:', deleteError.message)
    process.exit(1)
  }
  console.log(`Deleted ${seedCount} mock seed job(s).\n`)

  // --- Step 2: fetch real jobs from TheirStack ---
  console.log('Fetching jobs from TheirStack...')
  const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${THEIRSTACK_API_KEY}`,
    },
    body: JSON.stringify(REQUEST_BODY),
  })

  const raw = await response.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    console.error(`TheirStack response was not JSON (status ${response.status}):`)
    console.error(raw)
    process.exit(1)
  }

  if (!response.ok) {
    console.error(`TheirStack request failed (status ${response.status}):`)
    console.error(JSON.stringify(data, null, 2))
    process.exit(1)
  }

  const fetched = data.data ?? []
  console.log(`Fetched ${fetched.length} job(s) from TheirStack.\n`)

  // --- Step 3: filter, dedupe, categorize ---
  const skipped = { notUs: [], tooOld: [], noUrl: [], noLocation: [], duplicate: [] }
  const seenKeys = new Set()
  const cutoff = Date.now() - 20 * 24 * 60 * 60 * 1000
  const fallbackCategoryJobs = []
  const rows = []

  for (const job of fetched) {
    const title = job.job_title ?? job.title
    const company = job.company ?? job.company_name
    const isUs =
      job.country_code === 'US' || (Array.isArray(job.country_codes) && job.country_codes.includes('US'))
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
    if (seenKeys.has(dedupeKey)) {
      skipped.duplicate.push(`${title} — ${company} — ${location}`)
      continue
    }
    seenKeys.add(dedupeKey)

    let category = assignCategory(title)
    if (!category) {
      category = 'operations'
      fallbackCategoryJobs.push(`${title} — ${company}`)
    }

    rows.push({
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
    })
  }

  // --- Step 4: insert ---
  let inserted = []
  if (rows.length > 0) {
    const { data: insertedRows, error: insertError } = await supabase
      .from('jobs')
      .insert(rows)
      .select('title, company, location')

    if (insertError) {
      console.error('Insert failed:', insertError.message)
      process.exit(1)
    }
    inserted = insertedRows ?? []
  }

  // --- Summary ---
  console.log('=== SUMMARY ===')
  console.log(`Total jobs fetched from TheirStack: ${fetched.length}`)
  console.log(`Total jobs skipped: ${fetched.length - rows.length}`)
  console.log(`  - Not US: ${skipped.notUs.length}`)
  skipped.notUs.forEach((j) => console.log(`      ${j}`))
  console.log(`  - Too old (>20 days): ${skipped.tooOld.length}`)
  skipped.tooOld.forEach((j) => console.log(`      ${j}`))
  console.log(`  - No direct listing URL: ${skipped.noUrl.length}`)
  skipped.noUrl.forEach((j) => console.log(`      ${j}`))
  console.log(`  - No location: ${skipped.noLocation.length}`)
  skipped.noLocation.forEach((j) => console.log(`      ${j}`))
  console.log(`  - Duplicate (company + title + location): ${skipped.duplicate.length}`)
  skipped.duplicate.forEach((j) => console.log(`      ${j}`))

  if (fallbackCategoryJobs.length > 0) {
    console.log(`\nJobs with no keyword match, defaulted to 'operations': ${fallbackCategoryJobs.length}`)
    fallbackCategoryJobs.forEach((j) => console.log(`      ${j}`))
  }

  console.log(`\nTotal jobs successfully inserted into Supabase: ${inserted.length}`)
  inserted.forEach((j, i) => {
    console.log(`  ${i + 1}. ${j.title} — ${j.company} — ${j.location}`)
  })
}

main()
