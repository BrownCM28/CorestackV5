import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'
import { getJob } from '@/lib/api'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'
import CompanyLogo from '@/components/jobs/CompanyLogo'
import AuthGate from '@/components/auth/AuthGate'
import SaveJobButton from '@/components/SaveJobButton'
import type { Job } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function resolveJob(id: string): Promise<Job | null> {
  try {
    return await getJob(id)
  } catch {
    return MOCK_JOBS.find((j) => j.id === id) ?? null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, location, salary_min, salary_max')
    .eq('id', id)
    .single()

  if (!job) return { title: 'Job not found — Corestack' }

  const salaryText =
    job.salary_min && job.salary_max
      ? ` · $${(job.salary_min / 1000).toFixed(0)}K–$${(job.salary_max / 1000).toFixed(0)}K`
      : ''

  const description = `${job.title} at ${job.company} in ${job.location}${salaryText}. Apply on Corestack — the job board for data center and infrastructure professionals.`

  return {
    title: `${job.title} at ${job.company} — Corestack`,
    description,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description,
      url: `https://corestack-v1-5nci.vercel.app/jobs/${id}`,
      siteName: 'Corestack',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${job.title} at ${job.company}`,
      description,
    },
  }
}

const CAT_COLOR: Record<string, string> = {
  operations: '#f97316',
  construction: '#3b82f6',
  electrical_power: '#eab308',
  cooling_mechanical: '#8b5cf6',
  networking: '#22c55e',
  fiber_networks: '#06b6d4',
  power_generation: '#ef4444',
  energy_storage: '#10b981',
  semiconductor_fabrication: '#a855f7',
}

function getBadge(job: Job): { label: string; cls: string } | null {
  const ageHours = (Date.now() - new Date(job.created_at).getTime()) / 3_600_000
  if (ageHours < 24) return { label: 'NEW', cls: 'bg-[#3ecf8e] text-black' }
  if ((job.salary_min ?? 0) >= 110000)
    return { label: 'FEATURED', cls: 'bg-amber-100 text-amber-800 border border-amber-300' }
  if ((job.salary_min ?? 0) >= 90000)
    return { label: 'HOT', cls: 'bg-red-100 text-red-700 border border-red-200' }
  return null
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const job = await resolveJob(id)
  if (!job) notFound()

  const badge = getBadge(job)
  const salary = formatSalary(job.salary_min, job.salary_max)
  const hasSalary = job.salary_min !== null || job.salary_max !== null
  const catColor = CAT_COLOR[job.category] ?? '#000'

  const similarJobs = MOCK_JOBS
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'US',
      },
    },
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
    baseSalary:
      job.salary_min && job.salary_max
        ? {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salary_min,
              maxValue: job.salary_max,
              unitText: 'YEAR',
            },
          }
        : undefined,
    datePosted: job.created_at,
    employmentType: 'FULL_TIME',
    directApply: true,
  }

  return (
    <div>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="px-6 pt-10 pb-12 border-b border-black"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3, #ffffff 85%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-black/40 mb-8">
            <Link
              href="/"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Corestack
            </Link>
            <span>/</span>
            <Link
              href="/#jobs"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Jobs
            </Link>
            <span>/</span>
            <span className="text-black/60 truncate max-w-[200px]">{job.title}</span>
          </div>

          {/* Header content */}
          <div className="flex items-start gap-6 flex-wrap">
            {/* Logo */}
            <CompanyLogo company={job.company} size={64} />

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
                  {job.title}
                </h1>
                {badge && (
                  <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide flex-shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                )}
              </div>

              <p className="text-base text-black/60 mb-4">
                {job.company}
                <span className="mx-2 text-black/20">·</span>
                {job.location}
              </p>

              {/* Meta chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="flex items-center gap-1.5 text-xs font-medium border border-black/20 px-3 py-1"
                >
                  <span
                    className="w-2 h-2 flex-shrink-0"
                    style={{ backgroundColor: catColor }}
                    aria-hidden="true"
                  />
                  {CATEGORY_LABELS[job.category]}
                </span>

                {job.remote && (
                  <span className="text-xs border border-black/20 px-3 py-1">
                    Remote
                  </span>
                )}

                {hasSalary && (
                  <span className="text-xs font-semibold text-[#3ecf8e] border border-[#3ecf8e]/30 px-3 py-1 tabular-nums">
                    {salary}
                  </span>
                )}

                <span className="text-xs text-black/35 ml-1">
                  Posted {daysAgo(job.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex gap-0 divide-x divide-black border-b border-black min-h-screen">

        {/* ── Main: job description ─── */}
        <main className="flex-1 min-w-0 p-8 sm:p-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6">
            Job Description
          </h2>
          <div className="prose prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-black prose-headings:uppercase prose-headings:tracking-tight
            prose-h2:text-base prose-h3:text-sm
            prose-p:text-black/75 prose-p:leading-relaxed
            prose-li:text-black/75 prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-a:text-[#3ecf8e] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black prose-strong:font-semibold
            prose-hr:border-black/10">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>

          {/* Mobile apply — shown below description on small screens */}
          <div className="mt-10 pt-8 border-t border-black xl:hidden">
            <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
              Apply for this role
            </p>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <AuthGate jobId={job.id} />
              </div>
              <SaveJobButton jobId={job.id} />
            </div>
            <p className="mt-3 text-[11px] text-black/35">
              You'll be redirected to {job.company}'s application page.
            </p>
          </div>
        </main>

        {/* ── Sidebar ─── */}
        <aside className="w-80 flex-shrink-0 hidden xl:block" aria-label="Job details and apply">
          <div className="sticky top-0 divide-y divide-black">

            {/* Apply CTA */}
            <div className="p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Apply for this role
              </p>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <AuthGate jobId={job.id} />
                </div>
                <SaveJobButton jobId={job.id} />
              </div>
              <p className="mt-3 text-[11px] text-black/35">
                You'll be redirected to {job.company}'s application page after confirming.
              </p>
            </div>

            {/* Quick details */}
            <div className="p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                Quick Details
              </p>
              <dl className="space-y-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-xs text-black/40">Company</dt>
                  <dd className="text-xs font-medium text-right">{job.company}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-xs text-black/40">Location</dt>
                  <dd className="text-xs font-medium text-right">{job.location}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-xs text-black/40">Remote</dt>
                  <dd className="text-xs font-medium">{job.remote ? 'Yes' : 'On-site'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-xs text-black/40">Specialisation</dt>
                  <dd className="text-xs font-medium text-right">{CATEGORY_LABELS[job.category]}</dd>
                </div>
                {hasSalary && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-black/40">Salary</dt>
                    <dd className="text-xs font-semibold text-[#3ecf8e] tabular-nums">{salary}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-xs text-black/40">Posted</dt>
                  <dd className="text-xs text-black/60">{daysAgo(job.created_at)}</dd>
                </div>
              </dl>
            </div>

            {/* Similar roles */}
            {similarJobs.length > 0 && (
              <div className="p-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                  Similar Roles
                </p>
                <ul role="list" className="space-y-4">
                  {similarJobs.map((sj) => (
                    <li key={sj.id}>
                      <Link
                        href={`/jobs/${sj.id}`}
                        className="block group focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                      >
                        <p className="text-xs font-semibold leading-snug group-hover:underline">
                          {sj.title}
                        </p>
                        <p className="text-[11px] text-black/45 mt-0.5">
                          {sj.company}
                          <span className="mx-1 text-black/20">·</span>
                          {sj.location}
                        </p>
                        {(sj.salary_min || sj.salary_max) && (
                          <p className="text-[11px] text-[#3ecf8e] font-medium mt-0.5 tabular-nums">
                            {formatSalary(sj.salary_min, sj.salary_max)}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#jobs"
                  className="mt-5 flex items-center gap-1 text-xs text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  View all {CATEGORY_LABELS[job.category]} roles →
                </Link>
              </div>
            )}

            {/* Share */}
            <div className="p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Share This Role
              </p>
              <div className="flex gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://corestack.io/jobs/${job.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-[11px] border border-black px-3 py-2 transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${job.title} at ${job.company} — via @corestack`)}&url=${encodeURIComponent(`https://corestack.io/jobs/${job.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-[11px] border border-black px-3 py-2 transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  X / Twitter
                </a>
              </div>
            </div>

          </div>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
