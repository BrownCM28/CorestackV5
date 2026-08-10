export const UTM_COOKIE_NAME = 'cs_utm'
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30-day attribution window

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export interface UtmParams {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
}

/**
 * Reads utm_* params off a URL's search params. Returns null if none of
 * the four are present, so callers can skip writing a cookie entirely on
 * ordinary (non-campaign) visits.
 */
export function extractUtmParams(searchParams: URLSearchParams): UtmParams | null {
  const found = UTM_KEYS.some((key) => searchParams.has(key))
  if (!found) return null

  return {
    utm_source: searchParams.get('utm_source'),
    utm_medium: searchParams.get('utm_medium'),
    utm_campaign: searchParams.get('utm_campaign'),
    utm_content: searchParams.get('utm_content'),
  }
}

/** Browser-side read of the cs_utm cookie set by middleware. */
export function getUtmCookie(): UtmParams | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${UTM_COOKIE_NAME}=`))
  if (!match) return null

  try {
    return JSON.parse(decodeURIComponent(match.slice(UTM_COOKIE_NAME.length + 1)))
  } catch {
    return null
  }
}

/** Clears the cs_utm cookie once its data has been attached to a profile. */
export function clearUtmCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${UTM_COOKIE_NAME}=; path=/; max-age=0`
}
