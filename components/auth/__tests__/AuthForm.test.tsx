import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '../AuthForm'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signInWithOAuth: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  pathname: '/signin',
  searchParams: new URLSearchParams(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
  useSearchParams: () => mocks.searchParams,
  usePathname: () => mocks.pathname,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mocks.signInWithOAuth,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
    },
  }),
}))

describe('AuthForm', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.refresh.mockReset()
    mocks.signInWithOAuth.mockReset().mockResolvedValue({ error: null })
    mocks.signInWithPassword.mockReset().mockResolvedValue({ error: null })
    mocks.signUp.mockReset().mockResolvedValue({ error: null })
    mocks.pathname = '/signin'
    mocks.searchParams = new URLSearchParams()
  })

  it('renders an enabled Continue with GitHub button', () => {
    render(<AuthForm mode="signin" />)
    expect(
      screen.getByRole('button', { name: /continue with github/i })
    ).toBeEnabled()
  })

  it('still renders the disabled Google placeholder', () => {
    render(<AuthForm mode="signin" />)
    expect(screen.getByRole('button', { name: /google/i })).toBeDisabled()
  })

  it('calls signInWithOAuth with the github provider on click', async () => {
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.provider).toBe('github')
    expect(call.options.redirectTo).toContain('/auth/callback?next=%2Fdashboard')
  })

  it('includes an explicit next param in the GitHub redirect when present', async () => {
    mocks.searchParams = new URLSearchParams('next=/jobs/abc123')
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.options.redirectTo).toContain(
      `/auth/callback?next=${encodeURIComponent('/jobs/abc123')}`
    )
  })

  it('uses the current path as the GitHub redirect target when embedded outside signin/signup', async () => {
    mocks.pathname = '/jobs/abc123'
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.options.redirectTo).toContain(
      `/auth/callback?next=${encodeURIComponent('/jobs/abc123')}`
    )
  })

  it('shows an error message when signInWithOAuth fails', async () => {
    mocks.signInWithOAuth.mockResolvedValue({
      error: { message: 'OAuth provider not enabled' },
    })
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'OAuth provider not enabled'
    )
  })

  it('still redirects to /dashboard after password sign-in with no next param', async () => {
    render(<AuthForm mode="signin" />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard'))
  })
})
