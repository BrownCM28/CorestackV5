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
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthStatus(user ? 'authed' : 'guest')
    })
  }, [])

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
          className="border border-[#3ecf8e] bg-[#3ecf8e]/10 px-4 py-3 text-sm"
        >
          Application recorded — the employer's application page has opened in a new tab.
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

      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in to Apply</DialogTitle>
            <DialogDescription>
              Create a free account or sign in to apply for this job.
            </DialogDescription>
          </DialogHeader>
          <AuthForm mode="signin" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
