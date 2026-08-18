import { createClient } from '@/lib/supabase/server'
import { generateCompanySlug } from '@/lib/utils'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, slug, company, created_at')
    .eq('status', 'active')

  // `|| job.id` (not `??`) also treats an empty-string slug as "no slug".
  // Preferring slug here means a job with one is never listed at its
  // /jobs/<id> URL -- app/jobs/[slug]/page.tsx permanentRedirect()s id->slug
  // whenever both exist, and a sitemap entry that immediately redirects is
  // exactly what this file exists to prevent.
  const jobUrls = (jobs ?? []).map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug || job.id}`,
    lastModified: job.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const companySlugs = new Map<string, string>()
  for (const job of jobs ?? []) {
    const slug = generateCompanySlug(job.company)
    if (!slug) continue
    if (!companySlugs.has(slug)) companySlugs.set(slug, job.created_at)
  }
  const companyUrls = Array.from(companySlugs, ([slug, lastModified]) => ({
    url: `${SITE_URL}/companies/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')

  const articleUrls = (articles ?? []).map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/companies`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    ...jobUrls,
    ...companyUrls,
    ...articleUrls,
  ]
}
