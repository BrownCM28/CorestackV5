'use server'

import { createClient } from '@/lib/supabase/server'

export async function applyToJob(
  jobId: string
): Promise<{ apply_target: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('apply_target')
    .eq('id', jobId)
    .single()
  if (jobError) throw jobError

  await supabase
    .from('applications')
    .upsert(
      { job_id: jobId, applicant_id: user.id },
      { onConflict: 'job_id,applicant_id' }
    )

  return { apply_target: job.apply_target }
}
