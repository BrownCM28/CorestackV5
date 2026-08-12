import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/utils'
import type {
  Job,
  JobFilters,
  NewsItem,
  Resource,
  ApplicationWithJob,
  SavedJobWithJob,
  Category,
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

export async function getNews(): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
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
