import { createClient } from '@/lib/supabase/server'
import type {
  Job,
  JobFilters,
  NewsItem,
  Resource,
  ApplicationWithJob,
  SavedJobWithJob,
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

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getJob(id: string): Promise<Job> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
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
