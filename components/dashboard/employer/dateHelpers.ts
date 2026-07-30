export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export function daysRemaining(createdAt: string): number {
  const expiresAt = new Date(createdAt).getTime() + THIRTY_DAYS_MS
  return Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000))
}
