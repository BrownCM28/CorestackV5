import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployerJobActions from '../EmployerJobActions'
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

function makeJob(status: Job['status']): Job {
  return {
    id: 'job-1',
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
    status,
    paid_amount_cents: 9900,
  }
}

describe('EmployerJobActions', () => {
  beforeEach(() => {
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
  })

  it('renders an Edit link pointing at the edit route', () => {
    render(<EmployerJobActions job={makeJob('pending')} onClosed={vi.fn()} />)
    const link = screen.getByRole('link', { name: 'Edit' })
    expect(link).toHaveAttribute('href', '/dashboard/employer/job-1/edit')
  })

  it('renders an enabled Close button for a pending job', () => {
    render(<EmployerJobActions job={makeJob('pending')} onClosed={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled()
  })

  it('renders an enabled Close button for an active job', () => {
    render(<EmployerJobActions job={makeJob('active')} onClosed={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled()
  })

  it('does not render a Close button for an already-closed job', () => {
    render(<EmployerJobActions job={makeJob('closed')} onClosed={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('updates status to closed and calls onClosed when Close succeeds', async () => {
    const onClosed = vi.fn()
    render(<EmployerJobActions job={makeJob('active')} onClosed={onClosed} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() => expect(onClosed).toHaveBeenCalledWith('job-1'))
    expect(mocks.update).toHaveBeenCalledWith({ status: 'closed' })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'job-1')
  })

  it('disables the Close button while the request is in flight', async () => {
    mocks.eq.mockReturnValue(new Promise(() => {})) // never resolves
    render(<EmployerJobActions job={makeJob('active')} onClosed={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(await screen.findByRole('button', { name: 'Closing…' })).toBeDisabled()
  })

  it('shows an inline error and does not call onClosed when the update fails', async () => {
    mocks.eq.mockResolvedValue({ error: { message: 'Update failed' } })
    const onClosed = vi.fn()
    render(<EmployerJobActions job={makeJob('active')} onClosed={onClosed} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed')
    expect(onClosed).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled()
  })
})
