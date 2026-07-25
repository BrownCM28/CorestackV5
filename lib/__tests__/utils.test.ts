import { describe, it, expect } from 'vitest'
import { formatSalary, daysAgo, sanitizeNextPath } from '../utils'

describe('formatSalary', () => {
  it('formats both min and max', () => {
    const result = formatSalary(70000, 90000)
    expect(result).toContain('70,000')
    expect(result).toContain('90,000')
  })

  it('formats min only', () => {
    expect(formatSalary(70000, null)).toContain('70,000')
  })

  it('formats max only', () => {
    expect(formatSalary(null, 90000)).toContain('90,000')
  })

  it('returns fallback for null/null', () => {
    expect(formatSalary(null, null)).toBe('Salary not listed')
  })
})

describe('daysAgo', () => {
  it('returns "Today" for today', () => {
    expect(daysAgo(new Date().toISOString())).toBe('Today')
  })

  it('returns "1 day ago" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    expect(daysAgo(yesterday)).toBe('1 day ago')
  })

  it('returns N days ago for recent dates', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString()
    expect(daysAgo(fiveDaysAgo)).toBe('5 days ago')
  })

  it('returns months ago for older dates', () => {
    const twoMonthsAgo = new Date(Date.now() - 65 * 86400000).toISOString()
    expect(daysAgo(twoMonthsAgo)).toBe('2 months ago')
  })
})

describe('sanitizeNextPath', () => {
  it('returns a plain relative path unchanged', () => {
    expect(sanitizeNextPath('/dashboard/saved')).toBe('/dashboard/saved')
  })

  it('falls back to "/" for null', () => {
    expect(sanitizeNextPath(null)).toBe('/')
  })

  it('falls back to "/" for an empty string', () => {
    expect(sanitizeNextPath('')).toBe('/')
  })

  it('falls back for an absolute URL (open-redirect payload)', () => {
    expect(sanitizeNextPath('https://evil.com')).toBe('/')
  })

  it('falls back for a protocol-relative URL (open-redirect payload)', () => {
    expect(sanitizeNextPath('//evil.com')).toBe('/')
  })

  it('falls back for a path with no leading slash', () => {
    expect(sanitizeNextPath('dashboard')).toBe('/')
  })

  it('uses a custom fallback when provided', () => {
    expect(sanitizeNextPath(null, '/dashboard')).toBe('/dashboard')
    expect(sanitizeNextPath('https://evil.com', '/dashboard')).toBe('/dashboard')
  })
})
