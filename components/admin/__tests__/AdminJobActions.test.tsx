import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminJobActions from '../AdminJobActions'
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

const mockJob: Job = {
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
  status: 'pending',
  paid_amount_cents: 9900,
  paid_at: new Date().toISOString(),
  is_featured: false,
  updated_at: new Date().toISOString(),
}

describe('AdminJobActions', () => {
  beforeEach(() => {
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
  })

  it('renders Approve and Reject buttons, both enabled', () => {
    render(<AdminJobActions job={mockJob} onResolved={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Approve' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeEnabled()
  })

  it('updates status to active and calls onResolved when Approve succeeds', async () => {
    const onResolved = vi.fn()
    render(<AdminJobActions job={mockJob} onResolved={onResolved} />)

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))

    await waitFor(() => expect(onResolved).toHaveBeenCalledWith('job-1'))
    expect(mocks.update).toHaveBeenCalledWith({ status: 'active' })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'job-1')
  })

  it('updates status to closed and calls onResolved when Reject succeeds', async () => {
    const onResolved = vi.fn()
    render(<AdminJobActions job={mockJob} onResolved={onResolved} />)

    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))

    await waitFor(() => expect(onResolved).toHaveBeenCalledWith('job-1'))
    expect(mocks.update).toHaveBeenCalledWith({ status: 'closed' })
  })

  it('disables both buttons while a request is in flight', async () => {
    mocks.eq.mockReturnValue(new Promise(() => {})) // never resolves
    render(<AdminJobActions job={mockJob} onResolved={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(await screen.findByRole('button', { name: 'Approving…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeDisabled()
  })

  it('shows an inline error and does not call onResolved when the update fails', async () => {
    mocks.eq.mockResolvedValue({ error: { message: 'Update failed' } })
    const onResolved = vi.fn()
    render(<AdminJobActions job={mockJob} onResolved={onResolved} />)

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed')
    expect(onResolved).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeEnabled()
  })
})
