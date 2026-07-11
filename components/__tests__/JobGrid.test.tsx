import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import JobGrid from '../jobs/JobGrid'
import type { Job } from '@/lib/types'

const makeJob = (id: string, title: string): Job => ({
  id,
  title,
  company: 'Test Co',
  location: 'Dallas, TX',
  category: 'networking',
  remote: false,
  description: 'desc',
  salary_min: null,
  salary_max: null,
  apply_target: 'https://example.com',
  posted_by: null,
  created_at: new Date().toISOString(),
  status: 'active',
  paid_amount_cents: 9900,
})

describe('JobGrid', () => {
  it('renders all job cards', () => {
    const jobs = [makeJob('1', 'Job A'), makeJob('2', 'Job B'), makeJob('3', 'Job C')]
    render(<JobGrid jobs={jobs} />)
    expect(screen.getByText('Job A')).toBeInTheDocument()
    expect(screen.getByText('Job B')).toBeInTheDocument()
    expect(screen.getByText('Job C')).toBeInTheDocument()
  })

  it('shows empty state when no jobs', () => {
    render(<JobGrid jobs={[]} />)
    expect(screen.getByText(/No jobs found/i)).toBeInTheDocument()
  })
})
