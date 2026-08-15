import { createClient } from '@/lib/supabase/server'
import { generateCompanySlug } from '@/lib/utils'

export default async function sitemap() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, slug, company, created_at')
    .eq('status', 'active')

  const jobUrls = (jobs ?? []).map((job) => ({
    url: `https://corestackjobs.com/jobs/${job.slug ?? job.id}`,
    lastModified: job.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const companySlugs = new Map<string, string>()
  for (const job of jobs ?? []) {
    const slug = generateCompanySlug(job.company)
    if (!companySlugs.has(slug)) companySlugs.set(slug, job.created_at)
  }
  const companyUrls = Array.from(companySlugs, ([slug, lastModified]) => ({
    url: `https://corestackjobs.com/companies/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')

  const articleUrls = (articles ?? []).map((article) => ({
    url: `https://corestackjobs.com/news/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: 'https://corestackjobs.com',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://corestackjobs.com/jobs',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://corestackjobs.com/companies',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: 'https://corestackjobs.com/news',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: 'https://corestackjobs.com/terms',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: 'https://corestackjobs.com/privacy',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    ...jobUrls,
    ...companyUrls,
    ...articleUrls,
  ]
}
