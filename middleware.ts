import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  // Protect the dashboard route — redirect to /signin if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const originalPath = request.nextUrl.pathname + request.nextUrl.search
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.search = `?next=${encodeURIComponent(originalPath)}`
    return NextResponse.redirect(url)
  }

  // Protect the post route — redirect to /signin if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/post')) {
    const originalPath = request.nextUrl.pathname + request.nextUrl.search
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.search = `?next=${encodeURIComponent(originalPath)}`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
