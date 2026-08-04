'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import { useUpdateParam } from '@/lib/useUpdateParam'

export default function JobFilters() {
  const params = useSearchParams()
  const updateParam = useUpdateParam('/jobs')

  const activeCategory = params.get('category') ?? ''

  const catScrollRef = useRef<HTMLDivElement>(null)
  const [catCanScroll, setCatCanScroll] = useState(false)
  const [catAtEnd, setCatAtEnd] = useState(false)

  function updateCatScrollState() {
    const el = catScrollRef.current
    if (!el) return
    setCatCanScroll(el.scrollWidth > el.clientWidth + 1)
    setCatAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }

  useEffect(() => {
    updateCatScrollState()
    window.addEventListener('resize', updateCatScrollState)
    return () => window.removeEventListener('resize', updateCatScrollState)
  }, [])

  function handleCatScrollButton() {
    const el = catScrollRef.current
    if (!el) return
    el.scrollTo({ left: catAtEnd ? 0 : el.scrollWidth, behavior: 'smooth' })
  }

  return (
    <div role="search" aria-label="Filter jobs">
      {/* Search + location + remote */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row w-full border border-black bg-white"
      >
        <div className="flex items-center border-b sm:border-b-0 sm:border-r border-black px-4 sm:flex-1 sm:min-w-48">
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

        <div className="flex items-center border-b sm:border-b-0 sm:border-r border-black px-4 sm:flex-1 sm:min-w-48">
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
          className="flex items-center gap-2 px-4 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-black text-sm cursor-pointer select-none whitespace-nowrap hover:bg-[#3ecf8e]/10 transition-colors duration-150"
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

        <button
          type="submit"
          className="bg-black text-white px-6 py-3.5 sm:py-0 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
        >
          Search
        </button>
      </form>

      {/* Category buttons */}
      <div className="flex items-stretch h-11 border-x border-b border-black">
        <div
          ref={catScrollRef}
          onScroll={updateCatScrollState}
          className="flex flex-1 min-w-0 overflow-x-auto scrollbar-hide"
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
        {catCanScroll && (
          <button
            type="button"
            onClick={handleCatScrollButton}
            aria-label={catAtEnd ? 'Scroll categories back' : 'Scroll categories for more'}
            className="flex-shrink-0 flex items-center justify-center w-8 bg-black text-white border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
          >
            {catAtEnd ? (
              <ChevronLeft size={14} aria-hidden="true" />
            ) : (
              <ChevronRight size={14} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
