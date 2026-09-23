'use client'

import { useState } from 'react'
import { submitEmployerInquiry } from '@/app/actions/employerInquiries'
import { track } from '@/lib/analytics'
import SectionContainer from './SectionContainer'

const fieldClass =
  'w-full border border-black px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]'

export default function EmployerInquiry() {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitEmployerInquiry({ companyName, contactName, email, phone, message })
      track('employer_inquiry_submitted', { company_name: companyName.trim() })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 text-center">
            For Employers
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-center">
            Hiring at Scale?
          </h2>
          <p className="mt-3 text-sm text-black/50 max-w-md mx-auto leading-relaxed text-center">
            Tell us what you&apos;re building and who you need. We&apos;ll reach out to talk
            through bulk listings, featured placement, or sourcing help — no
            need to set up a listing yourself.
          </p>

          {submitted ? (
            <div className="mt-10 border border-black bg-black text-white px-6 py-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide">Thanks — got it.</p>
              <p className="mt-2 text-sm text-white/60">
                We&apos;ll be in touch at the email you gave us shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-company" className="sr-only">
                    Company name
                  </label>
                  <input
                    id="inquiry-company"
                    type="text"
                    required
                    placeholder="Company name"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    placeholder="Your name"
                    autoComplete="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-email" className="sr-only">
                    Work email
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    placeholder="Work email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-phone" className="sr-only">
                    Phone (optional)
                  </label>
                  <input
                    id="inquiry-phone"
                    type="tel"
                    placeholder="Phone (optional)"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="sr-only">
                  What are you hiring for? (optional)
                </label>
                <textarea
                  id="inquiry-message"
                  rows={4}
                  placeholder="What are you hiring for? (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={fieldClass + ' resize-y'}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 bg-black text-white px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none self-center"
              >
                {submitting ? 'Sending…' : 'Get in Touch'}
              </button>
            </form>
          )}
        </div>
      </SectionContainer>
    </section>
  )
}
