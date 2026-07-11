import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'

export const metadata: Metadata = {
  title: 'Dashboard — Corestack',
  description: 'Manage your candidate profile and job preferences.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Corestack
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            My Dashboard
          </h1>
          <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
            Update your candidate profile, set your preferences, and control
            your visibility to employers.
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex gap-0 divide-x divide-black border-b border-black">

        {/* Profile form */}
        <div className="flex-1 min-w-0 py-8 px-6 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-6">
            Profile
          </p>
          <ProfileForm
            profile={
              profile ?? {
                id: user.id,
                full_name: null,
                title: null,
                location: null,
                bio: null,
                open_to_work: null,
                profile_visible: null,
              }
            }
          />
        </div>

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden lg:block" aria-label="Quick actions">
          <div className="sticky top-0 divide-y divide-black">

            {/* Quick actions */}
            <div className="px-6 py-7 bg-white/70 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                Quick Actions
              </p>
              <div className="space-y-2">
                <Link
                  href="/dashboard/saved"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Saved Jobs
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/dashboard/alerts"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Job Alerts
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/jobs"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Browse Jobs
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/post"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Post a Job
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Training &amp; Resources
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
                <Link
                  href="/news"
                  className="flex items-center justify-between px-4 py-3 border border-black text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none group"
                >
                  Industry News
                  <span className="text-black/30 group-hover:text-white transition-colors">→</span>
                </Link>
              </div>
            </div>

            {/* Market snapshot */}
            <div className="px-6 py-7 bg-white/70 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Market Snapshot
              </p>
              <dl className="space-y-3">
                {[
                  { label: 'Avg Ops Technician', value: '$63K' },
                  { label: 'Avg Critical Power Eng', value: '$112K' },
                  { label: 'Avg Construction PM', value: '$108K' },
                  { label: 'Remote roles available', value: '4' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-black/45 leading-snug">{s.label}</dt>
                    <dd className="text-xs font-bold tabular-nums flex-shrink-0">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </aside>
      </div>
    </div>
  )
}
