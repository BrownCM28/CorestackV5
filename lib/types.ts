export type Category =
  | 'operations'
  | 'construction'
  | 'electrical_power'
  | 'cooling_mechanical'
  | 'networking'
  | 'fiber_networks'
  | 'power_generation'
  | 'energy_storage'
  | 'semiconductor_fabrication'

export type JobStatus = 'active' | 'closed' | 'draft'
export type ProfileRole = 'seeker' | 'employer'
export type ResourceType = 'cert' | 'school' | 'program'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  category: Category
  remote: boolean
  description: string
  salary_min: number | null
  salary_max: number | null
  apply_target: string
  posted_by: string | null
  created_at: string
  status: JobStatus
  paid_amount_cents: number
}

export interface Application {
  id: string
  job_id: string
  applicant_id: string
  created_at: string
}

export interface SavedJob {
  id: string
  job_id: string
  user_id: string
  created_at: string
}

export interface NewsItem {
  id: string
  headline: string
  source: string
  url: string
  excerpt: string | null
  published_at: string
}

export interface Resource {
  id: string
  name: string
  type: ResourceType
  provider: string
  url: string
  description: string | null
}

export interface Profile {
  id: string
  display_name: string | null
  role: ProfileRole
  created_at: string
}

export interface JobFilters {
  category?: Category
  location?: string
  remote?: boolean
  search?: string
}

export interface CreateJobPayload {
  title: string
  company: string
  location: string
  category: Category
  remote: boolean
  description: string
  salary_min: number | null
  salary_max: number | null
  apply_target: string
  paid_amount_cents: number
}

export type ApplicationWithJob = Application & { job: Job }
export type SavedJobWithJob = SavedJob & { job: Job }
