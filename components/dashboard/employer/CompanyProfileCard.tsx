'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CompanyProfile, Category } from '@/lib/types'
import { CATEGORY_LIST, CATEGORY_LABELS, MARKET_LIST, INDUSTRY_FOCUS_LIST } from '@/lib/constants'
import { generateCompanySlug } from '@/lib/utils'
import ProfileSectionHeader from './ProfileSectionHeader'
import ChipMultiSelect from './ChipMultiSelect'

interface Props {
  userId: string
  initialProfile: CompanyProfile | null
}

interface FormState {
  company_name: string
  tagline: string
  logo_url: string | null
  about: string
  industry_focus: string[]
  founded_year: string
  headquarters: string
  markets: string[]
  total_mw_capacity: string
  num_data_centers: string
  careers_url: string
  website_url: string
  linkedin_url: string
  hiring_contact_email: string
  hiring_categories: Category[]
  avg_hires_per_year: string
  interested_in_featured: boolean
}

function toFormState(p: CompanyProfile | null): FormState {
  return {
    company_name: p?.company_name ?? '',
    tagline: p?.tagline ?? '',
    logo_url: p?.logo_url ?? null,
    about: p?.about ?? '',
    industry_focus: p?.industry_focus ?? [],
    founded_year: p?.founded_year != null ? String(p.founded_year) : '',
    headquarters: p?.headquarters ?? '',
    markets: p?.markets ?? [],
    total_mw_capacity: p?.total_mw_capacity ?? '',
    num_data_centers: p?.num_data_centers != null ? String(p.num_data_centers) : '',
    careers_url: p?.careers_url ?? '',
    website_url: p?.website_url ?? '',
    linkedin_url: p?.linkedin_url ?? '',
    hiring_contact_email: p?.hiring_contact_email ?? '',
    hiring_categories: p?.hiring_categories ?? [],
    avg_hires_per_year: p?.avg_hires_per_year != null ? String(p.avg_hires_per_year) : '',
    interested_in_featured: p?.interested_in_featured ?? false,
  }
}

type SectionKey = 'identity' | 'about' | 'presence' | 'contact' | 'hiring'

const SECTION_LABELS: Record<SectionKey, string> = {
  identity: 'Identity',
  about: 'About',
  presence: 'Presence',
  contact: 'Contact & Links',
  hiring: 'Hiring',
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('')
}

const fieldClass =
  'border border-black px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none w-full'

export default function CompanyProfileCard({ userId, initialProfile }: Props) {
  const [form, setForm] = useState<FormState>(toFormState(initialProfile))
  const [editing, setEditing] = useState<Record<SectionKey, boolean>>({
    identity: false,
    about: false,
    presence: false,
    contact: false,
    hiring: false,
  })
  const [sectionSaving, setSectionSaving] = useState<Record<SectionKey, boolean>>({
    identity: false,
    about: false,
    presence: false,
    contact: false,
    hiring: false,
  })
  const [sectionError, setSectionError] = useState<Record<SectionKey, string | null>>({
    identity: null,
    about: null,
    presence: null,
    contact: null,
    hiring: null,
  })
  const [headerSaving, setHeaderSaving] = useState(false)
  const [headerSaved, setHeaderSaved] = useState(false)
  const [headerError, setHeaderError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function sectionPayload(section: SectionKey): Record<string, unknown> {
    switch (section) {
      case 'identity': {
        const name = form.company_name.trim()
        return {
          company_name: name || null,
          // Keeps /companies/[slug] in sync with the name shown everywhere
          // else -- regenerated on every save rather than set once, since
          // company_name is editable and a stale slug would silently 404.
          slug: name ? generateCompanySlug(name) : null,
          tagline: form.tagline.trim() || null,
          logo_url: form.logo_url,
        }
      }
      case 'about':
        return {
          about: form.about.trim() || null,
          industry_focus: form.industry_focus,
          founded_year: form.founded_year ? Number(form.founded_year) : null,
          headquarters: form.headquarters.trim() || null,
        }
      case 'presence':
        return {
          markets: form.markets,
          num_data_centers: form.num_data_centers ? Number(form.num_data_centers) : null,
          total_mw_capacity: form.total_mw_capacity.trim() || null,
        }
      case 'contact':
        return {
          careers_url: form.careers_url.trim() || null,
          website_url: form.website_url.trim() || null,
          linkedin_url: form.linkedin_url.trim() || null,
          hiring_contact_email: form.hiring_contact_email.trim() || null,
        }
      case 'hiring':
        return {
          hiring_categories: form.hiring_categories,
          avg_hires_per_year: form.avg_hires_per_year ? Number(form.avg_hires_per_year) : null,
          interested_in_featured: form.interested_in_featured,
        }
    }
  }

  async function saveSection(section: SectionKey) {
    setSectionSaving((prev) => ({ ...prev, [section]: true }))
    setSectionError((prev) => ({ ...prev, [section]: null }))

    const supabase = createClient()
    const { error } = await supabase
      .from('company_profiles')
      .upsert({ user_id: userId, ...sectionPayload(section) }, { onConflict: 'user_id' })

    setSectionSaving((prev) => ({ ...prev, [section]: false }))

    if (error) {
      setSectionError((prev) => ({ ...prev, [section]: error.message }))
      return
    }

    setEditing((prev) => ({ ...prev, [section]: false }))
  }

  async function saveAll() {
    setHeaderSaving(true)
    setHeaderError(null)

    const supabase = createClient()
    const { error } = await supabase.from('company_profiles').upsert(
      {
        user_id: userId,
        ...sectionPayload('identity'),
        ...sectionPayload('about'),
        ...sectionPayload('presence'),
        ...sectionPayload('contact'),
        ...sectionPayload('hiring'),
      },
      { onConflict: 'user_id' }
    )

    setHeaderSaving(false)

    if (error) {
      setHeaderError(error.message)
      return
    }

    setEditing({ identity: false, about: false, presence: false, contact: false, hiring: false })
    setHeaderSaved(true)
    setTimeout(() => setHeaderSaved(false), 3000)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image.')
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File must be under 2MB.')
      e.target.value = ''
      return
    }

    setUploading(true)
    const supabase = createClient()
    const path = `${userId}/logo.png`
    const { error: uploadErr } = await supabase.storage
      .from('company-assets')
      .upload(path, file, { upsert: true })

    if (uploadErr) {
      setUploadError(uploadErr.message)
      setUploading(false)
      e.target.value = ''
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('company-assets').getPublicUrl(path)

    const { error: saveErr } = await supabase
      .from('company_profiles')
      .upsert({ user_id: userId, logo_url: publicUrl }, { onConflict: 'user_id' })

    setUploading(false)
    e.target.value = ''

    if (saveErr) {
      setUploadError(saveErr.message)
      return
    }

    update('logo_url', publicUrl)
  }

  function cancelSection(section: SectionKey) {
    setForm(toFormState(initialProfile))
    setEditing((prev) => ({ ...prev, [section]: false }))
    setSectionError((prev) => ({ ...prev, [section]: null }))
  }

  return (
    <div className="border border-black bg-white flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black">
        <h2 className="text-lg font-bold">Company Profile</h2>
        <div className="flex items-center gap-3">
          {headerSaved && <span className="text-xs text-black/50">Saved</span>}
          <button
            type="button"
            onClick={saveAll}
            disabled={headerSaving}
            className="border border-black px-4 py-2 text-sm font-medium bg-black text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            {headerSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {headerError && (
        <p role="alert" className="text-xs text-red-600 border-b border-red-300 bg-red-50 px-5 py-2">
          {headerError}
        </p>
      )}

      {/* Identity */}
      <div className="border-b border-black px-5 py-4 flex flex-col gap-3">
        <ProfileSectionHeader
          label={SECTION_LABELS.identity}
          editing={editing.identity}
          saving={sectionSaving.identity}
          onEdit={() => setEditing((prev) => ({ ...prev, identity: true }))}
          onSave={() => saveSection('identity')}
          onCancel={() => cancelSection('identity')}
        />

        <div className="flex items-center gap-3">
          {form.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.logo_url}
              alt="Company logo"
              className="w-10 h-10 border border-black object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 border border-black flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials(form.company_name)}
            </div>
          )}
          {editing.identity && (
            <label className="border border-black px-3 py-1.5 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 cursor-pointer">
              {uploading ? 'Uploading…' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          )}
        </div>
        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Company name</label>
          {editing.identity ? (
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => update('company_name', e.target.value)}
              className={fieldClass}
            />
          ) : (
            <p className="text-sm">{form.company_name || '—'}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Tagline</label>
            {editing.identity && (
              <span className="text-xs text-black/40">{form.tagline.length}/100</span>
            )}
          </div>
          {editing.identity ? (
            <input
              type="text"
              maxLength={100}
              value={form.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              className={fieldClass}
            />
          ) : (
            <p className="text-sm">{form.tagline || '—'}</p>
          )}
        </div>

        {sectionError.identity && <p className="text-xs text-red-600">{sectionError.identity}</p>}
      </div>

      {/* About */}
      <div className="border-b border-black px-5 py-4 flex flex-col gap-3">
        <ProfileSectionHeader
          label={SECTION_LABELS.about}
          editing={editing.about}
          saving={sectionSaving.about}
          onEdit={() => setEditing((prev) => ({ ...prev, about: true }))}
          onSave={() => saveSection('about')}
          onCancel={() => cancelSection('about')}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Description</label>
            {editing.about && (
              <span className="text-xs text-black/40">{form.about.length}/500</span>
            )}
          </div>
          {editing.about ? (
            <textarea
              rows={4}
              maxLength={500}
              value={form.about}
              onChange={(e) => update('about', e.target.value)}
              className={fieldClass + ' resize-y'}
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{form.about || '—'}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Industry focus</label>
          {editing.about ? (
            <ChipMultiSelect
              options={INDUSTRY_FOCUS_LIST}
              selected={form.industry_focus}
              onChange={(next) => update('industry_focus', next)}
            />
          ) : (
            <p className="text-sm">
              {form.industry_focus.length > 0 ? form.industry_focus.join(', ') : '—'}
            </p>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5 flex-1 min-w-32">
            <label className="text-xs font-medium">Founded year</label>
            {editing.about ? (
              <input
                type="number"
                inputMode="numeric"
                value={form.founded_year}
                onChange={(e) => update('founded_year', e.target.value)}
                className={fieldClass}
              />
            ) : (
              <p className="text-sm">{form.founded_year || '—'}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-32">
            <label className="text-xs font-medium">Headquarters</label>
            {editing.about ? (
              <input
                type="text"
                value={form.headquarters}
                onChange={(e) => update('headquarters', e.target.value)}
                className={fieldClass}
              />
            ) : (
              <p className="text-sm">{form.headquarters || '—'}</p>
            )}
          </div>
        </div>

        {sectionError.about && <p className="text-xs text-red-600">{sectionError.about}</p>}
      </div>

      {/* Presence */}
      <div className="border-b border-black px-5 py-4 flex flex-col gap-3">
        <ProfileSectionHeader
          label={SECTION_LABELS.presence}
          editing={editing.presence}
          saving={sectionSaving.presence}
          onEdit={() => setEditing((prev) => ({ ...prev, presence: true }))}
          onSave={() => saveSection('presence')}
          onCancel={() => cancelSection('presence')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Markets</label>
          {editing.presence ? (
            <ChipMultiSelect
              options={MARKET_LIST}
              selected={form.markets}
              onChange={(next) => update('markets', next)}
            />
          ) : (
            <p className="text-sm">{form.markets.length > 0 ? form.markets.join(', ') : '—'}</p>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5 flex-1 min-w-32">
            <label className="text-xs font-medium">Number of data centers</label>
            {editing.presence ? (
              <input
                type="number"
                inputMode="numeric"
                value={form.num_data_centers}
                onChange={(e) => update('num_data_centers', e.target.value)}
                className={fieldClass}
              />
            ) : (
              <p className="text-sm">{form.num_data_centers || '—'}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-32">
            <label className="text-xs font-medium">Total MW capacity</label>
            {editing.presence ? (
              <input
                type="text"
                placeholder="e.g. 450 MW"
                value={form.total_mw_capacity}
                onChange={(e) => update('total_mw_capacity', e.target.value)}
                className={fieldClass}
              />
            ) : (
              <p className="text-sm">{form.total_mw_capacity || '—'}</p>
            )}
          </div>
        </div>

        {sectionError.presence && <p className="text-xs text-red-600">{sectionError.presence}</p>}
      </div>

      {/* Contact & Links */}
      <div className="border-b border-black px-5 py-4 flex flex-col gap-3">
        <ProfileSectionHeader
          label={SECTION_LABELS.contact}
          editing={editing.contact}
          saving={sectionSaving.contact}
          onEdit={() => setEditing((prev) => ({ ...prev, contact: true }))}
          onSave={() => saveSection('contact')}
          onCancel={() => cancelSection('contact')}
        />

        {(
          [
            ['careers_url', 'Careers page URL'],
            ['website_url', 'Company website'],
            ['linkedin_url', 'LinkedIn URL'],
            ['hiring_contact_email', 'Primary hiring contact email'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">{label}</label>
            {editing.contact ? (
              <input
                type="text"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className={fieldClass}
              />
            ) : (
              <p className="text-sm">{form[key] || '—'}</p>
            )}
          </div>
        ))}

        {sectionError.contact && <p className="text-xs text-red-600">{sectionError.contact}</p>}
      </div>

      {/* Hiring */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <ProfileSectionHeader
          label={SECTION_LABELS.hiring}
          editing={editing.hiring}
          saving={sectionSaving.hiring}
          onEdit={() => setEditing((prev) => ({ ...prev, hiring: true }))}
          onSave={() => saveSection('hiring')}
          onCancel={() => cancelSection('hiring')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Categories they hire for</label>
          {editing.hiring ? (
            <ChipMultiSelect
              options={CATEGORY_LIST.map((c) => CATEGORY_LABELS[c])}
              selected={form.hiring_categories.map((c) => CATEGORY_LABELS[c])}
              onChange={(next) =>
                update(
                  'hiring_categories',
                  CATEGORY_LIST.filter((c) => next.includes(CATEGORY_LABELS[c]))
                )
              }
            />
          ) : (
            <p className="text-sm">
              {form.hiring_categories.length > 0
                ? form.hiring_categories.map((c) => CATEGORY_LABELS[c]).join(', ')
                : '—'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Average hires per year</label>
          {editing.hiring ? (
            <input
              type="number"
              inputMode="numeric"
              value={form.avg_hires_per_year}
              onChange={(e) => update('avg_hires_per_year', e.target.value)}
              className={fieldClass + ' max-w-32'}
            />
          ) : (
            <p className="text-sm">{form.avg_hires_per_year || '—'}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Interested in featured listings</label>
          {editing.hiring ? (
            <button
              type="button"
              role="switch"
              aria-checked={form.interested_in_featured}
              onClick={() => update('interested_in_featured', !form.interested_in_featured)}
              className={`self-start border border-black px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none ${
                form.interested_in_featured ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {form.interested_in_featured ? 'On' : 'Off'}
            </button>
          ) : (
            <p className="text-sm">{form.interested_in_featured ? 'Yes' : 'No'}</p>
          )}
          {form.interested_in_featured && (
            <p className="text-xs text-black/50">
              Our team will reach out about featured placement options.
            </p>
          )}
        </div>

        {sectionError.hiring && <p className="text-xs text-red-600">{sectionError.hiring}</p>}
      </div>
    </div>
  )
}
