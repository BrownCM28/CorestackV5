'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Props {
  jobId: string
}

export default function SaveJobButton({ jobId }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) {
        setIsLoading(false)
        return
      }
      const { data } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .single()
      setIsSaved(!!data)
      setIsLoading(false)
    }
    init()
  }, [jobId])

  async function handleClick() {
    if (!user) {
      router.push('/signin')
      return
    }

    const supabase = createClient()
    const nextSaved = !isSaved

    // Optimistic update
    setIsSaved(nextSaved)
    setIsLoading(true)

    let error: { message: string } | null = null
    if (nextSaved) {
      ;({ error } = await supabase
        .from('saved_jobs')
        .insert({ user_id: user.id, job_id: jobId }))
    } else {
      ;({ error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId))
    }

    if (error) setIsSaved(!nextSaved) // silent revert
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isSaved ? 'Unsave job' : 'Save job'}
      className="flex items-center justify-center w-11 h-11 border border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none flex-shrink-0"
    >
      <Bookmark
        className="w-4 h-4"
        fill={isSaved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  )
}
