'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { applyToJob } from '@/app/actions/applications'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import AuthForm from './AuthForm'

interface Props {
  jobId: string
}

type AuthStatus = 'loading' | 'authed' | 'guest'

export default function AuthGate({ jobId }: Props) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'signin' | 'signup'>('signin')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [justApplied, setJustApplied] = useState(false)
  const [applyTarget, setApplyTarget] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function init() {
      let user = null
      try {
        const res = await supabase.auth.getUser()
        user = res.data.user
      } catch {
        if (!cancelled) setAuthStatus('guest')
        return
      }
      if (cancelled) return
      setAuthStatus(user ? 'authed' : 'guest')
      if (!user) return

      // Re-derive "already applied" from the database rather than only
      // from in-session state, so returning to this page (back button,
      // reopening the tab, a hard refresh) still shows the confirmation
      // instead of resetting to a fresh "Apply" button. Best-effort: any
      // failure here just leaves the button in its default state.
      try {
        const { data } = await supabase
          .from('applications')
          .select('id, job:jobs(apply_target)')
          .eq('job_id', jobId)
          .eq('applicant_id', user.id)
          .maybeSingle()
        if (cancelled || !data) return
        setApplied(true)
        const job = Array.isArray(data.job) ? data.job[0] : data.job
        if (job?.apply_target) setApplyTarget(job.apply_target)
      } catch {
        // ignore — already-applied indicator is a nice-to-have, not required
      }
    }
    init()

    return () => {
      cancelled = true
    }
  }, [jobId])

  async function handleApply() {
    if (authStatus === 'guest') {
      setDialogOpen(true)
      return
    }
    setApplying(true)
    setError(null)
    try {
      const { apply_target } = await applyToJob(jobId)
      setApplied(true)
      setJustApplied(true)
      setApplyTarget(apply_target)
      window.open(apply_target, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {applied ? (
        <div
          role="status"
          aria-live="polite"
          className="border border-[#3ecf8e] bg-[#3ecf8e]/10 px-4 py-3 text-sm flex flex-col gap-2"
        >
          <span>
            {justApplied
              ? "Application recorded — the employer's application page has opened in a new tab."
              : "You've already applied to this job."}
          </span>
          {applyTarget && (
            <a
              href={applyTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-xs font-medium underline hover:text-black transition-colors duration-150"
            >
              View the listing again →
            </a>
          )}
        </div>
      ) : (
        <button
          onClick={handleApply}
          disabled={applying || authStatus === 'loading'}
          className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          {applying ? 'Applying…' : 'Apply for This Job'}
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setDialogMode('signin')
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'signin' ? 'Sign In to Apply' : 'Create an Account to Apply'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setDialogMode('signup')}
                    className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setDialogMode('signin')}
                    className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    Sign in
                  </button>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <AuthForm mode={dialogMode} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
