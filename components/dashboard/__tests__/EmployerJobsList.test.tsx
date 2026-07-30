import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmployerJobsList from '../EmployerJobsList'
import type { Job } from '@/lib/types'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    }),
  }),
}))

vi.mock('@/app/actions/jobs', () => ({
  resumeJobCheckout: vi.fn(),
}))

function makeJob(
  id: string,
  title: string,
  status: Job['status'],
  paidAt: string | null = new Date().toISOString()
): Job {
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
    paid_at: paidAt,
  }
}

describe('EmployerJobsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('groups active, pending, and closed jobs into separate labeled sections', () => {
    const jobs = [
      makeJob('1', 'Active Role', 'active'),
      makeJob('2', 'Pending Role', 'pending'),
      makeJob('3', 'Closed Role', 'closed'),
    ]
    render(<EmployerJobsList jobs={jobs} />)

    expect(screen.getByText('Active (1)')).toBeInTheDocument()
    expect(screen.getByText('In Progress (1)')).toBeInTheDocument()
    expect(screen.getByText('Closed (1)')).toBeInTheDocument()
    expect(screen.getByText('Active Role')).toBeInTheDocument()
    expect(screen.getByText('Pending Role')).toBeInTheDocument()
    expect(screen.getByText('Closed Role')).toBeInTheDocument()
  })

  it('groups an unpaid job under In Progress even though its status is pending', () => {
    const jobs = [makeJob('1', 'Unpaid Role', 'pending', null)]
    render(<EmployerJobsList jobs={jobs} />)

    expect(screen.getByText('In Progress (1)')).toBeInTheDocument()
    expect(screen.queryByText('Active (1)')).not.toBeInTheDocument()
    expect(screen.queryByText('Closed (1)')).not.toBeInTheDocument()
  })

  it('omits empty section headings entirely', () => {
    const jobs = [makeJob('1', 'Active Role', 'active')]
    render(<EmployerJobsList jobs={jobs} />)

    expect(screen.getByText('Active (1)')).toBeInTheDocument()
    expect(screen.queryByText(/In Progress/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Closed/)).not.toBeInTheDocument()
  })
})
