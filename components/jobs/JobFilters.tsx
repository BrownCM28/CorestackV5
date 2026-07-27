'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, MapPin } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'

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

  const activeCategory = params.get('category') ?? ''

  return (
    <div role="search" aria-label="Filter jobs">
      {/* Search + location + remote */}
      <div className="flex flex-wrap w-full border border-black bg-white">
        <div className="flex flex-1 items-center border-r border-black px-4 min-w-48">
          <Search size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
          <label htmlFor="job-search" className="sr-only">
            Search jobs
          </label>
          <input
            id="job-search"
            type="search"
            placeholder="Job title or keyword…"
            defaultValue={params.get('search') ?? ''}
            onChange={(e) => updateParam('search', e.target.value || null)}
            className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-1 items-center border-r border-black px-4 min-w-48">
          <MapPin size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
          <label htmlFor="job-location" className="sr-only">
            Location
          </label>
          <input
            id="job-location"
            type="search"
            placeholder="Location"
            defaultValue={params.get('location') ?? ''}
            onChange={(e) => updateParam('location', e.target.value || null)}
            className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
            autoComplete="off"
          />
        </div>

        <label
          htmlFor="job-remote"
          className="flex items-center gap-2 px-4 text-sm cursor-pointer select-none whitespace-nowrap hover:bg-[#3ecf8e]/10 transition-colors duration-150"
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

      {/* Category buttons */}
      <div
        className="flex items-stretch h-11 border-x border-b border-black overflow-x-auto"
        role="group"
        aria-label="Filter by category"
      >
        {(['', ...CATEGORY_LIST] as const).map((cat, i) => {
          const isActive = activeCategory === cat
          const label = cat === '' ? 'All Categories' : CATEGORY_LABELS[cat]
          return (
            <button
              key={cat}
              type="button"
              onClick={() => updateParam('category', cat || null)}
              aria-pressed={isActive}
              className={[
                'flex items-center px-4 text-sm font-medium whitespace-nowrap border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                i > 0 ? 'border-l' : '',
                isActive ? 'bg-black text-white' : 'hover:bg-[#3ecf8e] hover:text-black',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
