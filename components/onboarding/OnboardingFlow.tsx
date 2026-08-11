'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sanitizeNextPath } from '@/lib/utils'
import { getUtmCookie, clearUtmCookie } from '@/lib/utm'
import { trackSignupConversion } from '@/lib/analytics'
import { CATEGORY_LIST, CATEGORY_LABELS, MARKET_LIST } from '@/lib/constants'
import type { Category, UserType } from '@/lib/types'
import SelectCard from './SelectCard'
import Chip from './Chip'

const SEEKER_URGENCY = [
  { value: 'active', label: 'Actively applying' },
  { value: 'open', label: 'Open to opportunities' },
  { value: 'browsing', label: 'Just browsing' },
] as const

const EMPLOYER_URGENCY = [
  { value: 'hiring_now', label: 'Hiring now' },
  { value: 'next_quarter', label: 'Planning to hire next quarter' },
  { value: 'exploring', label: 'Just exploring' },
] as const

const REFERRAL_SOURCES = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google' },
  { value: 'word_of_mouth', label: 'Word of mouth' },
  { value: 'other', label: 'Other' },
] as const

interface Props {
  userId: string
}

export default function OnboardingFlow({ userId }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const next = sanitizeNextPath(params.get('next'))

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [markets, setMarkets] = useState<string[]>([])
  const [companyName, setCompanyName] = useState('')
  const [urgency, setUrgency] = useState<string | null>(null)
  const [referralSource, setReferralSource] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function handleSelectUserType(type: UserType) {
    setUserType(type)
    setStep(2)
  }

  const step2Valid =
    userType === 'job_seeker'
      ? categories.length > 0 && markets.length > 0
      : companyName.trim() !== '' && categories.length > 0

  const step3Valid = urgency !== null && referralSource !== null

  const urgencyOptions = userType === 'employer' ? EMPLOYER_URGENCY : SEEKER_URGENCY

  async function handleComplete() {
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const utm = getUtmCookie()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          user_type: userType,
          interested_categories: categories,
          preferred_markets: userType === 'job_seeker' ? markets : null,
          company_name: userType === 'employer' ? companyName.trim() : null,
          search_urgency: urgency,
          referral_source: referralSource,
          onboarding_completed: true,
          utm_source: utm?.utm_source ?? null,
          utm_medium: utm?.utm_medium ?? null,
          utm_campaign: utm?.utm_campaign ?? null,
          utm_content: utm?.utm_content ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) {
        setError(updateError.message)
        return
      }

      clearUtmCookie()
      document.cookie = 'cs_onboarded=1; path=/; max-age=31536000'
      trackSignupConversion()
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-6 py-16">
      <div className="max-w-lg mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs text-black/50 whitespace-nowrap">{step} of 3</span>
          <div className="flex gap-1 flex-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 ${s <= step ? 'bg-black' : 'bg-black/15'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">What brings you to Corestack?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectCard
                label="I'm looking for work"
                selected={userType === 'job_seeker'}
                onClick={() => handleSelectUserType('job_seeker')}
              />
              <SelectCard
                label="I'm hiring"
                selected={userType === 'employer'}
                onClick={() => handleSelectUserType('employer')}
              />
            </div>
          </div>
        )}

        {step === 2 && userType === 'job_seeker' && (
          <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">What are you looking for?</h1>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Categories</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.map((c) => (
                  <Chip
                    key={c}
                    label={CATEGORY_LABELS[c]}
                    selected={categories.includes(c)}
                    onClick={() => toggle(categories, c, setCategories)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">Markets</span>
              <div className="flex flex-wrap gap-2">
                {MARKET_LIST.map((m) => (
                  <Chip
                    key={m}
                    label={m}
                    selected={markets.includes(m)}
                    onClick={() => toggle(markets, m, setMarkets)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-white hover:text-black border border-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none self-start"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && userType === 'employer' && (
          <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Tell us about your company</h1>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company-name" className="text-sm font-medium">
                Company name
              </label>
              <input
                id="company-name"
                type="text"
                autoComplete="organization"
                placeholder="Company name…"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">What roles do you hire for?</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LIST.map((c) => (
                  <Chip
                    key={c}
                    label={CATEGORY_LABELS[c]}
                    selected={categories.includes(c)}
                    onClick={() => toggle(categories, c, setCategories)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-white hover:text-black border border-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none self-start"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">
                {userType === 'employer' ? 'How urgently are you hiring?' : 'How urgently are you looking?'}
              </h1>
              <div className="flex flex-col gap-3">
                {urgencyOptions.map((o) => (
                  <SelectCard
                    key={o.value}
                    label={o.label}
                    selected={urgency === o.value}
                    onClick={() => setUrgency(o.value)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">How did you hear about us?</span>
              <div className="flex flex-wrap gap-2">
                {REFERRAL_SOURCES.map((r) => (
                  <Chip
                    key={r.value}
                    label={r.label}
                    selected={referralSource === r.value}
                    onClick={() => setReferralSource(r.value)}
                  />
                ))}
              </div>
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
              type="button"
              onClick={handleComplete}
              disabled={!step3Valid || submitting}
              className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-white hover:text-black border border-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none self-start"
            >
              {submitting ? 'Saving…' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
