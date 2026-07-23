'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Job } from '@/lib/types'

interface Props {
  job: Job
  onClosed: (jobId: string) => void
}

export default function EmployerJobActions({ job, onClosed }: Props) {
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClose() {
    setClosing(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'closed' })
      .eq('id', job.id)

    if (updateError) {
      setError(updateError.message)
      setClosing(false)
      return
    }

    onClosed(job.id)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/employer/${job.id}/edit`}
          className="border border-black px-4 py-2 text-sm font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Edit
        </Link>
        {job.status !== 'closed' && (
          <button
            type="button"
            onClick={handleClose}
            disabled={closing}
            className="border border-black px-4 py-2 text-sm font-medium bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none transition-colors duration-150"
          >
            {closing ? 'Closing…' : 'Close'}
          </button>
        )}
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
