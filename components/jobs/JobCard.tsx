'use client'

import Link from 'next/link'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo, excerpt, formatSalary, getBadge } from '@/lib/utils'
import { track } from '@/lib/analytics'
import CompanyLogo from './CompanyLogo'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const badge = getBadge(job)
  const salary = formatSalary(job.salary_min, job.salary_max)
  const hasSalary = job.salary_min !== null || job.salary_max !== null

  return (
    <Link
      href={`/jobs/${job.id}`}
      onClick={() => track('job_click', { job_id: job.id, title: job.title, company: job.company })}
      className="flex items-start gap-6 px-8 py-7 min-h-[140px] group transition-colors duration-150 hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
    >
      {/* Left: logo */}
      <div className="flex-shrink-0 pt-0.5">
        <CompanyLogo company={job.company} size={52} />
      </div>

      {/* Centre: title, company, description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-1.5">
          <h3 className="font-bold text-base leading-snug group-hover:text-black/70 transition-colors">
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

      {/* Right: salary + Apply button */}
      <div className="flex-shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
        {hasSalary ? (
          <span className="text-sm font-semibold text-[#3ecf8e] tabular-nums">
            {salary}
          </span>
        ) : (
          <span />
        )}
        <span className="mt-4 border border-black px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors group-hover:bg-[#3ecf8e] group-hover:text-black">
          Apply
        </span>
      </div>
    </Link>
  )
}
