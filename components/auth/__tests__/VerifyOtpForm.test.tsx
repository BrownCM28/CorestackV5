import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import VerifyOtpForm from '../VerifyOtpForm'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  verifyOtp: vi.fn(),
  resend: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      verifyOtp: mocks.verifyOtp,
      resend: mocks.resend,
    },
  }),
}))

function enterCode(code: string) {
  fireEvent.change(screen.getByLabelText('Verification code'), {
    target: { value: code },
  })
}

describe('VerifyOtpForm', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.verifyOtp.mockReset().mockResolvedValue({ data: {}, error: null })
    mocks.resend.mockReset().mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the email the code was sent to', () => {
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('keeps Verify disabled until a 6-digit code is entered', () => {
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    const verifyButton = screen.getByRole('button', { name: 'Verify' })
    expect(verifyButton).toBeDisabled()

    enterCode('12345')
    expect(verifyButton).toBeDisabled()

    enterCode('123456')
    expect(verifyButton).toBeEnabled()
  })

  it('strips non-digit characters and caps at 6 digits', () => {
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    enterCode('12a3456bc')
    expect(screen.getByLabelText('Verification code')).toHaveValue('123456')
  })

  it('calls verifyOtp with the email, code, and signup type, then redirects to next', async () => {
    render(<VerifyOtpForm email="test@example.com" next="/dashboard/saved" />)
    enterCode('123456')
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }))

    await waitFor(() =>
      expect(mocks.verifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: '123456',
        type: 'signup',
      })
    )
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard/saved'))
  })

  it('shows an error and does not redirect when the code is wrong or expired', async () => {
    mocks.verifyOtp.mockResolvedValue({
      data: {},
      error: { message: 'Token has expired or is invalid' },
    })
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    enterCode('123456')
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Token has expired or is invalid'
    )
    expect(mocks.push).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Verify' })).toBeEnabled()
  })

  it('does not get stuck on "Verifying…" when verifyOtp rejects', async () => {
    mocks.verifyOtp.mockRejectedValue(new Error('Failed to fetch'))
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    enterCode('123456')
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to fetch')
    expect(screen.getByRole('button', { name: 'Verify' })).toBeEnabled()
  })

  it('calls resend with the signup type and email, and starts a cooldown on success', async () => {
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))

    await waitFor(() =>
      expect(mocks.resend).toHaveBeenCalledWith({ type: 'signup', email: 'test@example.com' })
    )
    expect(await screen.findByText('A new code is on its way.')).toBeInTheDocument()

    const resendButton = screen.getByRole('button', { name: /resend code in \d+s/i })
    expect(resendButton).toBeDisabled()
  })

  it('re-enables the resend button once the cooldown elapses', async () => {
    vi.useFakeTimers()
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))

    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: /resend code in \d+s/i })).toBeDisabled()
    )

    await vi.advanceTimersByTimeAsync(45_000)

    expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled()
  })

  it('shows an error when resend fails', async () => {
    mocks.resend.mockResolvedValue({ error: { message: 'Too many requests' } })
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Too many requests')
  })

  it('does not get stuck on "Sending…" when resend rejects', async () => {
    mocks.resend.mockRejectedValue(new Error('Failed to fetch'))
    render(<VerifyOtpForm email="test@example.com" next="/" />)
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to fetch')
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled()
  })
})
