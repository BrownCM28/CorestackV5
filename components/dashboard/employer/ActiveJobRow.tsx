'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatShortDate, daysRemaining } from './dateHelpers'

interface Props {
  job: Job
  viewCount: number | null
  onClosed: (jobId: string) => void
}

const FEATURE_PRICE_PER_MONTH = 199
const RENEW_PRICE = 299

type Confirming = 'close' | 'feature' | 'renew' | null

export default function ActiveJobRow({ job, viewCount, onClosed }: Props) {
  const [confirming, setConfirming] = useState<Confirming>(null)
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [featureRequested, setFeatureRequested] = useState(false)
  const [renewRequested, setRenewRequested] = useState(false)

  const remaining = daysRemaining(job.created_at)

  async function handleConfirmClose() {
    setClosing(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', job.id)

    if (updateError) {
      setError(updateError.message)
      setClosing(false)
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
        <span className="text-[10px] uppercase tracking-wide border border-black px-2 py-0.5 flex-shrink-0">
          {CATEGORY_LABELS[job.category]}
        </span>
      </div>

      <p className="text-xs text-black/50">
        Posted {formatShortDate(job.created_at)} ·{' '}
        {remaining > 0 ? `${remaining} day${remaining === 1 ? '' : 's'} remaining` : 'Expired'}
        {' · '}
        {!viewCount ? '— views' : `${viewCount} view${viewCount === 1 ? '' : 's'}`}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={`/dashboard/employer/${job.id}/edit`}
          className="border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Edit
        </Link>

        {!job.is_featured && confirming !== 'feature' && (
          <button
            type="button"
            onClick={() => setConfirming('feature')}
            className="border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            Feature
          </button>
        )}

        {confirming !== 'close' && (
          <button
            type="button"
            onClick={() => setConfirming('close')}
            disabled={closing}
            className="border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            Close
          </button>
        )}

        {remaining <= 5 && confirming !== 'renew' && (
          <button
            type="button"
            onClick={() => setConfirming('renew')}
            className="border px-3 py-1.5 text-xs font-medium text-black bg-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            style={{ borderColor: '#3ecf8e' }}
          >
            Renew — ${RENEW_PRICE}
          </button>
        )}
      </div>

      {confirming === 'feature' && (
        <div className="border border-black p-3 flex flex-col gap-2 text-xs">
          {featureRequested ? (
            <p>Thanks — our team will be in touch about featured placement.</p>
          ) : (
            <>
              <p>Boost this listing to the top for ${FEATURE_PRICE_PER_MONTH}/month?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFeatureRequested(true)}
                  className="border border-black px-3 py-1.5 font-medium bg-black text-white hover:bg-white hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="border border-black px-3 py-1.5 font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {confirming === 'renew' && (
        <div className="border border-black p-3 flex flex-col gap-2 text-xs">
          {renewRequested ? (
            <p>Thanks — our team will be in touch to complete your renewal.</p>
          ) : (
            <>
              <p>Extend this listing for another 30 days for ${RENEW_PRICE}?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRenewRequested(true)}
                  className="border border-black px-3 py-1.5 font-medium bg-black text-white hover:bg-white hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="border border-black px-3 py-1.5 font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {confirming === 'close' && (
        <div className="border border-black p-3 flex flex-col gap-2 text-xs">
          <p>Are you sure you want to close this listing?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmClose}
              disabled={closing}
              className="border border-black px-3 py-1.5 font-medium bg-black text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            >
              {closing ? 'Closing…' : 'Yes, close it'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(null)}
              disabled={closing}
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
