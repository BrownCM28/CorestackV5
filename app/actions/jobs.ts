'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobStatus, CreateJobPayload } from '@/lib/types'

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...payload, posted_by: user.id, status: 'active' })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/jobs')
  return data
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', id)
    .eq('posted_by', user.id)
  if (error) throw error
  revalidatePath('/jobs')
  revalidatePath('/dashboard')
}
