import Link from 'next/link'
import type { Job } from '@/lib/types'
import { formatShortDate } from './dateHelpers'

interface Props {
  job: Job
}

export default function ClosedJobRow({ job }: Props) {
  return (
    <li className="border border-black p-4 flex items-start justify-between gap-3 flex-wrap">
      <div>
        <p className="font-bold text-sm" style={{ color: '#888' }}>
          {job.title}
        </p>
        <p className="text-sm" style={{ color: '#888' }}>
          {job.company}
        </p>
        <p className="text-xs mt-1" style={{ color: '#888' }}>
          Closed {formatShortDate(job.updated_at)}
        </p>
      </div>
      <Link
        href={`/post?repost=${job.id}`}
        className="border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none flex-shrink-0"
      >
        Repost
      </Link>
    </li>
  )
}
