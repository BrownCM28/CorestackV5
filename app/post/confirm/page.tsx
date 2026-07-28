'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { startJobCheckout } from '@/app/actions/jobs'
import type { CreateJobPayload, Job } from '@/lib/types'
import JobCard from '@/components/jobs/JobCard'

function toPreviewJob(draft: CreateJobPayload): Job {
  return {
    ...draft,
    id: 'preview',
    posted_by: null,
    created_at: new Date().toISOString(),
    status: 'active',
    paid_at: null,
  }
}

export default function ConfirmPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<CreateJobPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('corestack_draft')
    if (!raw) {
      router.replace('/post')
      return
    }
    try {
      setDraft(JSON.parse(raw))
    } catch {
      router.replace('/post')
    }
  }, [router])

  async function handlePost() {
    if (!draft) return
    setLoading(true)
    setError(null)
    try {
      await startJobCheckout(draft)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!draft) {
    return (
      <div className="px-6 py-10 text-center text-sm text-black/50">
        Loading…
      </div>
    )
  }

  const dollars = Math.round(draft.paid_amount_cents / 100)

  return (
    <div className="px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Review Your Listing</h1>

        {/* Preview — the exact card this listing will render as on /jobs */}
        <div className="border border-black bg-white">
          <JobCard job={toPreviewJob(draft)} preview />
        </div>

        <div className="border border-black border-t-0 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-black/50">Listing fee</span>
          <span className="font-bold tabular-nums">${dollars}</span>
        </div>

        <p className="mt-4 text-xs text-black/40">
          You&apos;ll be redirected to Stripe to complete payment.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-0 flex-wrap">
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            {loading ? 'Redirecting…' : `Continue to Payment — $${dollars}`}
          </button>
          <a
            href="/post"
            className="border border-black border-l-0 px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            Edit listing
          </a>
        </div>
      </div>
    </div>
  )
}
