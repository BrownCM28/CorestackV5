'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_LIST, CATEGORY_LABELS } from '@/lib/constants'
import { updateJob } from '@/app/actions/jobs'
import type { Job, Category, CreateJobPayload } from '@/lib/types'

interface Props {
  job: Job
}

export default function EditJobForm({ job }: Props) {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function validate(data: Record<string, string>): Record<string, string> {
    const errs: Record<string, string> = {}
    if (!data.title?.trim()) errs.title = 'Job title is required.'
    if (!data.company?.trim()) errs.company = 'Company name is required.'
    if (!data.location?.trim()) errs.location = 'Location is required.'
    if (!data.category) errs.category = 'Category is required.'
    if (!data.description?.trim()) errs.description = 'Description is required.'
    if (!data.apply_target?.trim()) errs.apply_target = 'Application URL or email is required.'
    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    const fd = new FormData(e.currentTarget)
    const raw: Record<string, string> = {}
    fd.forEach((v, k) => {
      if (typeof v === 'string') raw[k] = v
    })

    const errs = validate(raw)
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0]
      const el = document.getElementById(`field-${firstKey}`)
      el?.focus()
      return
    }

    const payload: CreateJobPayload = {
      title: raw.title.trim(),
      company: raw.company.trim(),
      location: raw.location.trim(),
      category: raw.category as Category,
      remote: raw.remote === 'on',
      description: raw.description.trim(),
      salary_min: raw.salary_min ? Number(raw.salary_min) : null,
      salary_max: raw.salary_max ? Number(raw.salary_max) : null,
      apply_target: raw.apply_target.trim(),
      paid_amount_cents: job.paid_amount_cents,
    }

    setSubmitting(true)
    try {
      await updateJob(job.id, payload)
      router.push('/dashboard/employer')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  function fieldClass(name: string) {
    return `border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none w-full ${
      errors[name] ? 'border-red-500' : 'border-black'
    }`
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 max-w-2xl">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-title" className="text-sm font-medium">
          Job Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="field-title"
          name="title"
          type="text"
          autoComplete="off"
          defaultValue={job.title}
          className={fieldClass('title')}
        />
        {errors.title && <p role="alert" className="text-xs text-red-600">{errors.title}</p>}
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-company" className="text-sm font-medium">
          Company <span aria-hidden="true">*</span>
        </label>
        <input
          id="field-company"
          name="company"
          type="text"
          autoComplete="organization"
          defaultValue={job.company}
          className={fieldClass('company')}
        />
        {errors.company && <p role="alert" className="text-xs text-red-600">{errors.company}</p>}
      </div>

      {/* Location + Remote */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5 flex-1 min-w-48">
          <label htmlFor="field-location" className="text-sm font-medium">
            Location <span aria-hidden="true">*</span>
          </label>
          <input
            id="field-location"
            name="location"
            type="text"
            autoComplete="off"
            defaultValue={job.location}
            className={fieldClass('location')}
          />
          {errors.location && <p role="alert" className="text-xs text-red-600">{errors.location}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer pt-6">
          <input
            name="remote"
            type="checkbox"
            defaultChecked={job.remote}
            className="w-4 h-4 border border-black accent-[#3ecf8e]"
          />
          Remote role
        </label>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-category" className="text-sm font-medium">
          Category <span aria-hidden="true">*</span>
        </label>
        <select
          id="field-category"
          name="category"
          defaultValue={job.category}
          className={fieldClass('category')}
        >
          <option value="" disabled>Select a category…</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        {errors.category && <p role="alert" className="text-xs text-red-600">{errors.category}</p>}
      </div>

      {/* Salary range */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5 flex-1 min-w-32">
          <label htmlFor="field-salary_min" className="text-sm font-medium">Salary Min (USD)</label>
          <input
            id="field-salary_min"
            name="salary_min"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={job.salary_min ?? ''}
            className={fieldClass('salary_min')}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-32">
          <label htmlFor="field-salary_max" className="text-sm font-medium">Salary Max (USD)</label>
          <input
            id="field-salary_max"
            name="salary_max"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={job.salary_max ?? ''}
            className={fieldClass('salary_max')}
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-description" className="text-sm font-medium">
          Job Description <span aria-hidden="true">*</span>
          <span className="font-normal text-black/50 ml-2">(Markdown supported)</span>
        </label>
        <textarea
          id="field-description"
          name="description"
          rows={10}
          defaultValue={job.description}
          className={fieldClass('description') + ' resize-y'}
        />
        {errors.description && <p role="alert" className="text-xs text-red-600">{errors.description}</p>}
      </div>

      {/* Apply target */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="field-apply_target" className="text-sm font-medium">
          Application URL or Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="field-apply_target"
          name="apply_target"
          type="text"
          autoComplete="off"
          defaultValue={job.apply_target}
          className={fieldClass('apply_target')}
        />
        {errors.apply_target && <p role="alert" className="text-xs text-red-600">{errors.apply_target}</p>}
      </div>

      {submitError && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2"
        >
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-6 py-3 text-sm font-medium border border-black transition-colors duration-150 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none self-start"
      >
        {submitting ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
