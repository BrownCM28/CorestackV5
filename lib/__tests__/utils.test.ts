import { describe, it, expect } from 'vitest'
import { formatSalary, daysAgo } from '../utils'

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
