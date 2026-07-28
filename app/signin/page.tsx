import { Suspense } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'
import { sanitizeNextPath } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function SignInPage({ searchParams }: PageProps) {
  const { next } = await searchParams
  const signupHref = next ? `/signup?next=${encodeURIComponent(sanitizeNextPath(next))}` : '/signup'

  return (
    <div className="px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-sm text-black/50 mb-8">
          Don&apos;t have an account?{' '}
          <Link
            href={signupHref}
            className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Create one
          </Link>
        </p>
        <Suspense fallback={null}>
          <AuthForm mode="signin" />
        </Suspense>
      </div>
    </div>
  )
}
