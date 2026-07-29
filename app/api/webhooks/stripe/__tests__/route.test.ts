import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../route'

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
}))

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: mocks.constructEvent,
    },
  }),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      update: mocks.update,
    }),
  }),
}))

function makeRequest(body: string, signature: string | null): Request {
  const headers = new Headers()
  if (signature) headers.set('stripe-signature', signature)
  return new Request('https://example.com/api/webhooks/stripe', {
    method: 'POST',
    body,
    headers,
  })
}

describe('POST /api/webhooks/stripe', () => {
  beforeEach(() => {
    mocks.constructEvent.mockReset()
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
  })

  it('returns 400 when the stripe-signature header is missing', async () => {
    const res = await POST(makeRequest('{}', null))
    expect(res.status).toBe(400)
    expect(mocks.constructEvent).not.toHaveBeenCalled()
  })

  it('returns 400 when signature verification fails', async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error('bad signature')
    })
    const res = await POST(makeRequest('{}', 'sig_invalid'))
    expect(res.status).toBe(400)
  })

  it('sets paid_at and paid_amount_cents on checkout.session.completed', async () => {
    mocks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: { job_id: 'job-1' }, amount_total: 9900 } },
    })

    const res = await POST(makeRequest('{}', 'sig_valid'))

    expect(res.status).toBe(200)
    expect(mocks.update).toHaveBeenCalledWith({
      paid_at: expect.any(String),
      paid_amount_cents: 9900,
    })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'job-1')
  })

  it('defaults paid_amount_cents to 0 when amount_total is missing', async () => {
    mocks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: { job_id: 'job-1' } } },
    })

    await POST(makeRequest('{}', 'sig_valid'))

    expect(mocks.update).toHaveBeenCalledWith({
      paid_at: expect.any(String),
      paid_amount_cents: 0,
    })
  })

  it('ignores event types other than checkout.session.completed', async () => {
    mocks.constructEvent.mockReturnValue({
      type: 'payment_intent.created',
      data: { object: {} },
    })

    const res = await POST(makeRequest('{}', 'sig_valid'))

    expect(res.status).toBe(200)
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('returns 500 when the database update fails', async () => {
    mocks.eq.mockResolvedValue({ error: { message: 'db error' } })
    mocks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: { job_id: 'job-1' } } },
    })

    const res = await POST(makeRequest('{}', 'sig_valid'))

    expect(res.status).toBe(500)
  })
})
