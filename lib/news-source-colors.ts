// Assign a display color to each news source/topic tag
const SOURCE_COLORS: Record<string, string> = {
  Hyperscale: '#3b82f6',
  'Supply Chain': '#f97316',
  Policy: '#8b5cf6',
  Technology: '#3ecf8e',
  Workforce: '#eab308',
  Development: '#ec4899',
  Industry: '#64748b',
  Corestack: '#000000',
}

export function sourceColor(source: string): string {
  return SOURCE_COLORS[source] ?? '#64748b'
}
