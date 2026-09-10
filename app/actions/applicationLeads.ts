'use server'

import { createClient } from '@/lib/supabase/server'

interface LeadInput {
  jobId: string
  firstName: string
  lastName: string
  email: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitApplicationLead({
  jobId,
  firstName,
  lastName,
  email,
}: LeadInput): Promise<void> {
  const first_name = firstName.trim()
  const last_name = lastName.trim()
  const trimmedEmail = email.trim()

  if (!first_name || !last_name || !trimmedEmail) {
    throw new Error('First name, last name, and email are required.')
  }
  if (!EMAIL_RE.test(trimmedEmail)) {
    throw new Error('Enter a valid email address.')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('application_leads').insert({
    job_id: jobId,
    first_name,
    last_name,
    email: trimmedEmail,
  })
  if (error) throw error
}
