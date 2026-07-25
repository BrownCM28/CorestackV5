import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '../route'

const mocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  single: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      exchangeCodeForSession: mocks.exchangeCodeForSession,
      getUser: mocks.getUser,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mocks.single,
        }),
      }),
    }),
  }),
}))

function makeRequest(query: string): Request {
  return new Request(`https://example.com/auth/callback${query}`)
}

describe('GET /auth/callback', () => {
  beforeEach(() => {
    mocks.exchangeCodeForSession.mockReset().mockResolvedValue({ error: null })
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mocks.single.mockReset().mockResolvedValue({ data: { onboarding_completed: true } })
  })

  it('redirects to /signin with a specific error when no code is present', async () => {
    const res = await GET(makeRequest(''))
    expect(res.status).toBe(307)
    const location = res.headers.get('location')!
    expect(location).toContain('/signin?error=')
    expect(decodeURIComponent(location.split('error=')[1])).toBe(
      'No confirmation code was provided.'
    )
    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('redirects to /signin with the exchange error message when the code exchange fails', async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({
      error: { message: 'both auth code and code verifier should be non-empty' },
    })
    const res = await GET(makeRequest('?code=bad-code'))
    const location = res.headers.get('location')!
    expect(location).toContain('/signin?error=')
    expect(decodeURIComponent(location.split('error=')[1])).toBe(
      'both auth code and code verifier should be non-empty'
    )
  })

  it('redirects to /onboarding when the profile has not completed onboarding', async () => {
    mocks.single.mockResolvedValue({ data: { onboarding_completed: false } })
    const res = await GET(makeRequest('?code=good-code&next=/dashboard'))
    const location = res.headers.get('location')!
    expect(location).toContain('/onboarding?next=')
    expect(decodeURIComponent(location.split('next=')[1])).toBe('/dashboard')
  })

  it('redirects straight to next when onboarding is already complete', async () => {
    mocks.single.mockResolvedValue({ data: { onboarding_completed: true } })
    const res = await GET(makeRequest('?code=good-code&next=/dashboard'))
    const location = res.headers.get('location')!
    expect(location).toBe('https://example.com/dashboard')
  })

  it('defaults to / when no next param is present', async () => {
    const res = await GET(makeRequest('?code=good-code'))
    expect(res.headers.get('location')).toBe('https://example.com/')
  })

  it('sanitizes an open-redirect next payload back to /', async () => {
    const res = await GET(makeRequest('?code=good-code&next=https://evil.com'))
    expect(res.headers.get('location')).toBe('https://example.com/')
  })
})
