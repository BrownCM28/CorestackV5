'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/app/actions/jobs'
import type { CreateJobPayload } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'

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
      const job = await createJob(draft)
      sessionStorage.removeItem('corestack_draft')
      router.push(`/jobs/${job.id}`)
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

        {/* Summary card */}
        <div className="border border-black p-6 flex flex-col gap-3">
          <div>
            <p className="font-semibold text-lg">{draft.title}</p>
            <p className="text-black/60 text-sm mt-0.5">
              {draft.company}
              <span className="mx-2 text-black/30">·</span>
              {draft.location}
              {draft.remote && <span className="ml-2 text-black/40">(Remote)</span>}
            </p>
          </div>

          <p className="text-sm">
            <span className="border border-black px-2 py-0.5 text-xs">
              {CATEGORY_LABELS[draft.category]}
            </span>
          </p>

          {(draft.salary_min || draft.salary_max) && (
            <p className="text-sm tabular-nums">
              {draft.salary_min && draft.salary_max
                ? `$${draft.salary_min.toLocaleString()} – $${draft.salary_max.toLocaleString()}`
                : draft.salary_min
                ? `From $${draft.salary_min.toLocaleString()}`
                : `Up to $${draft.salary_max!.toLocaleString()}`}
            </p>
          )}

          <div className="pt-3 border-t border-black flex items-center justify-between">
            <span className="text-sm text-black/50">Listing fee</span>
            <span className="font-bold tabular-nums">${dollars}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-black/40">
          This is a mock checkout — no payment will be charged.
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
            {loading ? 'Posting…' : `Complete Post — $${dollars}`}
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
