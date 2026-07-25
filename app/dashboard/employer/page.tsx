import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/lib/types'
import EmployerJobsList from '@/components/dashboard/EmployerJobsList'

export const metadata: Metadata = {
  title: 'My Job Listings — Corestack',
  description: 'Manage the jobs you have posted on Corestack.',
}

interface PageProps {
  searchParams: Promise<{ checkout?: string }>
}

export default async function EmployerDashboardPage({ searchParams }: PageProps) {
  const { checkout } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('posted_by', user.id)
    .order('created_at', { ascending: false })

  const jobs: Job[] = !error && data ? data : []

  return (
    <div className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My Job Listings</h1>
        <p className="text-sm text-black/50 mb-8">
          Manage the jobs you&apos;ve posted on Corestack.
        </p>

        {checkout === 'canceled' && (
          <p className="text-sm text-black border border-black px-3 py-2 mb-6">
            Checkout was canceled. You can resume payment on the listing
            below whenever you&apos;re ready.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2 mb-6"
          >
            Couldn&apos;t load your job listings. Try refreshing the page.
          </p>
        )}

        {!error && jobs.length === 0 && (
          <div className="border border-black p-6 flex flex-col gap-3">
            <p className="text-sm text-black/50">
              You haven&apos;t posted any jobs yet.
            </p>
            <Link
              href="/post"
              className="self-start border border-black px-4 py-2 text-sm font-medium bg-black text-white hover:bg-white hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              Post a Job
            </Link>
          </div>
        )}

        {jobs.length > 0 && <EmployerJobsList jobs={jobs} />}
      </div>
    </div>
  )
}
