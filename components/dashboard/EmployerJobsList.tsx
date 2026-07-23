'use client'

import { useState } from 'react'
import type { Job, JobStatus } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatSalary } from '@/lib/utils'
import EmployerJobActions from './EmployerJobActions'

interface Props {
  jobs: Job[]
}

const STATUS_LABELS: Record<JobStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  closed: 'Closed',
  draft: 'Draft',
}

const STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  pending: 'border-black text-black',
  active: 'border-[#3ecf8e] text-[#3ecf8e]',
  closed: 'border-black/30 text-black/40',
  draft: 'border-black/30 text-black/40',
}

function formatPostedDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function EmployerJobsList({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs)

  function handleClosed(jobId: string) {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: 'closed' } : job))
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {jobs.map((job) => (
        <li key={job.id} className="border border-black p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">{job.title}</h2>
              <p className="text-sm text-black/60 mt-0.5">
                {job.company} · {job.location}
              </p>
            </div>
            <span
              className={`text-xs border px-2 py-0.5 flex-shrink-0 ${STATUS_BADGE_CLASSES[job.status]}`}
            >
              {STATUS_LABELS[job.status]}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="border border-black/20 px-2 py-0.5">
              {CATEGORY_LABELS[job.category]}
            </span>
            <span className="border border-black/20 px-2 py-0.5">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
            <span className="text-black/40">
              Posted {formatPostedDate(job.created_at)}
            </span>
          </div>

          <EmployerJobActions job={job} onClosed={handleClosed} />
        </li>
      ))}
    </ul>
  )
}
