import type { Metadata } from 'next'
import { getNewsWithFallback } from '@/lib/api'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'Industry News',
  description:
    'Breaking news and analysis from the data center industry — hyperscale, supply chain, policy, technology, and workforce.',
}

export default async function NewsPage() {
  const news = await getNewsWithFallback()

  return <NewsPageClient news={news} />
}
