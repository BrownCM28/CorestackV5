import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthGate from '../AuthGate'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
  applyToJob: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mocks.getUser },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: mocks.maybeSingle,
          }),
        }),
      }),
    }),
  }),
}))

vi.mock('@/app/actions/applications', () => ({
  applyToJob: mocks.applyToJob,
}))

const USER = { id: 'user-1', email: 'test@example.com' }

describe('AuthGate', () => {
  beforeEach(() => {
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: USER } })
    mocks.maybeSingle.mockReset().mockResolvedValue({ data: null })
    mocks.applyToJob.mockReset()
  })

  it('shows the already-applied state on load when a prior application exists, without calling applyToJob', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { id: 'app-1', job: { apply_target: 'https://example.com/careers/123' } },
    })

    render(<AuthGate jobId="job-1" />)

    expect(await screen.findByText("You've already applied to this job.")).toBeInTheDocument()
    expect(screen.getByText('View the listing again →').closest('a')).toHaveAttribute(
      'href',
      'https://example.com/careers/123'
    )
    expect(mocks.applyToJob).not.toHaveBeenCalled()
  })

  it('shows the fresh-apply confirmation after clicking Apply', async () => {
    mocks.applyToJob.mockResolvedValue({ apply_target: 'https://example.com/careers/123' })
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<AuthGate jobId="job-1" />)

    const button = await screen.findByRole('button', { name: 'Apply for This Job' })
    button.click()

    expect(
      await screen.findByText(
        "Application recorded — the employer's application page has opened in a new tab."
      )
    ).toBeInTheDocument()
    expect(openSpy).toHaveBeenCalledWith(
      'https://example.com/careers/123',
      '_blank',
      'noopener,noreferrer'
    )

    openSpy.mockRestore()
  })

  it('does not crash and falls back to guest when getUser rejects', async () => {
    mocks.getUser.mockRejectedValue(new Error('network error'))

    render(<AuthGate jobId="job-1" />)

    const button = await screen.findByRole('button', { name: 'Apply for This Job' })
    expect(button).not.toBeDisabled()
  })
})
