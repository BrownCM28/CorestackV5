import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplySheet from '../jobs/ApplySheet'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
  applyToJob: vi.fn(),
  submitApplicationLead: vi.fn(),
  authStateCallback: null as
    | ((event: string, session: { user: typeof USER } | null) => void)
    | null,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mocks.getUser,
      onAuthStateChange: (
        cb: (event: string, session: { user: typeof USER } | null) => void
      ) => {
        mocks.authStateCallback = cb
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
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

vi.mock('@/app/actions/applicationLeads', () => ({
  submitApplicationLead: mocks.submitApplicationLead,
}))

const USER = { id: 'user-1', email: 'test@example.com' }
const APPLY_TARGET = 'https://example.com/careers/123'

function clearLeadFlag() {
  try {
    localStorage.removeItem('cs_lead_submitted')
  } catch {
    // ignore
  }
}

describe('ApplySheet', () => {
  beforeEach(() => {
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: null } })
    mocks.maybeSingle.mockReset().mockResolvedValue({ data: null })
    mocks.applyToJob.mockReset().mockResolvedValue({ apply_target: APPLY_TARGET })
    mocks.submitApplicationLead.mockReset().mockResolvedValue(undefined)
    clearLeadFlag()
  })

  it('always renders a real <a href> to the apply target, even before auth resolves', () => {
    mocks.getUser.mockReturnValue(new Promise(() => {})) // never resolves
    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)
    expect(screen.getByRole('link', { name: 'Apply for This Job' })).toHaveAttribute(
      'href',
      APPLY_TARGET
    )
  })

  it('shows the lead-capture sheet for a guest instead of navigating immediately', async () => {
    const user = userEvent.setup()
    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    const link = await screen.findByRole('link', { name: 'Apply for This Job' })
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled())
    await user.click(link)

    expect(await screen.findByText('Quick details before you go')).toBeInTheDocument()
  })

  it('submits the lead, records the flag, and opens the apply target in a new tab', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    const link = await screen.findByRole('link', { name: 'Apply for This Job' })
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled())
    await user.click(link)

    await user.type(screen.getByPlaceholderText('First name'), 'Jane')
    await user.type(screen.getByPlaceholderText('Last name'), 'Doe')
    await user.type(screen.getByPlaceholderText('Email address'), 'jane@example.com')
    await user.click(screen.getByRole('button', { name: 'Continue to Application' }))

    await waitFor(() =>
      expect(mocks.submitApplicationLead).toHaveBeenCalledWith({
        jobId: 'job-1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      })
    )
    expect(openSpy).toHaveBeenCalledWith(APPLY_TARGET, '_blank', 'noopener,noreferrer')
    expect(localStorage.getItem('cs_lead_submitted')).toBe('1')
    expect(screen.queryByText('Quick details before you go')).not.toBeInTheDocument()

    openSpy.mockRestore()
  })

  it('lets a guest skip the sheet without submitting anything, and still opens the target', async () => {
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    const link = await screen.findByRole('link', { name: 'Apply for This Job' })
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled())
    await user.click(link)
    await screen.findByText('Quick details before you go')

    await user.click(screen.getByRole('button', { name: 'No thanks, take me there' }))

    expect(mocks.submitApplicationLead).not.toHaveBeenCalled()
    expect(openSpy).toHaveBeenCalledWith(APPLY_TARGET, '_blank', 'noopener,noreferrer')
    expect(screen.queryByText('Quick details before you go')).not.toBeInTheDocument()

    openSpy.mockRestore()
  })

  it('does not show the sheet again this session once a lead was already submitted, letting the native link navigate', async () => {
    try {
      localStorage.setItem('cs_lead_submitted', '1')
    } catch {
      // ignore
    }
    const user = userEvent.setup()

    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    const link = await screen.findByRole('link', { name: 'Apply for This Job' })
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled())
    await user.click(link)

    // No sheet -- the click was never intercepted (preventDefault not
    // called), so the browser's native <a target="_blank"> handles the
    // navigation itself. That's exactly why there's nothing to assert
    // against window.open here (unlike the submit/skip paths, which call
    // it explicitly): jsdom doesn't simulate real anchor navigation, so
    // the absence of the sheet is the meaningful, observable outcome.
    expect(screen.queryByText('Quick details before you go')).not.toBeInTheDocument()
  })

  it('signed-in users skip the sheet entirely and get an application recorded in the background', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: USER } })
    const user = userEvent.setup()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    const link = await screen.findByRole('link', { name: 'Apply for This Job' })
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled())
    await user.click(link)

    expect(screen.queryByText('Quick details before you go')).not.toBeInTheDocument()
    await waitFor(() => expect(mocks.applyToJob).toHaveBeenCalledWith('job-1'))

    openSpy.mockRestore()
  })

  it('shows the already-applied label for a signed-in user with a prior application', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: USER } })
    mocks.maybeSingle.mockResolvedValue({ data: { id: 'app-1' } })

    render(<ApplySheet jobId="job-1" applyTarget={APPLY_TARGET} />)

    expect(
      await screen.findByRole('link', { name: 'Already Applied — View Listing' })
    ).toHaveAttribute('href', APPLY_TARGET)
  })
})
