'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, MapPin, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Job, NewsItem, Resource } from '@/lib/types'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import CompanyLogo, { hasRealLogo } from '@/components/jobs/CompanyLogo'
import JobCard from '@/components/jobs/JobCard'
import { track } from '@/lib/analytics'
import Reveal from '@/components/home/sections/Reveal'
import MarketPulse from '@/components/home/sections/MarketPulse'
import InfrastructureEconomy from '@/components/home/sections/InfrastructureEconomy'
import JobsAcrossTheStack from '@/components/home/sections/JobsAcrossTheStack'
import IndustryIntelligence from '@/components/home/sections/IndustryIntelligence'
import CareerDevelopment from '@/components/home/sections/CareerDevelopment'
import Certifications from '@/components/home/sections/Certifications'
import Employers from '@/components/home/sections/Employers'
import FinalCta from '@/components/home/sections/FinalCta'

// ── Constants ─────────────────────────────────────────────────────────────────

const MARKET_PULSE = [
  { label: 'MW Under Construction', value: '34,200', delta: '+18.4% YoY' },
  { label: 'Transformer Lead Time', value: '104 wks', delta: '+12 wks QoQ' },
  { label: 'Hyperscaler Capex 2026E', value: '$312B', delta: '+34% YoY' },
  { label: 'Avg CxA Eng Salary', value: '$142K', delta: '+9% YoY' },
  { label: 'Active US Projects', value: '2,847', delta: '+47 this week' },
]

// Companies with real logos — shown as circular logo tiles in the hero strip
const LOGO_STRIP_COMPANIES = [
  'Equinix',
  'Iron Mountain',
  'Meta',
  'CyrusOne',
  'Turner Construction',
  'Schneider Electric',
]

const JOBS_PREVIEW = 5

// ── Helpers ───────────────────────────────────────────────────────────────────

type SortKey = 'newest' | 'salary' | 'relevance'

function applySort(jobs: Job[], sort: SortKey): Job[] {
  return [...jobs].sort((a, b) => {
    if (sort === 'salary') return (b.salary_min ?? 0) - (a.salary_min ?? 0)
    if (sort === 'newest')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

    // "relevance" -- what actually surfaces on the home page. Real company
    // logos read as more trustworthy than an initials placeholder, so those
    // come first; then the best-paying roles; then paid/sponsored
    // placement; newest breaks any remaining tie.
    const logoDiff = Number(hasRealLogo(b.company)) - Number(hasRealLogo(a.company))
    if (logoDiff !== 0) return logoDiff
    const salaryDiff = (b.salary_max ?? b.salary_min ?? 0) - (a.salary_max ?? a.salary_min ?? 0)
    if (salaryDiff !== 0) return salaryDiff
    const paidDiff = (b.paid_amount_cents ?? 0) - (a.paid_amount_cents ?? 0)
    return paidDiff !== 0 ? paidDiff : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  jobs: Job[]
  news: NewsItem[]
  resources: Resource[]
  categoryCounts: { category: Category; count: number }[]
}

export default function HomeClient({ jobs, news, resources, categoryCounts }: Props) {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('relevance')
  const browseRef = useRef<HTMLDivElement>(null)
  const catScrollRef = useRef<HTMLDivElement>(null)
  const [catCanScroll, setCatCanScroll] = useState(false)
  const [catAtEnd, setCatAtEnd] = useState(false)

  useEffect(() => {
    track('pageview', { page: 'home' })
  }, [])

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

  const employerCompanies = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of jobs) counts.set(j.company, (counts.get(j.company) ?? 0) + 1)
    return Array.from(counts.keys())
      .filter(hasRealLogo)
      .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
  }, [jobs])

  const companyCount = useMemo(() => new Set(jobs.map((j) => j.company)).size, [jobs])
  const remoteCount = useMemo(() => jobs.filter((j) => j.remote).length, [jobs])
  const recentCount = useMemo(
    () =>
      jobs.filter(
        (j) => Date.now() - new Date(j.created_at).getTime() < 7 * 86_400_000
      ).length,
    [jobs]
  )

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase().trim()
    const loc = location.toLowerCase().trim()
    const result = jobs.filter((job) => {
      if (activeCategory !== 'all' && job.category !== activeCategory) return false
      if (
        kw &&
        !job.title.toLowerCase().includes(kw) &&
        !job.company.toLowerCase().includes(kw)
      )
        return false
      if (loc && !job.location.toLowerCase().includes(loc)) return false
      return true
    })
    return applySort(result, sort)
  }, [jobs, keyword, location, activeCategory, sort])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    track('job_search', { keyword, location })
    browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearFilters() {
    setKeyword('')
    setLocation('')
    setActiveCategory('all')
  }

  const hasActiveFilters = keyword || location || activeCategory !== 'all'

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center px-6 py-16 sm:py-28 lg:py-36 text-center overflow-hidden mx-4 sm:mx-6 mt-4"
        style={{ backgroundColor: '#e5e5e5', borderRadius: '20px' }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/backgroundimage/hero-datacenter.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        />
        {/* Light overlay at top for black-text legibility, fades to white at bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.50) 40%, rgba(255,255,255,0.10) 65%, rgba(255,255,255,1) 100%)',
          }}
        />
        {/* Vignette so the photo's left/right/top edges blend into the page
            instead of ending in a hard rectangle — the gradient above only
            handles the top-to-bottom fade */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 75% 70% at 50% 40%, transparent 50%, rgba(255,255,255,0.95) 100%)',
          }}
        />

        {/* Content sits above image + overlay */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-black uppercase tracking-tight leading-[1.05] sm:leading-none text-balance max-w-4xl text-black">
            Infrastructure Jobs For The People Who Keep The World Running.
          </h1>

          {/* Two-field search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-9 flex flex-col sm:flex-row w-full max-w-3xl bg-white border border-white"
          >
            <div className="flex items-center border-b sm:border-b-0 sm:border-r border-black px-4 sm:flex-1 min-w-0">
              <Search size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
              <label htmlFor="hero-kw" className="sr-only">
                Job title or keyword
              </label>
              <input
                id="hero-kw"
                type="text"
                placeholder="Job title or keyword…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
              />
            </div>
            <div className="flex items-center border-b sm:border-b-0 sm:border-r border-black px-4 sm:flex-1 min-w-0">
              <MapPin size={14} className="text-black/30 flex-shrink-0 mr-3" aria-hidden="true" />
              <label htmlFor="hero-loc" className="sr-only">
                Location
              </label>
              <input
                id="hero-loc"
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-black/30 min-w-0"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
            >
              Search
            </button>
          </form>

          {/* Category quick-filters */}
          <div className="flex items-stretch mt-3 max-w-2xl w-full">
            <div
              ref={catScrollRef}
              onScroll={updateCatScrollState}
              className="flex overflow-x-auto scrollbar-hide"
              role="group"
              aria-label="Filter by category"
            >
              {(['all', ...CATEGORY_LIST] as const).map((cat, i) => {
                const isActive = activeCategory === cat
                const label = cat === 'all' ? 'All' : CATEGORY_LABELS[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setActiveCategory(cat); track('category_filter', { category: cat }) }}
                    className={[
                      'px-4 py-2 text-xs font-medium whitespace-nowrap border-t border-b border-r border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                      i === 0 ? 'border-l' : '',
                      isActive ? 'bg-black text-white' : 'bg-white hover:bg-[#3ecf8e]',
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
                className="flex-shrink-0 flex items-center justify-center w-8 bg-black text-white border-t border-b border-r border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
              >
                {catAtEnd ? (
                  <ChevronLeft size={14} aria-hidden="true" />
                ) : (
                  <ChevronRight size={14} aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* Hiring companies strip — logo tiles */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-widest font-medium text-black/35">
              Roles from top employers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {LOGO_STRIP_COMPANIES.map((c) => (
                <CompanyLogo key={c} company={c} size={72} radius="14px" />
              ))}
            </div>
          </div>

          {/* Scroll down */}
          <button
            type="button"
            onClick={() => browseRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 flex items-center gap-2.5 text-sm text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Scroll down
            <span className="w-7 h-7 border border-black/20 flex items-center justify-center">
              <ChevronDown size={14} aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>

      {/* ── BROWSE ───────────────────────────────────────────────────────── */}
      <div
        ref={browseRef}
        id="jobs"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* ── Main layout: job grid + sidebar ─────────────── */}
        <div className="flex divide-x divide-black">

          {/* Left: category tiles + sort bar + mosaic job grid */}
          <div className="flex-1 min-w-0 px-4 sm:px-6">

            {/* Category tiles */}
            <div
              className="flex items-stretch h-11 border-b border-black overflow-x-auto"
              role="group"
              aria-label="Filter by category"
            >
              {(['all', ...CATEGORY_LIST] as const).map((cat, i) => {
                const isActive = activeCategory === cat
                const label = cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setActiveCategory(cat); track('category_filter', { category: cat }) }}
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

            {/* Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-5 py-3 border-b border-black bg-white/60 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                {activeCategory !== 'all' && (
                  <span className="text-xs text-black/50">
                    Filtered by{' '}
                    <span className="font-semibold text-black">
                      {CATEGORY_LABELS[activeCategory]}
                    </span>
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] border border-black/20 px-2 py-0.5 text-black/40 hover:text-black hover:border-black transition-colors focus-visible:ring-1 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    Clear ×
                  </button>
                )}
              </div>
              <div
                className="flex border border-black/20"
                role="group"
                aria-label="Sort order"
              >
                {(['newest', 'salary', 'relevance'] as const).map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSort(s)}
                    aria-pressed={sort === s}
                    className={[
                      'px-3 py-1.5 text-[11px] font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                      i > 0 ? 'border-l border-black/20' : '',
                      sort === s ? 'bg-black text-white' : 'hover:bg-black/5',
                    ].join(' ')}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mosaic job cards */}
            {filtered.length === 0 ? (
              <div className="py-20 text-center bg-white/70 backdrop-blur-sm border-b border-black">
                <p className="text-sm text-black/40">
                  {jobs.length === 0 ? 'No jobs yet — check back soon.' : 'No roles match your search.'}
                </p>
                {jobs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 text-xs underline hover:text-black text-black/40"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <ul
                  role="list"
                  className="grid grid-cols-1 border-l border-t border-black"
                >
                  {filtered.slice(0, JOBS_PREVIEW).map((job) => (
                    <li
                      key={job.id}
                      className="border-r border-b border-black bg-white/75 backdrop-blur-sm"
                    >
                      <JobCard job={job} exactSalary />
                    </li>
                  ))}
                </ul>

                {/* Explore more jobs */}
                <div className="border-l border-r border-b border-black bg-white/70 backdrop-blur-sm px-5 sm:px-8 py-6 flex flex-wrap items-center justify-end gap-4">
                  <Link
                    href="/jobs"
                    className="border border-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    Explore More Jobs →
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="w-56 flex-shrink-0 hidden xl:block" aria-label="Market data and news">
            <div className="sticky top-0 divide-y divide-black bg-white/75 backdrop-blur-sm">
              {/* Market Pulse */}
              <div className="px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                  Market Pulse
                </p>
                <ul role="list" className="space-y-5">
                  {MARKET_PULSE.map((stat) => (
                    <li key={stat.label} className="flex items-start justify-between gap-2">
                      <span className="text-xs text-black/50 leading-snug">{stat.label}</span>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold tabular-nums">{stat.value}</p>
                        <p className="text-[10px] text-[#3ecf8e]">↑ {stat.delta}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Latest News */}
              <div className="px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                  Latest News
                </p>
                <ul role="list" className="space-y-4">
                  {news.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                      >
                        <p className="text-xs font-medium leading-snug group-hover:underline line-clamp-3">
                          {item.headline}
                        </p>
                        <p className="text-[10px] text-black/40 mt-1">
                          <span className="text-[#3ecf8e]">{item.source}</span>
                          {' · '}
                          {new Date(item.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/news"
                  className="mt-5 flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  All news <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>

              {/* Post a job CTA */}
              <div className="px-5 py-6">
                <p className="text-xs font-semibold leading-snug mb-2">
                  Hiring data center talent?
                </p>
                <p className="text-[11px] text-black/50 leading-relaxed mb-4">
                  Reach operations, construction, power, cooling, and networking
                  professionals.
                </p>
                <Link
                  href="/post"
                  className="block text-center text-xs font-medium bg-black text-white px-4 py-2.5 transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── BELOW-JOBS NARRATIVE ─────────────────────────────────────────── */}
      <Reveal>
        <MarketPulse />
      </Reveal>
      <Reveal>
        <InfrastructureEconomy />
      </Reveal>
      <Reveal>
        <JobsAcrossTheStack categoryCounts={categoryCounts} />
      </Reveal>
      <Reveal>
        <IndustryIntelligence news={news} />
      </Reveal>
      <Reveal>
        <CareerDevelopment />
      </Reveal>
      <Reveal>
        <Certifications resources={resources} />
      </Reveal>
      <Reveal>
        <Employers companies={employerCompanies} />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
    </>
  )
}
