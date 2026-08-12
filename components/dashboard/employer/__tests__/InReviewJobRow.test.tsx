import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import InReviewJobRow from '../InReviewJobRow'
import type { Job } from '@/lib/types'

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  eq: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: mocks.update,
    }),
  }),
}))

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: 'job-2',
    slug: null,
    title: 'Fiber Splicing Technician',
    company: 'Lumen',
    location: 'Denver, CO',
    category: 'fiber_networks',
    remote: false,
    description: 'Test job description',
    salary_min: 60000,
    salary_max: 80000,
    apply_target: 'https://lumen.com/apply',
    posted_by: 'user-1',
    created_at: new Date().toISOString(),
    status: 'pending',
    paid_amount_cents: 9900,
    paid_at: new Date().toISOString(),
    is_featured: false,
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('InReviewJobRow', () => {
  beforeEach(() => {
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
  })

  it('shows a pending review badge', () => {
    render(<InReviewJobRow job={makeJob()} onClosed={vi.fn()} />)
    expect(screen.getByText('Pending review')).toBeInTheDocument()
  })

  it('requires confirmation before withdrawing, then calls onClosed', async () => {
    const onClosed = vi.fn()
    render(<InReviewJobRow job={makeJob()} onClosed={onClosed} />)

    fireEvent.click(screen.getByText('Withdraw'))
    expect(screen.getByText('Are you sure you want to withdraw this listing?')).toBeInTheDocument()
    expect(onClosed).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('Yes, withdraw'))

    await waitFor(() => expect(onClosed).toHaveBeenCalledWith('job-2'))
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'closed' })
    )
  })
})
