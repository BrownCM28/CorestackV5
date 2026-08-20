import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getNews, getResources, getJobCategoryCounts } from '@/lib/api'
import { MOCK_NEWS } from '@/lib/mock-news'
import { MOCK_RESOURCES } from '@/lib/mock-resources'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description:
    'The job board for the people building the cloud. Operations, construction, power, cooling, and networking roles across the data center industry.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(60)

  if (jobsError) {
    console.error('Failed to fetch jobs:', jobsError.message)
  }

  const dbNews = await getNews().catch(() => [])
  const news = dbNews.length > 0 ? dbNews : MOCK_NEWS

  const dbResources = await getResources().catch(() => [])
  const resources = dbResources.length > 0 ? dbResources : MOCK_RESOURCES

  const categoryCounts = await getJobCategoryCounts().catch(() => [])

  return (
    <HomeClient
      jobs={jobs ?? []}
      news={news}
      resources={resources}
      categoryCounts={categoryCounts}
    />
  )
}
