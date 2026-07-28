'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const RESEND_COOLDOWN_SECONDS = 45

interface Props {
  email: string
  next: string
}

export default function VerifyOtpForm({ email, next }: Props) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setVerifying(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      })

      if (verifyError) {
        setError(verifyError.message)
        setTimeout(() => errorRef.current?.focus(), 0)
        return
      }

      // Verifying grants an active session, same as sign-in — let the
      // middleware's onboarding gate route a not-yet-onboarded user onward.
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setTimeout(() => errorRef.current?.focus(), 0)
    } finally {
      setVerifying(false)
    }
  }

  async function handleResend() {
    setError(null)
    setResendMessage(null)
    setResending(true)

    try {
      const supabase = createClient()
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email })

      if (resendError) {
        setError(resendError.message)
        setTimeout(() => errorRef.current?.focus(), 0)
        return
      }

      setResendMessage('A new code is on its way.')
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setTimeout(() => errorRef.current?.focus(), 0)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm">
      <div>
        <p className="text-sm font-medium">Check your email</p>
        <p className="text-xs text-black/50 mt-1">
          We sent a 6-digit code to <span className="font-medium text-black">{email}</span>. Enter
          it below to confirm your account.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="otp-code" className="text-sm font-medium">
            Verification code
          </label>
          <input
            id="otp-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="border border-black px-3 py-2.5 text-sm tracking-[0.5em] text-center focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40 placeholder:tracking-normal"
          />
        </div>

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

        {resendMessage && !error && (
          <p role="status" aria-live="polite" className="text-sm text-[#3ecf8e]">
            {resendMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying || code.length !== 6}
          className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          {verifying ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending || cooldown > 0}
        className="text-sm text-black underline hover:text-[#3ecf8e] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline self-start focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
      >
        {resending ? 'Sending…' : cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
    </div>
  )
}
