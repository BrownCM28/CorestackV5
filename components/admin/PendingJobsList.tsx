'use client'

import { useState } from 'react'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { daysAgo, formatSalary } from '@/lib/utils'
import AdminJobActions from './AdminJobActions'

interface Props {
  jobs: Job[]
}

export default function PendingJobsList({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs)

  function handleResolved(jobId: string) {
    setJobs((prev) => prev.filter((job) => job.id !== jobId))
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-black/50">All pending jobs have been reviewed.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {jobs.map((job) => (
        <li key={job.id} className="border border-black p-5 flex flex-col gap-3">
          <div>
            <h2 className="font-semibold text-base">{job.title}</h2>
            <p className="text-sm text-black/60 mt-0.5">
              {job.company} · {job.location}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="border border-black/20 px-2 py-0.5">
              {CATEGORY_LABELS[job.category]}
            </span>
            <span className="border border-black/20 px-2 py-0.5">
              {formatSalary(job.salary_min, job.salary_max, job.salary_hourly)}
            </span>
            <span className="text-black/40">{daysAgo(job.created_at)}</span>
          </div>

          <AdminJobActions job={job} onResolved={handleResolved} />
        </li>
      ))}
    </ul>
  )
}
