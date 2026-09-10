'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { applyToJob } from '@/app/actions/applications'
import { submitApplicationLead } from '@/app/actions/applicationLeads'

interface Props {
  jobId: string
  applyTarget: string
}

type AuthStatus = 'loading' | 'authed' | 'guest'

const LEAD_SUBMITTED_KEY = 'cs_lead_submitted'

function openApplyTarget(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function readLeadSubmittedFlag(): boolean {
  // Doubles as the SSR guard: this runs once as the useState initializer,
  // including during the server render pass, where `window` genuinely
  // doesn't exist -- short-circuit to false there rather than throwing.
  // Safe against hydration mismatches because this value never affects
  // rendered output, only the click handler's branching.
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(LEAD_SUBMITTED_KEY) === '1'
  } catch {
    return false
  }
}

export default function ApplySheet({ jobId, applyTarget }: Props) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading')
  const [applied, setApplied] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(readLeadSubmittedFlag)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function loadApplied(userId: string) {
      try {
        const { data } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', jobId)
          .eq('applicant_id', userId)
          .maybeSingle()
        if (!cancelled && data) setApplied(true)
      } catch {
        // already-applied indicator is a nice-to-have, not required
      }
    }

    async function init() {
      let user = null
      try {
        const res = await Promise.race([
          supabase.auth.getUser(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('auth check timed out')), 6000)
          ),
        ])
        user = res.data.user
      } catch {
        if (!cancelled) setAuthStatus('guest')
        return
      }
      if (cancelled) return
      setAuthStatus(user ? 'authed' : 'guest')
      if (user) loadApplied(user.id)
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'SIGNED_OUT') {
        setAuthStatus('guest')
      } else if (session?.user) {
        setAuthStatus('authed')
        loadApplied(session.user.id)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [jobId])

  function handleApplyClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (authStatus === 'authed') {
      // Real navigation via the <a> tag proceeds immediately; record the
      // application in the background without making the click wait on it.
      applyToJob(jobId)
        .then(() => setApplied(true))
        .catch(() => {})
      return
    }
    if (leadSubmitted) return // already gave their info this session
    e.preventDefault()
    setError(null)
    setSheetOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitApplicationLead({ jobId, firstName, lastName, email })
      try {
        localStorage.setItem(LEAD_SUBMITTED_KEY, '1')
      } catch {
        // best-effort only
      }
      setLeadSubmitted(true)
      setSheetOpen(false)
      openApplyTarget(applyTarget)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSkip() {
    setSheetOpen(false)
    openApplyTarget(applyTarget)
  }

  useEffect(() => {
    if (!sheetOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleSkip()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen])

  const label = applied ? 'Already Applied — View Listing' : 'Apply for This Job'

  return (
    <>
      <a
        href={applyTarget}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleApplyClick}
        className="inline-block text-center bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
      >
        {label}
      </a>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/40"
            onClick={handleSkip}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-sheet-title"
            className="relative w-full sm:max-w-md bg-white border-t sm:border border-black p-6 sm:mb-6 animate-[apply-sheet-up_0.25s_ease-out]"
          >
            <h2 id="apply-sheet-title" className="text-lg font-bold uppercase tracking-tight mb-1">
              Quick details before you go
            </h2>
            <p className="text-sm text-black/50 mb-5">
              We&apos;ll pass these along so employers can follow up if you&apos;re a fit —
              no account needed.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lead-first-name" className="sr-only">
                    First name
                  </label>
                  <input
                    id="lead-first-name"
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-black px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
                  />
                </div>
                <div>
                  <label htmlFor="lead-last-name" className="sr-only">
                    Last name
                  </label>
                  <input
                    id="lead-last-name"
                    type="text"
                    required
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-black px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
              >
                {submitting ? 'Submitting…' : 'Continue to Application'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-black/40 hover:text-black underline transition-colors duration-150 self-center"
              >
                No thanks, take me there
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
