'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const errorRef = useRef<HTMLParagraphElement>(null)

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

    const supabase = createClient()
    const { error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      setTimeout(() => errorRef.current?.focus(), 0)
      return
    }

    if (mode === 'signup') {
      setSuccess(true)
      setLoading(false)
      return
    }

    const next = params.get('next') ?? '/dashboard'
    router.push(next)
    router.refresh()
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
        disabled={loading}
        className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
      >
        {loading
          ? 'Please wait…'
          : mode === 'signin'
          ? 'Sign In'
          : 'Create Account'}
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
  )
}
