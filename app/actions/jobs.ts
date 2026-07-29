'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createJobCheckoutSession } from '@/lib/stripe'
import type { Job, JobStatus, CreateJobPayload } from '@/lib/types'

async function getOrigin(): Promise<string> {
  const headersList = await headers()
  const origin = headersList.get('origin')
  if (origin) return origin
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}`
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...payload, posted_by: user.id, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/jobs')
  return data
}

export async function updateJob(
  id: string,
  payload: CreateJobPayload
): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('jobs')
    .update(payload)
    .eq('id', id)
    .eq('posted_by', user.id)
  if (error) throw error
  revalidatePath('/jobs')
  revalidatePath('/dashboard/employer')
}

export async function startJobCheckout(payload: CreateJobPayload): Promise<void> {
  const job = await createJob(payload)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const origin = await getOrigin()
  const url = await createJobCheckoutSession(job, origin, user?.email)
  redirect(url)
}

export async function resumeJobCheckout(jobId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('posted_by', user.id)
    .single()
  if (error || !job) throw new Error('Job not found.')
  if (job.paid_at) throw new Error('This job has already been paid for.')

  const origin = await getOrigin()
  const url = await createJobCheckoutSession(job, origin, user.email)
  redirect(url)
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
