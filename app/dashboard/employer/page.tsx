import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/lib/types'
import JobListingsCard from '@/components/dashboard/employer/JobListingsCard'
import CompanyProfileCard from '@/components/dashboard/employer/CompanyProfileCard'

export const metadata: Metadata = {
  title: 'Employer Dashboard — Corestack',
  description: 'Manage your job listings and company profile on Corestack.',
}

async function countJobImpressions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  jobId: string
): Promise<number | null> {
  const { count, error } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', 'job_impression')
    .eq('metadata->>job_id', jobId)

  if (error) return null
  return count ?? 0
}

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin?next=/dashboard/employer')

  const [
    { data: companyProfile },
    { data: activeData, error: activeError },
    { data: inReviewData, error: inReviewError },
    { data: closedData, error: closedError },
  ] = await Promise.all([
    supabase.from('company_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('jobs')
      .select('*')
      .eq('posted_by', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase
      .from('jobs')
      .select('*')
      .eq('posted_by', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    supabase
      .from('jobs')
      .select('*')
      .eq('posted_by', user.id)
      .eq('status', 'closed')
      .order('updated_at', { ascending: false }),
  ])

  const activeJobs: Job[] = !activeError && activeData ? activeData : []
  const inReviewJobs: Job[] = !inReviewError && inReviewData ? inReviewData : []
  const closedJobs: Job[] = !closedError && closedData ? closedData : []

  const viewCountEntries = await Promise.all(
    activeJobs.map(async (job) => [job.id, await countJobImpressions(supabase, job.id)] as const)
  )
  const viewCounts: Record<string, number | null> = Object.fromEntries(viewCountEntries)

  return (
    <div className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[40%]">
            <JobListingsCard
              activeJobs={activeJobs}
              inReviewJobs={inReviewJobs}
              closedJobs={closedJobs}
              viewCounts={viewCounts}
            />
          </div>
          <div className="w-full lg:w-[60%]">
            <CompanyProfileCard userId={user.id} initialProfile={companyProfile ?? null} />
          </div>
        </div>
      </div>
    </div>
  )
}
