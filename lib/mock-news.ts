import type { NewsItem } from './types'

// Real articles from reputable industry/business sources, used as a
// fallback whenever the live `news` table is empty or unreachable (see
// getNews() in lib/api.ts). Every url below is a real, verified article
// link — not a placeholder — since users click through to it from the
// news page and ticker.
export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mnews-1',
    headline: 'Meta, BlackRock Plan to Invest in $14 Billion Data Center',
    source: 'Hyperscale',
    url: 'https://www.bloomberg.com/news/articles/2026-07-28/meta-blackrock-plan-to-invest-in-giant-texas-data-center',
    excerpt: 'Meta and BlackRock will build a 1-gigawatt data center complex in Texas costing roughly $14 billion, going online in 2028 with Meta as the initial sole tenant.',
    published_at: '2026-07-28T12:00:00.000Z',
  },
  {
    id: 'mnews-2',
    headline: 'Data center power density: Planning liquid-cooled AI data centers around grid and power constraints',
    source: 'Technology',
    url: 'https://blog.se.com/datacenter/2026/07/28/data-center-power-density-planning-liquid-cooled-ai-data-centers-around-grid-and-power-constraints/',
    excerpt: 'Rising AI rack densities are pushing liquid cooling from optional to essential, with power availability and cooling strategy now inseparable planning factors.',
    published_at: '2026-07-28T09:00:00.000Z',
  },
  {
    id: 'mnews-3',
    headline: 'The Gigawatt Buildout Faces the Execution Test',
    source: 'Industry',
    url: 'https://www.datacenterfrontier.com/hyperscale/news/55393364/the-gigawatt-buildout-faces-the-execution-test',
    excerpt: 'The industry is shifting from announcing gigawatt-scale capacity to actually delivering it, with financing costs, grid stability, and permitting now the real constraints.',
    published_at: '2026-07-24T10:00:00.000Z',
  },
  {
    id: 'mnews-4',
    headline: 'First Statewide Moratorium on New Hyperscale Data Centers Launched by Governor Kathy Hochul',
    source: 'Policy',
    url: 'https://www.governor.ny.gov/news/first-statewide-moratorium-new-hyperscale-data-centers-launched-governor-kathy-hochul',
    excerpt: 'New York signed an executive order pausing new hyperscale data center environmental permits for up to a year while it develops statewide regulatory standards.',
    published_at: '2026-07-14T14:00:00.000Z',
  },
  {
    id: 'mnews-5',
    headline: "Meta's Louisiana Data Center Investment Reaches $50 Billion Amid AI Push",
    source: 'Hyperscale',
    url: 'https://www.cnbc.com/2026/07/13/meta-louisiana-data-center-investment-reaches-50-billion-amid-ai-push.html',
    excerpt: "Meta's Richland Parish, Louisiana campus will scale to 5 gigawatts, with total investment surpassing $50 billion aided by generous state tax incentives.",
    published_at: '2026-07-13T15:00:00.000Z',
  },
  {
    id: 'mnews-6',
    headline: 'New Data Center Developments: July 2026',
    source: 'Development',
    url: 'https://www.datacenterknowledge.com/data-center-construction/new-data-center-developments-july-2026',
    excerpt: "A roundup of the month's major announcements, including Microsoft's Wisconsin AI campus coming online and a combined $25B Amazon/Google investment in Missouri.",
    published_at: '2026-07-02T08:00:00.000Z',
  },
  {
    id: 'mnews-7',
    headline: 'AI Data Center Boom Rewires US Power Supply Chain',
    source: 'Supply Chain',
    url: 'https://www.datacenterknowledge.com/build-design/ai-data-center-boom-rewires-us-power-supply-chain',
    excerpt: 'The US data center electrical equipment market is projected to nearly triple to $65B by 2030 as annual transformer demand surges past 9,000 units.',
    published_at: '2026-05-04T11:00:00.000Z',
  },
  {
    id: 'mnews-8',
    headline: 'Fact of the Week: Construction Industry Facing a 439,000-Worker Shortage Driven by the Growth of Data Centers',
    source: 'Workforce',
    url: 'https://itif.org/publications/2026/01/12/construction-industry-facing-worker-shortage-driven-by-growth-of-data-centers/',
    excerpt: 'Data center construction jobs now pay up to 30% more than typical construction roles, yet the industry still faces a shortage of roughly 439,000 skilled workers.',
    published_at: '2026-01-12T13:00:00.000Z',
  },
  {
    id: 'mnews-9',
    headline: 'Transformers in 2026: Shortage, Scramble, or Self-Inflicted Crisis?',
    source: 'Supply Chain',
    url: 'https://www.powermag.com/transformers-in-2026-shortage-scramble-or-self-inflicted-crisis/',
    excerpt: 'Manufacturers are investing nearly $2 billion in new capacity, but some industry voices argue procurement practices — not production limits — are the real bottleneck.',
    published_at: '2026-01-02T09:00:00.000Z',
  },
]
