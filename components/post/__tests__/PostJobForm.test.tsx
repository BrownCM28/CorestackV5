import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PostJobForm from '../PostJobForm'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  repostParam: null as string | null,
  single: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => ({ get: () => mocks.repostParam }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: mocks.single,
        }),
      }),
    }),
  }),
}))

describe('PostJobForm', () => {
  it('renders an empty form immediately when there is no repost param', () => {
    mocks.repostParam = null
    render(<PostJobForm />)
    expect(screen.getByLabelText(/Job Title/)).toHaveValue('')
  })

  it('pre-fills fields from the source job when a repost param is present', async () => {
    mocks.repostParam = 'job-1'
    mocks.single.mockResolvedValue({
      data: {
        title: 'Data Center Technician',
        company: 'Equinix',
        location: 'Ashburn, VA',
        category: 'operations',
        remote: false,
        description: 'Test job description',
        salary_min: 55000,
        salary_max: 75000,
        apply_target: 'https://equinix.com/apply',
      },
    })

    render(<PostJobForm />)

    await waitFor(() => expect(screen.getByLabelText(/Job Title/)).toHaveValue('Data Center Technician'))
    expect(screen.getByLabelText(/^Company/)).toHaveValue('Equinix')
  })
})
