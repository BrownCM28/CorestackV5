import type { NewsItem } from './types'

const now = new Date()
const ago = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mnews-1',
    headline: 'Microsoft breaks ground on 200MW campus in Goodyear, AZ',
    source: 'Hyperscale',
    url: '#',
    excerpt: 'Microsoft has begun construction on an $800M hyperscale campus outside Phoenix, expected to be operational by Q3 2027.',
    published_at: ago(2),
  },
  {
    id: 'mnews-2',
    headline: 'Transformer shortage extends lead times to record 104 weeks for 2026',
    source: 'Supply Chain',
    url: '#',
    excerpt: 'Power transformer manufacturers are citing record backlogs as hyperscaler demand outpaces production capacity.',
    published_at: ago(5),
  },
  {
    id: 'mnews-3',
    headline: 'Virginia data center tax exemption renewal passes state senate',
    source: 'Policy',
    url: '#',
    excerpt: 'Virginia lawmakers voted 34-5 to renew the data center equipment tax exemption through 2032, protecting Loudoun County investment.',
    published_at: ago(24),
  },
  {
    id: 'mnews-4',
    headline: 'Liquid cooling adoption reaches 34% of new hyperscale builds in 2026',
    source: 'Technology',
    url: '#',
    excerpt: 'Direct liquid cooling deployment has more than tripled in two years as GPU density in AI clusters pushes thermal limits.',
    published_at: ago(26),
  },
  {
    id: 'mnews-5',
    headline: 'Google invests $4.2B in South Carolina campus — 1,200 construction jobs',
    source: 'Development',
    url: '#',
    excerpt: 'Google confirmed a new 120MW data center campus in Berkeley County, SC, its second major South Carolina investment.',
    published_at: ago(48),
  },
  {
    id: 'mnews-6',
    headline: 'Meta announces 5GW data center expansion across 7 states through 2028',
    source: 'Hyperscale',
    url: '#',
    excerpt: 'Meta plans to add 5 gigawatts of data center capacity over the next two years to support its AI infrastructure buildout.',
    published_at: ago(72),
  },
  {
    id: 'mnews-7',
    headline: 'BICSI releases updated ANSI/BICSI 002-2026 data center standard',
    source: 'Industry',
    url: '#',
    excerpt: 'The new standard adds requirements for AI cluster cabling, liquid cooling infrastructure, and edge micro-data centers.',
    published_at: ago(96),
  },
  {
    id: 'mnews-8',
    headline: 'Critical power equipment backlog shrinks as new transformer plants come online',
    source: 'Supply Chain',
    url: '#',
    excerpt: 'Three new US transformer manufacturing facilities opened in Q1 2026, easing pressure on 18-month backlogs.',
    published_at: ago(120),
  },
  {
    id: 'mnews-9',
    headline: 'Data center construction employment hits record 180,000 workers in US',
    source: 'Workforce',
    url: '#',
    excerpt: 'The Bureau of Labor Statistics data center subsector now employs more workers than at any point since tracking began in 2004.',
    published_at: ago(144),
  },
  {
    id: 'mnews-10',
    headline: 'NTT DATA opens 120MW campus in Chicago western suburbs',
    source: 'Development',
    url: '#',
    excerpt: 'NTT DATA cut the ribbon on its seventh US data center, a two-building, 120MW campus in Elk Grove Village, IL.',
    published_at: ago(168),
  },
]
