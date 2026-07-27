import type { Category } from './types'

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

export const PRICE_MIN = 5
export const PRICE_MAX = 500
export const PRICE_DEFAULT = 99

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
