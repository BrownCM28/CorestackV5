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

export const PRICE_MIN = 5
export const PRICE_MAX = 500
export const PRICE_DEFAULT = 99
