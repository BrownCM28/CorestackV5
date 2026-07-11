import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, created_at')
    .eq('status', 'active')

  const jobUrls = (jobs ?? []).map((job) => ({
    url: `https://corestack-v1-5nci.vercel.app/jobs/${job.id}`,
    lastModified: job.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://corestack-v1-5nci.vercel.app',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://corestack-v1-5nci.vercel.app/jobs',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...jobUrls,
  ]
}
