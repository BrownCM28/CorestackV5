import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.THEIRSTACK_API_KEY) {
  console.error('Missing THEIRSTACK_API_KEY in .env.local')
  process.exit(1)
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

const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.THEIRSTACK_API_KEY}`,
  },
  body: JSON.stringify(REQUEST_BODY),
})

const raw = await response.text()
let data
try {
  data = JSON.parse(raw)
} catch {
  console.error(`Response was not JSON (status ${response.status}):`)
  console.error(raw)
  process.exit(1)
}

console.log(`=== STATUS: ${response.status} ===\n`)

console.log('=== RAW RESPONSE ===')
console.log(JSON.stringify(data, null, 2))

const jobs = Array.isArray(data) ? data : (data.data ?? data.jobs ?? data.results ?? [])
const firstThree = jobs.slice(0, 3)

// Surface every string field on each job that looks like a URL, so the
// right apply_target field can be confirmed against the raw response above.
function urlLikeFields(job) {
  return Object.fromEntries(
    Object.entries(job).filter(
      ([key, value]) =>
        typeof value === 'string' &&
        (key.toLowerCase().includes('url') || value.startsWith('http'))
    )
  )
}

console.log('\n=== URL-LIKE FIELDS PER JOB (first 3) ===')
console.log(JSON.stringify(firstThree.map(urlLikeFields), null, 2))

function mapJob(job) {
  return {
    title: job.job_title ?? job.title ?? null,
    company: job.company ?? job.company_name ?? job.company_object?.name ?? null,
    location: job.location ?? job.job_location ?? job.city ?? null,
    remote: job.remote ?? job.is_remote ?? false,
    salary_min: job.min_annual_salary_usd ?? job.salary_min ?? job.min_salary ?? null,
    salary_max: job.max_annual_salary_usd ?? job.salary_max ?? job.max_salary ?? null,
    description: job.description ?? job.job_description ?? null,
    apply_target:
      job.url ?? job.job_url ?? job.apply_url ?? job.listing_url ?? job.source_url ?? null,
    source: job.source ?? job.job_board ?? 'theirstack',
  }
}

console.log('\n=== MAPPED JOBS (first 3) ===')
console.log(JSON.stringify(firstThree.map(mapJob), null, 2))
