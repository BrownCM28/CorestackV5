import { describe, it, expect, beforeEach } from 'vitest'
import { extractUtmParams, getUtmCookie, clearUtmCookie, UTM_COOKIE_NAME } from '../utm'

describe('extractUtmParams', () => {
  it('returns null when no utm params are present', () => {
    expect(extractUtmParams(new URLSearchParams('foo=bar'))).toBeNull()
  })

  it('extracts all four params when present', () => {
    const params = new URLSearchParams(
      'utm_source=linkedin&utm_medium=cold_outreach&utm_campaign=q3_launch&utm_content=variant_a'
    )
    expect(extractUtmParams(params)).toEqual({
      utm_source: 'linkedin',
      utm_medium: 'cold_outreach',
      utm_campaign: 'q3_launch',
      utm_content: 'variant_a',
    })
  })

  it('fills missing params with null while others are present', () => {
    const params = new URLSearchParams('utm_source=linkedin')
    expect(extractUtmParams(params)).toEqual({
      utm_source: 'linkedin',
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
    })
  })
})

describe('getUtmCookie / clearUtmCookie', () => {
  beforeEach(() => {
    document.cookie = `${UTM_COOKIE_NAME}=; path=/; max-age=0`
  })

  it('returns null when no cookie is set', () => {
    expect(getUtmCookie()).toBeNull()
  })

  it('reads back a JSON-encoded cookie', () => {
    const value = {
      utm_source: 'linkedin',
      utm_medium: 'cold_outreach',
      utm_campaign: 'q3_launch',
      utm_content: null,
    }
    document.cookie = `${UTM_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; path=/`

    expect(getUtmCookie()).toEqual(value)
  })

  it('clears the cookie', () => {
    document.cookie = `${UTM_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ utm_source: 'x' }))}; path=/`
    clearUtmCookie()
    expect(getUtmCookie()).toBeNull()
  })

  it('returns null for a malformed cookie instead of throwing', () => {
    document.cookie = `${UTM_COOKIE_NAME}=not-json; path=/`
    expect(getUtmCookie()).toBeNull()
  })
})
