'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import type { Job } from '@/lib/types'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import JobGrid from '@/components/jobs/JobGrid'

interface Props {
  jobs: Job[]
}

export default function HomeBrowse({ jobs }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return jobs.filter((job) => {
      const matchesCat =
        activeCategory === 'all' || job.category === activeCategory
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [jobs, search, activeCategory])

  const countFor = (cat: Category | 'all') =>
    cat === 'all'
      ? jobs.length
      : jobs.filter((j) => j.category === cat).length

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-md mx-auto mt-8">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search jobs, companies, locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-black text-sm bg-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/30"
        />
      </div>

      {/* Category filter tabs */}
      <div
        className="flex mt-6 overflow-x-auto"
        role="tablist"
        aria-label="Filter by category"
      >
        {(['all', ...CATEGORY_LIST] as const).map((cat, i) => {
          const isFirst = i === 0
          const isActive = activeCategory === cat
          const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat]
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(cat)}
              className={[
                'px-4 py-2 text-sm font-medium whitespace-nowrap border-t border-b border-r border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                isFirst ? 'border-l' : '',
                isActive
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-[#3ecf8e] hover:text-black',
              ]
                .join(' ')
                .trim()}
            >
              {label}
              <span
                className={`ml-1.5 tabular-nums text-xs ${isActive ? 'text-white/60' : 'text-black/30'}`}
              >
                {countFor(cat)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <p className="text-sm text-black/40 mt-5 mb-6" aria-live="polite">
        {filtered.length === 0
          ? 'No openings match your search.'
          : `${filtered.length} open ${filtered.length === 1 ? 'role' : 'roles'}${activeCategory !== 'all' ? ` in ${CATEGORY_LABELS[activeCategory]}` : ''}${search ? ` matching "${search}"` : ''}`}
      </p>

      <JobGrid jobs={filtered} />
    </div>
  )
}
