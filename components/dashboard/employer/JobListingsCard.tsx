'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Job } from '@/lib/types'
import CollapsibleSection from './CollapsibleSection'
import ActiveJobRow from './ActiveJobRow'
import InReviewJobRow from './InReviewJobRow'
import ClosedJobRow from './ClosedJobRow'

interface Props {
  activeJobs: Job[]
  inReviewJobs: Job[]
  closedJobs: Job[]
  viewCounts: Record<string, number | null>
}

export default function JobListingsCard({
  activeJobs: initialActive,
  inReviewJobs: initialInReview,
  closedJobs,
  viewCounts,
}: Props) {
  const [activeJobs, setActiveJobs] = useState(initialActive)
  const [inReviewJobs, setInReviewJobs] = useState(initialInReview)

  return (
    <div className="border border-black bg-white flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black">
        <h2 className="text-lg font-bold">Job Listings</h2>
        <Link
          href="/post"
          className="border border-black px-4 py-2 text-sm font-medium bg-black text-white hover:bg-white hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Post a Job
        </Link>
      </div>

      <CollapsibleSection title="Active" count={activeJobs.length} defaultOpen>
        <ul className="flex flex-col gap-3">
          {activeJobs.map((job) => (
            <ActiveJobRow
              key={job.id}
              job={job}
              viewCount={viewCounts[job.id] ?? null}
              onClosed={(id) => setActiveJobs((prev) => prev.filter((j) => j.id !== id))}
            />
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="In Review" count={inReviewJobs.length}>
        <ul className="flex flex-col gap-3">
          {inReviewJobs.map((job) => (
            <InReviewJobRow
              key={job.id}
              job={job}
              onClosed={(id) => setInReviewJobs((prev) => prev.filter((j) => j.id !== id))}
            />
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Closed" count={closedJobs.length} isLast>
        <ul className="flex flex-col gap-3">
          {closedJobs.map((job) => (
            <ClosedJobRow key={job.id} job={job} />
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  )
}
