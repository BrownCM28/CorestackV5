'use client'

import { useState } from 'react'
import type { Job } from '@/lib/types'
import EmployerJobListItem from './EmployerJobListItem'

interface Props {
  jobs: Job[]
}

type Group = 'active' | 'inProgress' | 'closed'

function jobGroup(job: Job): Group {
  if (job.status === 'closed') return 'closed'
  if (job.status === 'active') return 'active'
  return 'inProgress'
}

const GROUP_ORDER: Group[] = ['active', 'inProgress', 'closed']

const GROUP_LABELS: Record<Group, string> = {
  active: 'Active',
  inProgress: 'In Progress',
  closed: 'Closed',
}

export default function EmployerJobsList({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs)

  function handleClosed(jobId: string) {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: 'closed' } : job))
    )
  }

  const grouped: Record<Group, Job[]> = { active: [], inProgress: [], closed: [] }
  jobs.forEach((job) => grouped[jobGroup(job)].push(job))

  return (
    <div className="flex flex-col gap-8">
      {GROUP_ORDER.filter((group) => grouped[group].length > 0).map((group) => (
        <div key={group} className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40">
            {GROUP_LABELS[group]} ({grouped[group].length})
          </h3>
          <ul className="flex flex-col gap-4">
            {grouped[group].map((job) => (
              <EmployerJobListItem key={job.id} job={job} onClosed={handleClosed} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
