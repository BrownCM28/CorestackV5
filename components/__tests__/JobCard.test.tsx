import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import JobCard from '../jobs/JobCard'
import type { Job } from '@/lib/types'

const mockJob: Job = {
  id: 'test-id-123',
  title: 'Data Center Technician',
  company: 'Equinix',
  location: 'Ashburn, VA',
  category: 'operations',
  remote: false,
  description: 'Test job description',
  salary_min: 55000,
  salary_max: 75000,
  apply_target: 'https://equinix.com/apply',
  posted_by: null,
  created_at: new Date().toISOString(),
  status: 'active',
  paid_amount_cents: 9900,
  paid_at: new Date().toISOString(),
}

describe('JobCard', () => {
  it('renders job title', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText('Data Center Technician')).toBeInTheDocument()
  })

  it('renders company and location', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText(/Equinix/)).toBeInTheDocument()
    expect(screen.getByText(/Ashburn, VA/)).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText('Operations')).toBeInTheDocument()
  })

  it('renders salary range', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText(/55,000/)).toBeInTheDocument()
  })

  it('does not render Remote badge when not remote', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.queryByText('Remote')).not.toBeInTheDocument()
  })

  it('renders Remote badge when remote is true', () => {
    render(<JobCard job={{ ...mockJob, remote: true }} />)
    expect(screen.getByText('Remote')).toBeInTheDocument()
  })

  it('links to the job detail page', () => {
    render(<JobCard job={mockJob} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/jobs/test-id-123')
  })

  it('renders as a non-navigable div instead of a link in preview mode', () => {
    render(<JobCard job={mockJob} preview />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Data Center Technician')).toBeInTheDocument()
  })
})
