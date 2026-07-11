'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SavedJob } from '@/lib/types'

export async function saveJob(jobId: string): Promise<SavedJob> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('saved_jobs')
    .insert({ job_id: jobId, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/dashboard')
  return data
}

export async function unsaveJob(jobId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('job_id', jobId)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
}
