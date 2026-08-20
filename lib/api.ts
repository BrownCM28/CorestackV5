import { createClient } from '@/lib/supabase/server'
import { isUuid, generateCompanySlug } from '@/lib/utils'
import { CATEGORY_LIST } from '@/lib/constants'
import type {
  Job,
  JobFilters,
  NewsItem,
  Resource,
  ApplicationWithJob,
  SavedJobWithJob,
  Category,
  CompanyProfile,
  CompanyUpdate,
  Article,
} from '@/lib/types'

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  const supabase = await createClient()
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.remote === true) {
    query = query.eq('remote', true)
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`
    )
  }
  if (filters?.companies && filters.companies.length > 0) {
    query = query.in('company', filters.companies)
  }
  if (filters?.postedWithin) {
    const hours = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 }[filters.postedWithin]
    const cutoff = new Date(Date.now() - hours * 3_600_000).toISOString()
    query = query.gte('created_at', cutoff)
  }
  if (filters?.skills && filters.skills.length > 0) {
    query = query.or(
      filters.skills.map((skill) => `description.ilike.%${skill}%`).join(',')
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getJobCompanies(): Promise<{ company: string; count: number }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('company')
    .eq('status', 'active')
  if (error) throw error

  const counts = new Map<string, number>()
  for (const { company } of data ?? []) {
    counts.set(company, (counts.get(company) ?? 0) + 1)
  }
  return Array.from(counts, ([company, count]) => ({ company, count })).sort(
    (a, b) => b.count - a.count
  )
}

export async function getJobCategoryCounts(): Promise<{ category: Category; count: number }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('category')
    .eq('status', 'active')
  if (error) throw error

  const counts = new Map<Category, number>()
  for (const { category } of data ?? []) {
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return CATEGORY_LIST.map((category) => ({ category, count: counts.get(category) ?? 0 }))
}

export async function getSimilarJobs(category: Category, excludeId: string): Promise<Job[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(3)
  if (error) throw error
  return data ?? []
}

/**
 * Looks up a job by its slug first (the canonical, SEO-friendly URL), then
 * falls back to id for backward compatibility with old UUID links. The id
 * lookup only runs when `slugOrId` actually looks like a UUID -- the id
 * column is typed uuid, so comparing it against an arbitrary slug string
 * would throw a Postgres type error rather than just finding no match.
 */
export async function getJob(slugOrId: string): Promise<Job> {
  const supabase = await createClient()

  const { data: bySlug, error: slugError } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slugOrId)
    .maybeSingle()
  if (slugError) throw slugError
  if (bySlug) return bySlug

  if (isUuid(slugOrId)) {
    const { data: byId, error: idError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', slugOrId)
      .maybeSingle()
    if (idError) throw idError
    if (byId) return byId
  }

  throw new Error('Job not found.')
}

/**
 * Merges the external press roundup (`news`) with original Corestack
 * articles (`articles`) into one feed, sorted by recency. Original articles
 * carry a `slug` so callers can link to /news/[slug] instead of an
 * external URL.
 *
 * The two sources are queried independently and a failure in either one
 * degrades to an empty list for that source rather than failing the whole
 * feed -- otherwise the (separately maintained) `news` table being briefly
 * unavailable would take the original articles down with it.
 */
export async function getNews(): Promise<NewsItem[]> {
  const supabase = await createClient()
  const [newsResult, articlesResult] = await Promise.all([
    supabase.from('news').select('*').order('published_at', { ascending: false }),
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, published_at')
      .order('published_at', { ascending: false }),
  ])
  const news = newsResult.error ? [] : newsResult.data ?? []
  const articles = articlesResult.error ? [] : articlesResult.data ?? []

  const articleItems: NewsItem[] = articles.map((a) => ({
    id: a.id,
    headline: a.title,
    source: 'Corestack',
    url: `/news/${a.slug}`,
    excerpt: a.excerpt,
    published_at: a.published_at,
    slug: a.slug,
  }))

  return [...news, ...articleItems].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getUserApplications(): Promise<ApplicationWithJob[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(*)')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ApplicationWithJob[]
}

export async function getUserSavedJobs(): Promise<SavedJobWithJob[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('saved_jobs')
    .select('*, job:jobs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as SavedJobWithJob[]
}

export async function getPostedJobs(): Promise<Job[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('posted_by', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export interface CompanyPageData {
  company: string
  jobs: Job[]
  profile: CompanyProfile | null
  updates: CompanyUpdate[]
}

/**
 * jobs.company is free text with no FK to company_profiles, so a company
 * page's identity comes from the company name on its active jobs -- the
 * slug is matched by re-slugifying every distinct company name rather than
 * looking up a stored value, since most companies won't have a profile row
 * at all. company_profiles is joined in the same way (by re-slugifying
 * company_name) purely to enrich the page when a profile does exist.
 */
export async function getCompanyBySlug(slug: string): Promise<CompanyPageData | null> {
  const supabase = await createClient()

  const { data: activeJobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
  if (jobsError) throw jobsError

  const match = (activeJobs ?? []).find((j) => generateCompanySlug(j.company) === slug)
  if (!match) return null

  const companyName = match.company
  const jobs = (activeJobs ?? []).filter((j) => j.company === companyName)

  const { data: profiles } = await supabase.from('company_profiles').select('*')
  const profile =
    (profiles ?? []).find(
      (p) => p.company_name && generateCompanySlug(p.company_name) === slug
    ) ?? null

  let updates: CompanyUpdate[] = []
  if (profile) {
    const { data: updatesData } = await supabase
      .from('company_updates')
      .select('*')
      .eq('company_profile_id', profile.id)
      .order('published_at', { ascending: false })
    updates = updatesData ?? []
  }

  return { company: companyName, jobs, profile, updates }
}
