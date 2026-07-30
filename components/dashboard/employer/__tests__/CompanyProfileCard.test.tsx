import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import CompanyProfileCard from '../CompanyProfileCard'
import type { CompanyProfile } from '@/lib/types'

const mocks = vi.hoisted(() => ({
  upsert: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      upsert: mocks.upsert,
    }),
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/logo.png' } }),
      }),
    },
  }),
}))

function makeProfile(overrides: Partial<CompanyProfile> = {}): CompanyProfile {
  return {
    id: 'profile-1',
    user_id: 'user-1',
    company_name: 'Equinix',
    tagline: 'Powering the digital world',
    logo_url: null,
    about: 'A global data center company.',
    industry_focus: ['Colocation'],
    founded_year: 1998,
    headquarters: 'Redwood City, CA',
    markets: ['Northern Virginia'],
    total_mw_capacity: '450 MW',
    num_data_centers: 12,
    careers_url: 'https://equinix.com/careers',
    website_url: 'https://equinix.com',
    linkedin_url: 'https://linkedin.com/company/equinix',
    hiring_contact_email: 'jobs@equinix.com',
    hiring_categories: ['operations'],
    avg_hires_per_year: 25,
    interested_in_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('CompanyProfileCard', () => {
  beforeEach(() => {
    mocks.upsert.mockReset().mockResolvedValue({ error: null })
  })

  it('renders empty placeholders when there is no existing profile', () => {
    render(<CompanyProfileCard userId="user-1" initialProfile={null} />)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('pre-fills fields from an existing profile', () => {
    render(<CompanyProfileCard userId="user-1" initialProfile={makeProfile()} />)
    expect(screen.getByText('Equinix')).toBeInTheDocument()
    expect(screen.getByText('Powering the digital world')).toBeInTheDocument()
  })

  it('saves only the Identity section fields when that section is edited', async () => {
    render(<CompanyProfileCard userId="user-1" initialProfile={makeProfile()} />)

    const identityHeading = screen.getByText('Identity')
    const identitySection = identityHeading.closest('div')!.parentElement!
    fireEvent.click(within(identitySection).getByText('Edit'))

    const nameInput = screen.getByDisplayValue('Equinix')
    fireEvent.change(nameInput, { target: { value: 'Equinix Inc.' } })
    fireEvent.click(within(identitySection).getByText('Save'))

    await waitFor(() =>
      expect(mocks.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'user-1', company_name: 'Equinix Inc.' }),
        { onConflict: 'user_id' }
      )
    )
  })

  it('saves the whole profile from the header Save changes button', async () => {
    render(<CompanyProfileCard userId="user-1" initialProfile={makeProfile()} />)
    fireEvent.click(screen.getByText('Save changes'))

    await waitFor(() =>
      expect(mocks.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'user-1' }),
        { onConflict: 'user_id' }
      )
    )
  })
})
