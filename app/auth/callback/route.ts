import { createClient } from '@/lib/supabase/server'
import { sanitizeNextPath } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeNextPath(searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent('No confirmation code was provided.')}`
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`)
  }

  const user = data.user

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(`${origin}/onboarding?next=${encodeURIComponent(next)}`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
