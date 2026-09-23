'use server'

import { createClient } from '@/lib/supabase/server'

interface EmployerInquiryInput {
  companyName: string
  contactName: string
  email: string
  phone?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitEmployerInquiry({
  companyName,
  contactName,
  email,
  phone,
  message,
}: EmployerInquiryInput): Promise<void> {
  const company_name = companyName.trim()
  const contact_name = contactName.trim()
  const trimmedEmail = email.trim()
  const trimmedPhone = phone?.trim() ?? ''
  const trimmedMessage = message?.trim() ?? ''

  if (!company_name || !contact_name || !trimmedEmail) {
    throw new Error('Company name, your name, and email are required.')
  }
  if (!EMAIL_RE.test(trimmedEmail)) {
    throw new Error('Enter a valid email address.')
  }

  const supabase = await createClient()
  const { error } = await supabase.from('employer_inquiries').insert({
    company_name,
    contact_name,
    email: trimmedEmail,
    phone: trimmedPhone || null,
    message: trimmedMessage || null,
  })
  if (error) throw error
}
