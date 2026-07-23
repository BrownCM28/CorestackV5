'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/lib/types'

interface Props {
  job: Job
  onResolved: (jobId: string) => void
}

type Action = 'approve' | 'reject'

export default function AdminJobActions({ job, onResolved }: Props) {
  const [pending, setPending] = useState<Action | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: Action) {
    setPending(action)
    setError(null)

    const supabase = createClient()
    const status = action === 'approve' ? 'active' : 'closed'
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', job.id)

    if (updateError) {
      setError(updateError.message)
      setPending(null)
      return
    }

    onResolved(job.id)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleAction('approve')}
          disabled={pending !== null}
          className="border border-black px-4 py-2 text-sm font-medium bg-black text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none transition-colors duration-150"
        >
          {pending === 'approve' ? 'Approving…' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => handleAction('reject')}
          disabled={pending !== null}
          className="border border-black px-4 py-2 text-sm font-medium bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none transition-colors duration-150"
        >
          {pending === 'reject' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2"
        >
          {error}
        </p>
      )}
    </div>
  )
}
