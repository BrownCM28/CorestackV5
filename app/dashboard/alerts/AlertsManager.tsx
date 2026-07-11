'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Alert {
  id: string
  user_id: string
  keywords: string | null
  location: string | null
  category: string | null
  frequency: string
  active: boolean
  created_at: string
}

interface Props {
  userId: string
  initialAlerts: Alert[]
}

const CATEGORY_LABELS: Record<string, string> = {
  operations: 'Operations',
  construction: 'Construction',
  electrical_power: 'Electrical / Power',
  cooling_mechanical: 'Cooling / Mechanical',
  networking: 'Networking',
}

export default function AlertsManager({ userId, initialAlerts }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [frequency, setFrequency] = useState<'weekly' | 'daily'>('weekly')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!keywords.trim() && !location.trim() && !category) {
      setFormError('Please enter at least one search criteria.')
      return
    }

    setCreating(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('job_alerts')
      .insert({
        user_id: userId,
        keywords: keywords.trim() || null,
        location: location.trim() || null,
        category: category || null,
        frequency,
        active: true,
      })
      .select()
      .single()

    if (error) {
      setFormError(error.message)
      setCreating(false)
      return
    }

    setAlerts((prev) => [data as Alert, ...prev])
    setKeywords('')
    setLocation('')
    setCategory('')
    setFrequency('weekly')
    setCreating(false)
  }

  async function handleToggleActive(alert: Alert) {
    const nextActive = !alert.active
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, active: nextActive } : a))
    )
    const supabase = createClient()
    const { error } = await supabase
      .from('job_alerts')
      .update({ active: nextActive })
      .eq('id', alert.id)
    if (error) {
      // revert
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, active: alert.active } : a))
      )
    }
  }

  async function handleDelete(alertId: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    const supabase = createClient()
    const { error } = await supabase
      .from('job_alerts')
      .delete()
      .eq('id', alertId)
    if (error) {
      // revert — re-fetch would be ideal but for now just log
      console.error('Failed to delete alert:', error.message)
    }
  }

  const inputCls =
    'border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40 bg-white'

  return (
    <div className="max-w-lg">
      {/* ── Create form ──────────────────────────────────────────────── */}
      <form onSubmit={handleCreate} className="flex flex-col gap-4 mb-10" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="alert-keywords" className="text-sm font-medium">
            Keywords
          </label>
          <input
            id="alert-keywords"
            type="text"
            placeholder="e.g. commissioning engineer"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="alert-location" className="text-sm font-medium">
            Location
          </label>
          <input
            id="alert-location"
            type="text"
            placeholder="e.g. Ashburn, VA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="alert-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="alert-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="">All categories</option>
              <option value="operations">Operations</option>
              <option value="construction">Construction</option>
              <option value="electrical_power">Electrical / Power</option>
              <option value="cooling_mechanical">Cooling / Mechanical</option>
              <option value="networking">Networking</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="alert-frequency" className="text-sm font-medium">
              Frequency
            </label>
            <select
              id="alert-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'weekly' | 'daily')}
              className={inputCls}
            >
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        {formError && (
          <p role="alert" aria-live="polite" className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={creating}
          className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none w-fit"
        >
          {creating ? 'Creating…' : 'Create alert'}
        </button>
      </form>

      {/* ── Alert list ───────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
          Your Alerts
        </p>
        {alerts.length === 0 ? (
          <p className="text-sm text-black/50 border border-black/15 px-5 py-6">
            No alerts yet. Create one above to get notified when matching jobs are posted.
          </p>
        ) : (
          <ul role="list" className="border-l border-t border-black">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="border-r border-b border-black bg-white/75 backdrop-blur-sm px-5 py-4 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {alert.keywords && (
                      <span className="text-sm font-medium truncate">{alert.keywords}</span>
                    )}
                    {alert.location && (
                      <span className="text-sm text-black/50 truncate">{alert.location}</span>
                    )}
                    {!alert.keywords && !alert.location && !alert.category && (
                      <span className="text-sm font-medium">All jobs</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {alert.category && (
                      <span className="text-[10px] border border-black/15 px-2 py-0.5">
                        {CATEGORY_LABELS[alert.category] ?? alert.category}
                      </span>
                    )}
                    <span className="text-[10px] border border-black/15 px-2 py-0.5 capitalize">
                      {alert.frequency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(alert)}
                    className={`text-[11px] font-medium px-2.5 py-1 border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none ${
                      alert.active
                        ? 'border-[#3ecf8e] text-[#3ecf8e] hover:bg-[#3ecf8e] hover:text-black'
                        : 'border-black/30 text-black/40 hover:border-black hover:text-black'
                    }`}
                    aria-label={alert.active ? 'Pause alert' : 'Activate alert'}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="flex items-center justify-center w-7 h-7 border border-black/20 text-black/40 transition-colors hover:border-red-400 hover:text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                    aria-label="Delete alert"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
