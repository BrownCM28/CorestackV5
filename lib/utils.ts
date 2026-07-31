import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Job } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(
  min: number | null,
  max: number | null
): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n)

  if (min && max && min === max) return fmt(min)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  if (max) return `Up to ${fmt(max)}`
  return 'Salary not listed'
}

/**
 * Guards against open-redirect payloads (absolute URLs, protocol-relative
 * `//evil.com`) in a `?next=` query param before it's used as a redirect
 * target. Falls back to `fallback` for anything that isn't a same-origin
 * relative path.
 */
export function sanitizeNextPath(raw: string | null | undefined, fallback = '/'): string {
  if (!raw) return fallback
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}

export function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

export function excerpt(text: string, max = 140): string {
  const plain = text
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '…'
}

export function getBadge(job: Job): { label: string; cls: string } | null {
  const ageHours = (Date.now() - new Date(job.created_at).getTime()) / 3_600_000
  if (ageHours < 24) return { label: 'NEW', cls: 'bg-[#3ecf8e] text-black' }
  if ((job.salary_min ?? 0) >= 110000)
    return { label: 'FEATURED', cls: 'bg-amber-100 text-amber-800 border border-amber-300' }
  if ((job.salary_min ?? 0) >= 90000)
    return { label: 'HOT', cls: 'bg-red-100 text-red-700 border border-red-200' }
  return null
}
