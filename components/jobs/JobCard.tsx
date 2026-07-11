import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo } from '@/lib/utils'
import CompanyLogo from './CompanyLogo'

function excerpt(text: string, max = 110): string {
  const plain = text
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  return plain.slice(0, max).trimEnd() + '…'
}

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex flex-col p-5 h-full transition-colors duration-150 hover:bg-black/[0.025] group focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
    >
      {/* Top row: logo + arrow */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <CompanyLogo company={job.company} size={36} />
        <ArrowUpRight
          size={14}
          className="text-black/20 group-hover:text-black/50 transition-colors flex-shrink-0 mt-1"
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">
        {job.title}
      </h3>

      {/* Company + excerpt */}
      <p className="text-xs text-black/50 leading-relaxed line-clamp-3 flex-1">
        <span className="font-medium text-black/70">{job.company}</span>
        {' · '}
        {job.location}
        {' — '}
        {excerpt(job.description)}
      </p>

      {/* Footer: badges + days ago */}
      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="text-xs border border-black/20 px-2 py-0.5 whitespace-nowrap">
            {CATEGORY_LABELS[job.category]}
          </span>
          {job.remote && (
            <span className="text-xs border border-black/20 px-2 py-0.5">
              Remote
            </span>
          )}
        </div>
        <span className="text-xs text-black/40 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
          <Clock size={10} aria-hidden="true" />
          {daysAgo(job.created_at)}
        </span>
      </div>
    </Link>
  )
}
