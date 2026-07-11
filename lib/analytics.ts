import { createClient } from '@/lib/supabase/client'

const SESSION_KEY = 'cs_session'

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
