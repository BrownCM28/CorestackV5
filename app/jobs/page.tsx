import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs, getJobCompanies } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'
import JobFilters from '@/components/jobs/JobFilters'
import JobsSidebar from '@/components/jobs/JobsSidebar'
import type { DatePosted } from '@/lib/constants'
import type { JobFilters as Filters, Category } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Data Center Jobs — Corestack',
  description:
    'Browse open roles in data center construction, operations, critical power, cooling, and networking. The job board for infrastructure professionals.',
  openGraph: {
    title: 'Data Center Jobs — Corestack',
    description:
      'Browse open roles in data center construction, operations, critical power, cooling, and networking.',
    url: 'https://corestack-v1-5nci.vercel.app/jobs',
    siteName: 'Corestack',
    type: 'website',
  },
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    location?: string
    remote?: string
    search?: string
    companies?: string
    posted?: string
    skills?: string
  }>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const sp = await searchParams

  const filters: Filters = {}
  if (sp.category) filters.category = sp.category as Category
  if (sp.location) filters.location = sp.location
  if (sp.remote === 'true') filters.remote = true
  if (sp.search) filters.search = sp.search
  if (sp.companies) filters.companies = sp.companies.split(',').filter(Boolean)
  if (sp.posted) filters.postedWithin = sp.posted as DatePosted
  if (sp.skills) filters.skills = sp.skills.split(',').filter(Boolean)

  const [jobs, companies] = await Promise.all([
    getJobs(filters).catch(() => []),
    getJobCompanies().catch(() => []),
  ])

  return (
    <div
      className="px-6 py-10"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

        <Suspense fallback={null}>
          <JobFilters />
        </Suspense>

        <div className="mt-3 mb-2">
          <Link
            href="/dashboard/alerts"
            className="text-xs text-black/40 hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Get alerts for this search →
          </Link>
        </div>

        <div className="mt-8 flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <JobGrid jobs={jobs} />
          </div>

          <Suspense fallback={null}>
            <JobsSidebar companies={companies} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
