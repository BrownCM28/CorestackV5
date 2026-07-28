import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import NavAuth from '../NavAuth'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  signOut: vi.fn(),
  single: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
  usePathname: () => mocks.pathname,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mocks.getUser,
      onAuthStateChange: mocks.onAuthStateChange,
      signOut: mocks.signOut,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mocks.single,
        }),
      }),
    }),
  }),
}))

describe('NavAuth', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.refresh.mockReset()
    mocks.pathname = '/'
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: null } })
    mocks.onAuthStateChange
      .mockReset()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mocks.signOut.mockReset().mockResolvedValue({ error: null })
    mocks.single.mockReset().mockResolvedValue({ data: { user_type: null } })
  })

  it('shows Sign In and a Post a Job CTA when signed out', async () => {
    render(<NavAuth />)
    expect(await screen.findByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: 'Post a Job' })
    expect(cta).toHaveAttribute('href', '/post')
  })

  it('shows Find a Job for a signed-in job seeker', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    mocks.single.mockResolvedValue({ data: { user_type: 'job_seeker' } })
    render(<NavAuth />)

    const cta = await screen.findByRole('link', { name: 'Find a Job' })
    expect(cta).toHaveAttribute('href', '/jobs')
  })

  it('shows Post a Job for a signed-in employer', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    mocks.single.mockResolvedValue({ data: { user_type: 'employer' } })
    render(<NavAuth />)

    const cta = await screen.findByRole('link', { name: 'Post a Job' })
    expect(cta).toHaveAttribute('href', '/post')
  })

  it('defaults to Find a Job for a signed-in user with no role yet (mid-onboarding)', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    mocks.single.mockResolvedValue({ data: { user_type: null } })
    render(<NavAuth />)

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Find a Job' })).toBeInTheDocument()
    )
  })

  it('shows the signed-in email and a Sign Out button', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@b.com' } } })
    render(<NavAuth />)

    expect(await screen.findByText('a@b.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument()
  })
})
