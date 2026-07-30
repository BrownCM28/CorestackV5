import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import JobListingsCard from '../JobListingsCard'
import type { Job } from '@/lib/types'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    }),
  }),
}))

function makeJob(id: string, title: string, status: Job['status']): Job {
  return {
    id,
    title,
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
    status,
    paid_amount_cents: 9900,
    paid_at: new Date().toISOString(),
    is_featured: false,
    updated_at: new Date().toISOString(),
  }
}

describe('JobListingsCard', () => {
  it('shows correct counts for each section', () => {
    render(
      <JobListingsCard
        activeJobs={[makeJob('1', 'Active Role', 'active')]}
        inReviewJobs={[makeJob('2', 'Pending Role A', 'pending'), makeJob('3', 'Pending Role B', 'pending')]}
        closedJobs={[]}
        viewCounts={{}}
      />
    )

    expect(screen.getByRole('button', { name: 'Active (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'In Review (2)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Closed (0)' })).toBeInTheDocument()
  })

  it('shows Active section open and In Review/Closed collapsed by default', () => {
    render(
      <JobListingsCard
        activeJobs={[makeJob('1', 'Active Role', 'active')]}
        inReviewJobs={[makeJob('2', 'Pending Role', 'pending')]}
        closedJobs={[makeJob('3', 'Closed Role', 'closed')]}
        viewCounts={{}}
      />
    )

    expect(screen.getByText('Active Role')).toBeInTheDocument()
    expect(screen.queryByText('Pending Role')).not.toBeInTheDocument()
    expect(screen.queryByText('Closed Role')).not.toBeInTheDocument()
  })

  it('expands a collapsed section on click', () => {
    render(
      <JobListingsCard
        activeJobs={[]}
        inReviewJobs={[makeJob('2', 'Pending Role', 'pending')]}
        closedJobs={[]}
        viewCounts={{}}
      />
    )

    expect(screen.queryByText('Pending Role')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'In Review (1)' }))
    expect(screen.getByText('Pending Role')).toBeInTheDocument()
  })

  it('shows the empty state message when a section has no jobs', () => {
    render(<JobListingsCard activeJobs={[]} inReviewJobs={[]} closedJobs={[]} viewCounts={{}} />)
    expect(screen.getByText('No active listings — post your first job.')).toBeInTheDocument()
  })

  it('links the Post a Job button to /post', () => {
    render(<JobListingsCard activeJobs={[]} inReviewJobs={[]} closedJobs={[]} viewCounts={{}} />)
    expect(screen.getByText('Post a Job').closest('a')).toHaveAttribute('href', '/post')
  })
})
