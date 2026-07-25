'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sanitizeNextPath } from '@/lib/utils'

interface Props {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(params.get('error'))
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const next = sanitizeNextPath(
    params.get('next'),
    pathname === '/signin' || pathname === '/signup' ? '/' : pathname
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (mode === 'signup') {
      const confirm = formData.get('confirmPassword') as string
      if (password !== confirm) {
        setError('Passwords do not match.')
        setLoading(false)
        setTimeout(() => errorRef.current?.focus(), 0)
        return
      }
    }

    try {
      const supabase = createClient()
      const { error: authError } =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
              },
            })

      if (authError) {
        setError(authError.message)
        setTimeout(() => errorRef.current?.focus(), 0)
        return
      }

      if (mode === 'signup') {
        setSuccess(true)
        return
      }

      router.push(next)
      if (next === pathname) {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setTimeout(() => errorRef.current?.focus(), 0)
    } finally {
      setLoading(false)
    }
  }

  async function handleGithubSignIn() {
    setError(null)
    setGithubLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (authError) {
        setError(authError.message)
        setGithubLoading(false)
        setTimeout(() => errorRef.current?.focus(), 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setGithubLoading(false)
      setTimeout(() => errorRef.current?.focus(), 0)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setGoogleLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (authError) {
        setError(authError.message)
        setGoogleLoading(false)
        setTimeout(() => errorRef.current?.focus(), 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setGoogleLoading(false)
      setTimeout(() => errorRef.current?.focus(), 0)
    }
  }

  if (success) {
    return (
      <div className="border border-black px-5 py-6 bg-[#3ecf8e]/10">
        <p className="text-sm font-medium">Check your email to confirm your account</p>
        <p className="text-xs text-black/50 mt-1">
          We sent a confirmation link to your inbox. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-sm"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com…"
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          required
          placeholder="Password…"
          minLength={6}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        />
      </div>

      {mode === 'signup' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="auth-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirm password…"
            minLength={6}
            className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          />
        </div>
      )}

      {error && (
        <p
          ref={errorRef}
          role="alert"
          aria-live="polite"
          tabIndex={-1}
          className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2 outline-none"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || githubLoading || googleLoading}
        className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
      >
        {loading
          ? 'Please wait…'
          : mode === 'signin'
          ? 'Sign In'
          : 'Create Account'}
      </button>

      <div className="border-t border-black pt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={loading || githubLoading || googleLoading}
          className="w-full border border-black px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.014 2.896-.014 3.29 0 .319.192.694.801.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
          {githubLoading ? 'Redirecting…' : 'Continue with GitHub'}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || githubLoading || googleLoading}
          className="w-full border border-black px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.49-1.13 2.76-2.4 3.6v3h3.87c2.27-2.09 3.58-5.17 3.58-8.79z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11C3.26 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.6H1.28C.47 8.24 0 10.06 0 12s.47 3.76 1.28 5.4l3.99-3.11z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
          </svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>
      </div>
    </form>
  )
}
