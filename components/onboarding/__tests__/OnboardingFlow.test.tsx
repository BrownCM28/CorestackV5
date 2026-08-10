import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OnboardingFlow from '../OnboardingFlow'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  searchParams: new URLSearchParams(),
  getUtmCookie: vi.fn(),
  clearUtmCookie: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => mocks.searchParams,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: mocks.update,
    }),
  }),
}))

vi.mock('@/lib/utm', () => ({
  getUtmCookie: mocks.getUtmCookie,
  clearUtmCookie: mocks.clearUtmCookie,
}))

function selectJobSeekerThroughStep2() {
  fireEvent.click(screen.getByRole('button', { name: "I'm looking for work" }))
  fireEvent.click(screen.getByRole('button', { name: 'Operations' }))
  fireEvent.click(screen.getByRole('button', { name: 'Remote' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('OnboardingFlow', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.eq.mockReset().mockResolvedValue({ error: null })
    mocks.update.mockReset().mockReturnValue({ eq: mocks.eq })
    mocks.getUtmCookie.mockReset().mockReturnValue(null)
    mocks.clearUtmCookie.mockReset()
    mocks.searchParams = new URLSearchParams()
  })

  it('shows step 1 of 3 with two selectable cards', () => {
    render(<OnboardingFlow userId="user-1" />)
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "I'm looking for work" })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "I'm hiring" })).toBeInTheDocument()
  })

  it('advances to step 2 automatically after selecting a user type', () => {
    render(<OnboardingFlow userId="user-1" />)
    fireEvent.click(screen.getByRole('button', { name: "I'm looking for work" }))
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByText('What are you looking for?')).toBeInTheDocument()
  })

  it('keeps Continue disabled on the job_seeker step until a category and a market are picked', () => {
    render(<OnboardingFlow userId="user-1" />)
    fireEvent.click(screen.getByRole('button', { name: "I'm looking for work" }))

    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Operations' }))
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Remote' }))
    expect(continueButton).toBeEnabled()
  })

  it('shows company name + category chips for the employer path', () => {
    render(<OnboardingFlow userId="user-1" />)
    fireEvent.click(screen.getByRole('button', { name: "I'm hiring" }))

    expect(screen.getByText('Tell us about your company')).toBeInTheDocument()
    expect(screen.getByLabelText('Company name')).toBeInTheDocument()

    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Company name'), {
      target: { value: 'Acme Data Centers' },
    })
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Networking' }))
    expect(continueButton).toBeEnabled()
  })

  it('shows employer-specific urgency labels on step 3 for the employer path', () => {
    render(<OnboardingFlow userId="user-1" />)
    fireEvent.click(screen.getByRole('button', { name: "I'm hiring" }))
    fireEvent.change(screen.getByLabelText('Company name'), {
      target: { value: 'Acme Data Centers' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Networking' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('How urgently are you hiring?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hiring now' })).toBeInTheDocument()
  })

  it('shows seeker-specific urgency labels on step 3 for the job_seeker path', () => {
    render(<OnboardingFlow userId="user-1" />)
    fireEvent.click(screen.getByRole('button', { name: "I'm looking for work" }))
    fireEvent.click(screen.getByRole('button', { name: 'Operations' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remote' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('How urgently are you looking?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actively applying' })).toBeInTheDocument()
  })

  it('keeps the final Continue disabled until urgency and referral source are both picked', () => {
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()

    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    expect(continueButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    expect(continueButton).toBeEnabled()
  })

  it('writes the full profile update and redirects to / by default on completion', async () => {
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()
    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))

    expect(mocks.update).toHaveBeenCalledWith({
      user_type: 'job_seeker',
      interested_categories: ['operations'],
      preferred_markets: ['Remote'],
      company_name: null,
      search_urgency: 'active',
      referral_source: 'linkedin',
      onboarding_completed: true,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      updated_at: expect.any(String),
    })
    expect(mocks.eq).toHaveBeenCalledWith('id', 'user-1')
  })

  it('attaches captured UTM data to the profile update and clears the cookie on completion', async () => {
    mocks.getUtmCookie.mockReturnValue({
      utm_source: 'linkedin',
      utm_medium: 'cold_outreach',
      utm_campaign: 'q3_launch',
      utm_content: null,
    })
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()
    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))

    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        utm_source: 'linkedin',
        utm_medium: 'cold_outreach',
        utm_campaign: 'q3_launch',
        utm_content: null,
      })
    )
    expect(mocks.clearUtmCookie).toHaveBeenCalled()
  })

  it('redirects to a sanitized next param instead of / when present', async () => {
    mocks.searchParams = new URLSearchParams('next=/dashboard/saved')
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()
    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard/saved'))
  })

  it('falls back to / when next is an open-redirect payload', async () => {
    mocks.searchParams = new URLSearchParams('next=https://evil.com')
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()
    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))
  })

  it('shows an inline error and re-enables Continue when the update fails', async () => {
    mocks.eq.mockResolvedValue({ error: { message: 'Update failed' } })
    render(<OnboardingFlow userId="user-1" />)
    selectJobSeekerThroughStep2()
    fireEvent.click(screen.getByRole('button', { name: 'Actively applying' }))
    fireEvent.click(screen.getByRole('button', { name: 'LinkedIn' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    expect(mocks.push).not.toHaveBeenCalled()
  })
})
