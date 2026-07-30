'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/lib/types'
import { formatShortDate } from './dateHelpers'

interface Props {
  job: Job
  onClosed: (jobId: string) => void
}

export default function InReviewJobRow({ job, onClosed }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleWithdraw() {
    setWithdrawing(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', job.id)

    if (updateError) {
      setError(updateError.message)
      setWithdrawing(false)
      return
    }
    onClosed(job.id)
  }

  return (
    <li className="border border-black p-4 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-bold text-sm">{job.title}</p>
          <p className="text-sm text-black/60">{job.company}</p>
        </div>
        <span
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide border px-2 py-0.5 flex-shrink-0"
          style={{ borderColor: '#3ecf8e' }}
        >
          <span className="w-1.5 h-1.5" style={{ backgroundColor: '#3ecf8e' }} aria-hidden="true" />
          Pending review
        </span>
      </div>

      <p className="text-xs text-black/50">Submitted {formatShortDate(job.created_at)}</p>

      {!confirming && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="self-start border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Withdraw
        </button>
      )}

      {confirming && (
        <div className="border border-black p-3 flex flex-col gap-2 text-xs">
          <p>Are you sure you want to withdraw this listing?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="border border-black px-3 py-1.5 font-medium bg-black text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              {withdrawing ? 'Withdrawing…' : 'Yes, withdraw'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={withdrawing}
              className="border border-black px-3 py-1.5 font-medium bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              No
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600 border border-red-300 bg-red-50 px-2 py-1.5">
          {error}
        </p>
      )}
    </li>
  )
}
