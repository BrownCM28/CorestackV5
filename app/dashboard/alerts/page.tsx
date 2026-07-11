import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AlertsManager from './AlertsManager'

export const metadata: Metadata = {
  title: 'Job Alerts — Corestack',
  description: 'Create and manage job alerts to be notified when matching roles are posted.',
}

export default async function AlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: alerts } = await supabase
    .from('job_alerts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
            Job Alerts
          </h1>
          <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
            Get notified by email when new roles match your criteria.
          </p>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto py-8 px-6 sm:px-8">
        <AlertsManager userId={user.id} initialAlerts={alerts ?? []} />
      </div>
    </div>
  )
}
