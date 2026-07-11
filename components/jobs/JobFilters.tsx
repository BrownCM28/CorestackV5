'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import type { Category } from '@/lib/types'

export default function JobFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      router.replace(`/jobs?${next.toString()}`)
    },
    [router, params]
  )

  return (
    <div
      role="search"
      aria-label="Filter jobs"
      className="flex flex-wrap border border-black"
    >
      {/* Search */}
      <div className="flex items-center border-r border-black">
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <input
          id="job-search"
          type="search"
          placeholder="Search jobs…"
          defaultValue={params.get('search') ?? ''}
          onChange={(e) => updateParam('search', e.target.value || null)}
          className="px-4 py-2.5 text-sm bg-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none min-w-48 placeholder:text-black/40"
          autoComplete="off"
        />
      </div>

      {/* Category */}
      <div className="flex items-center border-r border-black">
        <label htmlFor="job-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="job-category"
          value={params.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value || null)}
          className="px-4 py-2.5 text-sm bg-white focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none appearance-none cursor-pointer pr-8"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23000\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">All categories</option>
          {CATEGORY_LIST.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Remote toggle */}
      <label
        htmlFor="job-remote"
        className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer select-none hover:bg-[#3ecf8e]/10 transition-colors duration-150"
      >
        <input
          id="job-remote"
          type="checkbox"
          checked={params.get('remote') === 'true'}
          onChange={(e) =>
            updateParam('remote', e.target.checked ? 'true' : null)
          }
          className="w-4 h-4 border border-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none accent-[#3ecf8e]"
        />
        Remote only
      </label>
    </div>
  )
}
