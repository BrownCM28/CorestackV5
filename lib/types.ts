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

export type JobStatus = 'active' | 'pending' | 'closed' | 'draft'
export type ResourceType = 'cert' | 'school' | 'program'
export type UserType = 'job_seeker' | 'employer'
export type SeekerUrgency = 'active' | 'open' | 'browsing'
export type EmployerUrgency = 'hiring_now' | 'next_quarter' | 'exploring'
export type ReferralSource = 'linkedin' | 'google' | 'word_of_mouth' | 'other'

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
  paid_at: string | null
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
  full_name: string | null
  title: string | null
  location: string | null
  bio: string | null
  resume_url: string | null
  linkedin_url: string | null
  years_experience: number | null
  open_to_work: boolean | null
  profile_visible: boolean | null
  user_type: UserType | null
  interested_categories: Category[] | null
  preferred_markets: string[] | null
  company_name: string | null
  search_urgency: SeekerUrgency | EmployerUrgency | null
  referral_source: ReferralSource | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface JobFilters {
  category?: Category
  location?: string
  remote?: boolean
  search?: string
  companies?: string[]
  postedWithin?: '24h' | '7d' | '30d'
  skills?: string[]
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
}

export type ApplicationWithJob = Application & { job: Job }
export type SavedJobWithJob = SavedJob & { job: Job }
