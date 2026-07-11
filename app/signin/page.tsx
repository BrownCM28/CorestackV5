'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-sm text-black/50 mb-8">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Create one
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
            />
          </div>
          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            {loading ? 'Please wait…' : 'Sign In'}
          </button>
          <div className="border-t border-black pt-4">
            <button
              type="button"
              disabled
              className="w-full border border-black px-4 py-2.5 text-sm font-medium opacity-40 cursor-not-allowed"
              aria-label="Continue with Google (coming soon)"
            >
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
