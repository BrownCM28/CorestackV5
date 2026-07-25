import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/lib/types'
import PendingJobsList from '@/components/admin/PendingJobsList'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .not('paid_at', 'is', null)
    .order('created_at', { ascending: true })

  const jobs: Job[] = !error && data ? data : []

  return (
    <div className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Pending Job Approvals</h1>
        <p className="text-sm text-black/50 mb-8">
          Review and approve or reject newly posted jobs before they go live.
        </p>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2 mb-6"
          >
            Couldn&apos;t load pending jobs. Try refreshing the page.
          </p>
        )}

        {!error && jobs.length === 0 && (
          <p className="text-sm text-black/50">No pending jobs to review.</p>
        )}

        {jobs.length > 0 && <PendingJobsList jobs={jobs} />}
      </div>
    </div>
  )
}
