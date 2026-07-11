import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import JobGrid from '@/components/jobs/JobGrid'
import type { Job } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Saved Jobs — Corestack',
  description: 'Jobs you have bookmarked on Corestack.',
}

export default async function SavedJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: savedData } = await supabase
    .from('saved_jobs')
    .select('job_id, created_at, jobs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const jobs: Job[] = ((savedData ?? []) as unknown as Array<{ jobs: Job | Job[] | null }>)
    .map((row) => {
      const j = row.jobs
      if (!j) return null
      return Array.isArray(j) ? (j[0] ?? null) : j
    })
    .filter((j): j is Job => j !== null)

  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-12 border-b border-black">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-black/40 hover:text-black transition-colors mb-6 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            ← Dashboard
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Corestack
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Saved Jobs
          </h1>
          <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
            Roles you&apos;ve bookmarked — {jobs.length} saved.
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        {jobs.length === 0 ? (
          <div className="border border-black px-8 py-16 text-center bg-white/75 backdrop-blur-sm">
            <p className="text-sm text-black/50 mb-1">No saved jobs yet.</p>
            <p className="text-xs text-black/35 mb-6 max-w-xs mx-auto">
              Browse open positions and bookmark roles you want to revisit.
            </p>
            <Link
              href="/jobs"
              className="inline-block bg-black text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <JobGrid jobs={jobs} />
        )}
      </div>
    </div>
  )
}
