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

  // No next param here: /onboarding is the destination, not somewhere to
  // return to. Setting next=/onboarding would round-trip back to this
  // exact page and, once onboarding is complete, make the final
  // router.push(next) a no-op self-navigation — let it fall through to
  // AuthForm's own default (the homepage) instead.
  if (!user) redirect('/signin')

  return (
    <Suspense fallback={null}>
      <OnboardingFlow userId={user.id} />
    </Suspense>
  )
}
