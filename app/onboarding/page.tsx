import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export const metadata: Metadata = {
  title: 'Welcome to Corestack',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin?next=/onboarding')

  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  )
}
