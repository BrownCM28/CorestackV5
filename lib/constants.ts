import type { Category } from './types'

// The apex domain (corestackjobs.com) redirects to this www domain at the
// DNS/Vercel level -- every absolute URL in metadata, JSON-LD, and the
// sitemap must use this canonical form, or it 308s before Google (or a
// share link) ever reaches it.
export const SITE_URL = 'https://www.corestackjobs.com'

export const CATEGORY_LABELS: Record<Category, string> = {
  operations: 'Operations',
  construction: 'Construction',
  electrical_power: 'Electrical / Power',
  cooling_mechanical: 'Cooling / Mechanical',
  networking: 'Networking',
  fiber_networks: 'Fiber Networks',
  power_generation: 'Power Generation',
  energy_storage: 'Energy Storage',
  semiconductor_fabrication: 'Semiconductor Fabrication',
}

export const CATEGORY_LIST: Category[] = [
  'operations',
  'construction',
  'electrical_power',
  'cooling_mechanical',
  'networking',
  'fiber_networks',
  'power_generation',
  'energy_storage',
  'semiconductor_fabrication',
]

export interface CollectionTrade {
  /** Button label shown on the collection page. */
  label: string
  /** Case-insensitive substring matched against job.title client-side --
   * these are trades/crafts, not the broader jobs.category enum, so a
   * plain keyword match is simpler than adding one-off category values. */
  keyword: string
}

export interface FeaturedCollection {
  /** Matches jobs.collection -- the DB tag used to filter into this set. */
  slug: string
  /** The page's actual route, e.g. '/jobs/texas'. Each collection with a
   * page needs its own route.tsx under app/ -- there's no shared dynamic
   * route, so a location-style URL like /jobs/texas doesn't collide with
   * the /jobs/[slug] individual job-detail route. */
  path: string
  /** Full heading used on the collection's own page. */
  label: string
  /** Compact label for the featured-collections bar on /jobs. */
  shortLabel: string
  description: string
  /** Trade quick-filter buttons shown under the search bar on the
   * collection's own page. Omit or leave empty for just a search bar. */
  trades?: CollectionTrade[]
}

// New featured collection = tag the relevant jobs.collection to a new slug
// (see scripts used for prior imports), add an entry here, and create its
// page.tsx at `path`.
export const FEATURED_COLLECTIONS: FeaturedCollection[] = [
  {
    slug: 'texas-dc-construction',
    path: '/jobs/texas',
    label: 'Texas Data Center Construction',
    shortLabel: 'Texas DC Construction',
    description:
      'Construction, electrical, mechanical, and commissioning roles building out data centers across Texas.',
    trades: [
      { label: 'Electrical', keyword: 'electric' },
      { label: 'HVAC', keyword: 'hvac' },
      { label: 'Mechanical', keyword: 'mechanic' },
      { label: 'Welding', keyword: 'weld' },
      { label: 'Concrete', keyword: 'concrete' },
      { label: 'Carpentry', keyword: 'carpen' },
      { label: 'Pipefitting', keyword: 'pipe' },
      { label: 'Civil', keyword: 'civil' },
    ],
  },
  {
    slug: 'virginia-dc',
    path: '/jobs/virginia',
    label: 'Virginia Data Center Jobs',
    shortLabel: 'Virginia DC Jobs',
    description:
      'Critical facilities, electrical, mechanical, and commissioning roles across Northern Virginia’s Data Center Alley and beyond.',
    trades: [
      { label: 'Electrical', keyword: 'electric' },
      { label: 'Mechanical', keyword: 'mechanic' },
      { label: 'Commissioning', keyword: 'commission' },
      { label: 'Critical Facilities', keyword: 'critical facilit' },
      { label: 'Controls', keyword: 'control' },
      { label: 'Construction', keyword: 'construction' },
    ],
  },
]

export const MARKET_LIST = [
  'Northern Virginia',
  'Dallas–Fort Worth',
  'Phoenix',
  'Atlanta',
  'Columbus',
  'Chicago',
  'Silicon Valley',
  'Portland/Hillsboro',
  'Salt Lake City',
  'Remote',
  'Other',
] as const

export const INDUSTRY_FOCUS_LIST = [
  'Hyperscale',
  'Colocation',
  'Edge',
  'Construction & Development',
  'Managed Services',
  'Cloud',
] as const

export const SKILL_LIST = [
  'CompTIA Server+',
  'CompTIA Network+',
  'CDCP',
  'CDCS',
  'BICSI Installer 2',
  'BICSI DCDC',
  'OSHA 30',
  'PMP',
  'PE License',
] as const

export const DATE_POSTED_OPTIONS = [
  { value: '24h', label: 'Past 24 hours' },
  { value: '7d', label: 'Past week' },
  { value: '30d', label: 'Past month' },
] as const

export type DatePosted = (typeof DATE_POSTED_OPTIONS)[number]['value']
