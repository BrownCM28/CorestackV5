'use client'

import Link from 'next/link'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo, excerpt, formatSalary, getBadge, generateCompanySlug } from '@/lib/utils'
import { track } from '@/lib/analytics'
import CompanyLogo from './CompanyLogo'

interface Props {
  job: Job
  /** Renders the same markup without a real link — for use in listing previews. */
  preview?: boolean
  /** Show a single figure (the higher end of the range) instead of min–max. */
  exactSalary?: boolean
  /** Hide the company logo — for a company's own page, where it already appears once in the header. */
  hideLogo?: boolean
  /** 'medium' matches the lighter weight used on the homepage's category
   * labels; defaults to 'bold' everywhere else (e.g. the /jobs listing). */
  titleWeight?: 'bold' | 'medium'
}

const CARD_CLASSES =
  'relative flex flex-col sm:flex-row gap-4 sm:gap-6 px-5 py-5 sm:px-8 sm:py-7 sm:min-h-[140px] group transition-colors duration-150 hover:bg-black/[0.02]'

export default function JobCard({
  job,
  preview = false,
  exactSalary = false,
  hideLogo = false,
  titleWeight = 'bold',
}: Props) {
  const badge = getBadge(job)
  const salaryMin = exactSalary
    ? (job.salary_max ?? job.salary_min)
    : job.salary_min
  const salaryMax = exactSalary
    ? (job.salary_max ?? job.salary_min)
    : job.salary_max
  const salary = formatSalary(salaryMin, salaryMax, job.salary_hourly)
  const hasSalary = salaryMin !== null || salaryMax !== null

  const content = (
    <>
      <div className="flex items-start gap-4 sm:contents">
        {/* Left: logo */}
        {!hideLogo && (
          <div className="flex-shrink-0 pt-0.5 relative z-10">
            {preview ? (
              <CompanyLogo company={job.company} size={64} />
            ) : (
              <Link
                href={`/companies/${generateCompanySlug(job.company)}`}
                aria-label={`View ${job.company}'s company page`}
                className="inline-block focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
              >
                <CompanyLogo company={job.company} size={64} />
              </Link>
            )}
          </div>
        )}

        {/* Centre: title, company, description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-1.5">
            <h3
              className={`${titleWeight === 'medium' ? 'font-medium' : 'font-bold'} text-base leading-snug group-hover:text-black/70 transition-colors`}
            >
              {job.title}
            </h3>
            {badge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide flex-shrink-0 mt-0.5 ${badge.cls}`}
              >
                {badge.label}
              </span>
            )}
          </div>

          <p className="text-sm text-black/50 mb-2.5">
            {job.company}
            <span className="mx-1.5 text-black/20">·</span>
            {job.location}
            {job.remote && (
              <>
                <span className="mx-1.5 text-black/20">·</span>
                <span className="text-black/40">Remote</span>
              </>
            )}
          </p>

          <p className="text-xs text-black/40 leading-relaxed line-clamp-2 max-w-2xl">
            {excerpt(job.description)}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[11px] border border-black/15 px-2.5 py-0.5">
              {CATEGORY_LABELS[job.category]}
            </span>
            <span className="text-[11px] text-black/30">{daysAgo(job.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Right: salary + Apply button */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/10 sm:flex-shrink-0 sm:flex-col sm:items-end sm:justify-between sm:self-stretch sm:pt-0.5 sm:border-t-0">
        {hasSalary ? (
          <span className="text-sm font-semibold text-[#3ecf8e] tabular-nums">
            {salary}
          </span>
        ) : (
          <span />
        )}
        <span className="sm:mt-4 border border-black px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors group-hover:bg-[#3ecf8e] group-hover:text-black">
          Apply
        </span>
      </div>
    </>
  )

  if (preview) {
    return <div className={CARD_CLASSES}>{content}</div>
  }

  return (
    <div className={CARD_CLASSES}>
      {/* Stretched link — the whole card is clickable, but the logo above
          has its own separate link, so this can't be a single wrapping
          <Link> (nested <a> tags are invalid). */}
      <Link
        href={`/jobs/${job.slug ?? job.id}`}
        onClick={() => track('job_click', { job_id: job.id, title: job.title, company: job.company })}
        aria-label={`${job.title} at ${job.company}`}
        className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
      />
      {content}
    </div>
  )
}
