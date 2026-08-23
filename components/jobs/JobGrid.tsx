import JobCard from './JobCard'
import type { Job } from '@/lib/types'

interface Props {
  jobs: Job[]
  /** 'medium' matches the lighter weight used on the homepage's job cards;
   * defaults to 'bold' everywhere else (e.g. the saved-jobs dashboard). */
  titleWeight?: 'bold' | 'medium'
}

export default function JobGrid({ jobs, titleWeight }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center border border-black bg-white/70 backdrop-blur-sm">
        <p className="text-sm text-black/50">No jobs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <ul role="list" className="grid grid-cols-1 border-l border-t border-black">
      {jobs.map((job) => (
        <li key={job.id} className="border-r border-b border-black bg-white/75 backdrop-blur-sm">
          <JobCard job={job} exactSalary titleWeight={titleWeight} />
        </li>
      ))}
    </ul>
  )
}
