import JobCard from './JobCard'
import type { Job } from '@/lib/types'

interface Props {
  jobs: Job[]
}

export default function JobGrid({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center border border-black">
        <p className="text-sm text-black/50">No jobs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-black">
      {jobs.map((job) => (
        <div key={job.id} className="border-r border-b border-black">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  )
}
