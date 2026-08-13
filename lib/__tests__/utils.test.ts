import { describe, it, expect } from 'vitest'
import { formatSalary, daysAgo, sanitizeNextPath, generateSlug, isUuid, generateCompanySlug } from '../utils'

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

  it('appends /hr for an hourly exact rate', () => {
    expect(formatSalary(36, 36, true)).toBe('$36/hr')
  })

  it('appends /hr for an hourly range', () => {
    const result = formatSalary(26, 36, true)
    expect(result).toBe('$26 – $36/hr')
  })

  it('does not append /hr when hourly is false or omitted', () => {
    expect(formatSalary(70000, 90000, false)).not.toContain('/hr')
    expect(formatSalary(70000, 90000)).not.toContain('/hr')
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

describe('generateSlug', () => {
  it('builds a lowercase, hyphenated slug suffixed with the id prefix', () => {
    expect(generateSlug('Commissioning Engineer', 'Schweitzer Engineering', 'c8a79313-e970-4bb3-8674-48d1e406eae9')).toBe(
      'commissioning-engineer-schweitzer-engineering-c8a79313'
    )
  })

  it('strips punctuation instead of turning it into stray hyphens', () => {
    expect(generateSlug('24/7 Ops Tech!', 'Acme, Inc.', '12345678-0000-0000-0000-000000000000')).toBe(
      '247-ops-tech-acme-inc-12345678'
    )
  })

  it('collapses whitespace runs into a single hyphen', () => {
    expect(generateSlug('Data   Center   Tech', 'Equinix', '12345678-0000-0000-0000-000000000000')).toBe(
      'data-center-tech-equinix-12345678'
    )
  })

  it('truncates a long base before appending the id suffix', () => {
    const slug = generateSlug(
      'A'.repeat(100),
      'Some Company',
      '12345678-0000-0000-0000-000000000000'
    )
    expect(slug.endsWith('-12345678')).toBe(true)
    expect(slug.length).toBeLessThanOrEqual(70 + '-12345678'.length)
  })
})

describe('isUuid', () => {
  it('accepts a canonical UUID', () => {
    expect(isUuid('c8a79313-e970-4bb3-8674-48d1e406eae9')).toBe(true)
  })

  it('rejects a slug', () => {
    expect(isUuid('commissioning-engineer-schweitzer-c8a79313')).toBe(false)
  })

  it('rejects a UUID-length string with the wrong hyphen placement', () => {
    expect(isUuid('c8a79313e970-4bb3-8674-48d1e406eae9-x')).toBe(false)
  })
})

describe('generateCompanySlug', () => {
  it('lowercases and hyphenates a company name', () => {
    expect(generateCompanySlug('Vantage Data Centers')).toBe('vantage-data-centers')
  })

  it('strips punctuation', () => {
    expect(generateCompanySlug('AT&T, Inc.')).toBe('att-inc')
  })

  it('produces the same slug regardless of casing or extra whitespace', () => {
    // Same normalization must apply whether the name comes from jobs.company
    // or a claimed company_profiles.company_name, so the two can match even
    // if an employer typed their own name slightly differently.
    expect(generateCompanySlug('VANTAGE DATA CENTERS')).toBe(
      generateCompanySlug('  Vantage   Data    Centers  ')
    )
  })

  it('has no id suffix, unlike generateSlug', () => {
    expect(generateCompanySlug('Equinix')).toBe('equinix')
  })
})
