import { describe, it, expect, beforeEach, vi } from 'vitest'
import { startJobCheckout } from '../jobs'
import type { CreateJobPayload } from '@/lib/types'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  single: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  createJobCheckoutSession: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  headersGet: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mocks.getUser },
    from: () => ({ insert: mocks.insert }),
  }),
}))

vi.mock('@/lib/stripe', () => ({
  createJobCheckoutSession: mocks.createJobCheckoutSession,
}))

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}))

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}))

vi.mock('next/headers', () => ({
  headers: async () => ({ get: mocks.headersGet }),
}))

const payload: CreateJobPayload = {
  title: 'Data Center Technician',
  company: 'Acme',
  location: 'Ashburn, VA',
  category: 'operations',
  remote: false,
  description: 'Do the thing.',
  salary_min: null,
  salary_max: null,
  apply_target: 'https://example.com/apply',
  paid_amount_cents: 9900,
}

describe('startJobCheckout', () => {
  beforeEach(() => {
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mocks.single.mockReset().mockResolvedValue({ data: { id: 'job-1', ...payload }, error: null })
    mocks.select.mockReset().mockReturnValue({ single: mocks.single })
    mocks.insert.mockReset().mockReturnValue({ select: mocks.select })
    mocks.createJobCheckoutSession.mockReset().mockResolvedValue('https://checkout.stripe.com/session-1')
    mocks.redirect.mockReset().mockImplementation((url: string) => {
      // next/navigation's real redirect() works by throwing -- callers must
      // not swallow it. Mimic that so the test catches any accidental catch.
      throw new Error(`NEXT_REDIRECT:${url}`)
    })
    mocks.revalidatePath.mockReset()
    mocks.headersGet.mockReset().mockImplementation((name: string) =>
      name === 'origin' ? 'https://corestack.example' : null
    )
  })

  it('redirects to the Stripe checkout URL on success, without swallowing the redirect', async () => {
    await expect(startJobCheckout(payload)).rejects.toThrow(
      'NEXT_REDIRECT:https://checkout.stripe.com/session-1'
    )
    expect(mocks.createJobCheckoutSession).toHaveBeenCalledTimes(1)
  })

  it('returns an error object instead of throwing when Stripe fails (e.g. missing API key)', async () => {
    mocks.createJobCheckoutSession.mockRejectedValue(
      new Error('Neither apiKey nor config.authenticator provided')
    )

    const result = await startJobCheckout(payload)

    expect(result).toEqual({ error: 'Neither apiKey nor config.authenticator provided' })
    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it('returns an error object when job creation fails', async () => {
    // Supabase's PostgrestError extends Error (verified in
    // node_modules/@supabase/postgrest-js/src/PostgrestError.ts), so this
    // mock uses a real Error to match what `if (error) throw error` will
    // actually throw in production, not a plain object.
    mocks.single.mockResolvedValue({ data: null, error: new Error('insert failed') })

    const result = await startJobCheckout(payload)

    expect(result).toEqual({ error: 'insert failed' })
    expect(mocks.createJobCheckoutSession).not.toHaveBeenCalled()
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
