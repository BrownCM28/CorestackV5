import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ONBOARDING_EXCLUDED_PREFIXES = ['/onboarding', '/auth', '/api', '/admin']
const ONBOARDING_EXCLUDED_EXACT = ['/signin', '/signup']

function isExcludedFromOnboardingCheck(pathname: string): boolean {
  return (
    ONBOARDING_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    ONBOARDING_EXCLUDED_EXACT.includes(pathname)
  )
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Protect the dashboard route — redirect to /signin if not authenticated
  if (!user && pathname.startsWith('/dashboard')) {
    const originalPath = pathname + request.nextUrl.search
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.search = `?next=${encodeURIComponent(originalPath)}`
    return NextResponse.redirect(url)
  }

  // Protect the post route — redirect to /signin if not authenticated
  if (!user && pathname.startsWith('/post')) {
    const originalPath = pathname + request.nextUrl.search
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.search = `?next=${encodeURIComponent(originalPath)}`
    return NextResponse.redirect(url)
  }

  // Require onboarding before anywhere else, once signed in. The
  // cs_onboarded cookie short-circuits the common case (an already-onboarded
  // user) so this doesn't add a profiles query to every single request —
  // only until the first request after the cookie is set.
  if (user && supabase && !isExcludedFromOnboardingCheck(pathname)) {
    const onboardedCookie = request.cookies.get('cs_onboarded')?.value

    if (onboardedCookie !== '1') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.onboarding_completed) {
        response.cookies.set('cs_onboarded', '1', {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
        })
      } else {
        const originalPath = pathname + request.nextUrl.search
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        url.search = `?next=${encodeURIComponent(originalPath)}`
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
