import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import JobCard from '../jobs/JobCard'
import type { Job } from '@/lib/types'

const mockJob: Job = {
  id: 'test-id-123',
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
  posted_by: null,
  created_at: new Date().toISOString(),
  status: 'active',
  paid_amount_cents: 9900,
  paid_at: new Date().toISOString(),
  is_featured: false,
  updated_at: new Date().toISOString(),
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

  it('links to the job detail page by id when there is no slug', () => {
    render(<JobCard job={mockJob} />)
    const link = screen.getByRole('link', { name: 'Data Center Technician at Equinix' })
    expect(link).toHaveAttribute('href', '/jobs/test-id-123')
  })

  it('prefers the slug over the id when one is set', () => {
    render(<JobCard job={{ ...mockJob, slug: 'data-center-technician-equinix-test-id' }} />)
    const link = screen.getByRole('link', { name: 'Data Center Technician at Equinix' })
    expect(link).toHaveAttribute('href', '/jobs/data-center-technician-equinix-test-id')
  })

  it('links the company logo to the company page, separately from the job link', () => {
    render(<JobCard job={mockJob} />)
    const companyLink = screen.getByRole('link', { name: "View Equinix's company page" })
    expect(companyLink).toHaveAttribute('href', '/companies/equinix')
  })

  it('renders as a non-navigable div instead of a link in preview mode', () => {
    render(<JobCard job={mockJob} preview />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Data Center Technician')).toBeInTheDocument()
  })

  it('renders the company logo by default', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByAltText('Equinix logo')).toBeInTheDocument()
  })

  it('hides the company logo when hideLogo is set', () => {
    render(<JobCard job={mockJob} hideLogo />)
    expect(screen.queryByAltText('Equinix logo')).not.toBeInTheDocument()
    expect(screen.getByText('Data Center Technician')).toBeInTheDocument()
  })
})
