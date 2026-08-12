import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ActiveJobRow from '../ActiveJobRow'
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
    id: 'job-1',
    slug: null,
    title: 'Data Center Technician',
    company: 'Equinix',
    location: 'Ashburn, VA',
    category: 'operations',
    remote: false,
    description: 'Test job description',
    salary_min: 55000,
    salary_max: 75000,
    apply_target: 'https://equinix.com/apply',
    posted_by: 'user-1',
    created_at: new Date().toISOString(),
    status: 'active',
    paid_amount_cents: 9900,
    paid_at: new Date().toISOString(),
    is_featured: false,
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('ActiveJobRow', () => {
  beforeEach(() => {
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
  })

  it('shows the Feature button when the job is not featured', () => {
    render(<ActiveJobRow job={makeJob({ is_featured: false })} viewCount={null} onClosed={vi.fn()} />)
    expect(screen.getByText('Feature')).toBeInTheDocument()
  })

  it('hides the Feature button when the job is already featured', () => {
    render(<ActiveJobRow job={makeJob({ is_featured: true })} viewCount={null} onClosed={vi.fn()} />)
    expect(screen.queryByText('Feature')).not.toBeInTheDocument()
  })

  it('shows a Renew button when 5 or fewer days remain', () => {
    const created = new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString()
    render(<ActiveJobRow job={makeJob({ created_at: created })} viewCount={null} onClosed={vi.fn()} />)
    expect(screen.getByText(/Renew — \$299/)).toBeInTheDocument()
  })

  it('hides the Renew button when more than 5 days remain', () => {
    render(<ActiveJobRow job={makeJob()} viewCount={null} onClosed={vi.fn()} />)
    expect(screen.queryByText(/Renew — \$299/)).not.toBeInTheDocument()
  })

  it('shows "— views" when the view count is null', () => {
    render(<ActiveJobRow job={makeJob()} viewCount={null} onClosed={vi.fn()} />)
    expect(screen.getByText(/— views/)).toBeInTheDocument()
  })

  it('shows the view count when available', () => {
    render(<ActiveJobRow job={makeJob()} viewCount={42} onClosed={vi.fn()} />)
    expect(screen.getByText(/42 views/)).toBeInTheDocument()
  })

  it('requires confirmation before closing, then calls onClosed', async () => {
    const onClosed = vi.fn()
    render(<ActiveJobRow job={makeJob()} viewCount={null} onClosed={onClosed} />)

    fireEvent.click(screen.getByText('Close'))
    expect(screen.getByText('Are you sure you want to close this listing?')).toBeInTheDocument()
    expect(onClosed).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('Yes, close it'))

    await waitFor(() => expect(onClosed).toHaveBeenCalledWith('job-1'))
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'closed' })
    )
  })
})
