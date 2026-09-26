'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Job } from '@/lib/types'
import type { CollectionTrade } from '@/lib/constants'
import JobGrid from './JobGrid'

interface Props {
  jobs: Job[]
  trades?: CollectionTrade[]
}

export default function CollectionJobsClient({ jobs, trades = [] }: Props) {
  const [search, setSearch] = useState('')
  const [activeTrade, setActiveTrade] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const kw = search.toLowerCase().trim()
    return jobs.filter((job) => {
      if (kw && !job.title.toLowerCase().includes(kw) && !job.company.toLowerCase().includes(kw)) {
        return false
      }
      if (activeTrade && !job.title.toLowerCase().includes(activeTrade.toLowerCase())) {
        return false
      }
      return true
    })
  }, [jobs, search, activeTrade])

  return (
    <div>
      <div className="flex items-center border border-black bg-white px-4">
        <Search size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
        <label htmlFor="collection-search" className="sr-only">
          Search these jobs
        </label>
        <input
          id="collection-search"
          type="search"
          placeholder="Job title or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
          autoComplete="off"
        />
      </div>

      {trades.length > 0 && (
        <div
          role="group"
          aria-label="Filter by trade"
          className="flex flex-wrap items-center gap-2 mt-3 mb-6"
        >
          <button
            type="button"
            onClick={() => setActiveTrade(null)}
            aria-pressed={activeTrade === null}
            className={[
              'px-3 py-1.5 text-xs font-medium border border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none',
              activeTrade === null ? 'bg-black text-white' : 'hover:bg-[#3ecf8e] hover:text-black',
            ].join(' ')}
          >
            All
          </button>
          {trades.map((trade) => {
            const isActive = activeTrade === trade.keyword
            return (
              <button
                key={trade.keyword}
                type="button"
                onClick={() => setActiveTrade(isActive ? null : trade.keyword)}
                aria-pressed={isActive}
                className={[
                  'px-3 py-1.5 text-xs font-medium border border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none',
                  isActive ? 'bg-black text-white' : 'hover:bg-[#3ecf8e] hover:text-black',
                ].join(' ')}
              >
                {trade.label}
              </button>
            )
          })}
        </div>
      )}

      <div className={trades.length === 0 ? 'mb-6' : 'mb-3'} />

      <JobGrid jobs={filtered} titleWeight="medium" />
    </div>
  )
}
