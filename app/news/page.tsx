import type { Metadata } from 'next'
import { getNews } from '@/lib/api'
import { MOCK_NEWS } from '@/lib/mock-news'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'Industry News',
  description:
    'Breaking news and analysis from the data center industry — hyperscale, supply chain, policy, technology, and workforce.',
}

export default async function NewsPage() {
  const dbNews = await getNews().catch(() => [])
  const news = dbNews.length > 0 ? dbNews : MOCK_NEWS

  return <NewsPageClient news={news} />
}
