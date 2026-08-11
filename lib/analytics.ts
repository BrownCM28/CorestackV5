import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const SESSION_KEY = 'cs_session'
const SIGNUP_CONVERSION_LABEL = 'AW-18382098333/CcT7CIuCsd8cEJ2for1E'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export async function track(
  eventType: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('events').insert({
    user_id: user?.id ?? null,
    session_id: getSessionId(),
    event_type: eventType,
    metadata: metadata ?? {},
    path: window.location.pathname,
    referrer: document.referrer || null,
  })
}

/** Fires the Google Ads sign-up conversion pixel. Requires the gtag.js
 * loader from the root layout to have already run. */
export function trackSignupConversion() {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'conversion', { send_to: SIGNUP_CONVERSION_LABEL })
}
