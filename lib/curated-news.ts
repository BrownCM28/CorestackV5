import type { NewsItem } from './types'

// Real articles from reputable industry/business sources, hand-curated and
// merged into the live news feed by getNewsWithFallback() in lib/api.ts --
// this is not placeholder/mock content. Every headline, date, and excerpt
// below was confirmed against the live article at its url before being
// added here; every url is real and verified, not a placeholder, since
// users click through to it from the news page and ticker.
//
// Refreshed Sep 2026 -- when this list starts looking stale again, replace
// it with current headlines rather than editing dates in place.
export const CURATED_NEWS: NewsItem[] = [
  {
    id: 'mnews-1',
    headline:
      '2026 U.S. Data Center Portfolio Expands as AI, Cloud Demand and Upcoming Capacity Fuel Investment Opportunities',
    source: 'Industry',
    url: 'https://www.globenewswire.com/news-release/2026/09/22/3366625/28124/en/2026-u-s-data-center-portfolio-expands-as-ai-cloud-demand-and-upcoming-capacity-fuel-investment-opportunities.html',
    excerpt:
      'More than 820 upcoming colocation and hyperscale self-built data center projects are expected to add over 150 GW of capacity across the United States, with nine states accounting for the bulk of the activity.',
    published_at: '2026-09-22T09:00:00.000Z',
  },
  {
    id: 'mnews-2',
    headline:
      'Schneider Electric Expands AI-Ready Data Center Infrastructure Portfolio With Prefabricated Power Modules Delivering Up to 2.5MW for NVIDIA-Based High-Density Computing',
    source: 'Technology',
    url: 'https://news.europawire.eu/schneider-electric-expands-ai-ready-data-center-infrastructure-portfolio-with-prefabricated-power-modules-delivering-up-to-2-5mw-for-nvidia-based-high-density-computing/eu-press-release/2026/09/17/14/22/28/180859/',
    excerpt:
      'New standardized, prefabricated power modules offer 2MW–2.5MW per unit for AI and GPU-intensive workloads, built on reference designs developed with NVIDIA for the GB300 NVL72 platform.',
    published_at: '2026-09-17T10:00:00.000Z',
  },
  {
    id: 'mnews-3',
    headline: 'New Workforce Initiative Targets Skilled Labor Shortage in Data Center Construction',
    source: 'Workforce',
    url: 'https://www.contractormag.com/training/news/55403787/new-workforce-initiative-targets-skilled-labor-shortage-in-data-center-construction',
    excerpt:
      "Interplay Learning launched America's Mission Critical Workforce, a national training alliance, as data center job postings more than double over two years and installation/maintenance roles reach roughly a quarter of openings.",
    published_at: '2026-09-09T13:00:00.000Z',
  },
  {
    id: 'mnews-4',
    headline: 'September 2026 Data Center Report: Year-to-Date Spending Nearly Three Times a Year Ago',
    source: 'Development',
    url: 'https://news.constructconnect.com/september-2026-data-center-report-year-to-date-spending-nearly-three-times-a-year-ago',
    excerpt:
      'Data center construction starts reached $84.1 billion through July 2026 — nearly triple the pace of a year earlier — now accounting for close to a quarter of all nonresidential building construction nationally.',
    published_at: '2026-08-28T12:00:00.000Z',
  },
  {
    id: 'mnews-5',
    headline: 'Data Center Moratorium Tracker Update: August 17, 2026',
    source: 'Policy',
    url: 'https://savrn.com/blog/data-center-moratorium-tracker-update-2026-08-17',
    excerpt:
      'As of this update, 45 state-level measures across 36 states and 194 local jurisdictions restrict data center development, with 12 states now under an active restriction and 3 under a formal administrative pause.',
    published_at: '2026-08-17T11:00:00.000Z',
  },
  {
    id: 'mnews-6',
    headline: 'New Data Center Developments: August 2026',
    source: 'Hyperscale',
    url: 'https://www.datacenterknowledge.com/data-center-construction/new-data-center-developments-august-2026',
    excerpt:
      "Meta announced its first Canadian AI campus, a $9B+, 1 GW facility in Sturgeon County, Alberta, expected to employ roughly 3,000 construction workers at peak and 300+ permanent staff once operational.",
    published_at: '2026-08-04T09:00:00.000Z',
  },
  {
    id: 'mnews-7',
    headline: 'U.S. Transformer Market Faces Severe Supply Constraints as Lead Times Extend to Four Years',
    source: 'Supply Chain',
    url: 'https://pv-magazine-usa.com/2026/05/11/u-s-transformer-market-faces-severe-supply-constraints-as-lead-times-extend-to-four-years/',
    excerpt:
      'Long transformer lead times are now dictating power project schedules nationwide, with delivery for high-capacity units stretching to as long as four years amid surging demand and raw-material shortages.',
    published_at: '2026-05-11T08:00:00.000Z',
  },
]
