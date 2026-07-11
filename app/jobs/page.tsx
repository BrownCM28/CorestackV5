import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'
import JobFilters from '@/components/jobs/JobFilters'
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
  }>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const sp = await searchParams

  const filters: Filters = {}
  if (sp.category) filters.category = sp.category as Category
  if (sp.location) filters.location = sp.location
  if (sp.remote === 'true') filters.remote = true
  if (sp.search) filters.search = sp.search

  const jobs = await getJobs(filters).catch(() => [])

  return (
    <div className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
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

        <div className="mt-8">
          <p className="text-sm text-black/50 mb-4 tabular-nums">
            {jobs.length} {jobs.length === 1 ? 'role' : 'roles'} found
          </p>
          <JobGrid jobs={jobs} />
        </div>
      </div>
    </div>
  )
}
