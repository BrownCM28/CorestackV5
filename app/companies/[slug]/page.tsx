import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCompanyBySlug } from '@/lib/api'
import { daysAgo } from '@/lib/utils'
import CompanyLogo from '@/components/jobs/CompanyLogo'
import JobCard from '@/components/jobs/JobCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getCompanyBySlug(slug).catch(() => null)

  if (!data) return { title: 'Company not found — Corestack' }

  const description = `${data.jobs.length} open role${data.jobs.length === 1 ? '' : 's'} at ${data.company} on Corestack — the job board for data center and infrastructure professionals.`

  return {
    title: `${data.company} Jobs — Corestack`,
    description,
    openGraph: {
      title: `${data.company} Jobs`,
      description,
      url: `https://corestackjobs.com/companies/${slug}`,
      siteName: 'Corestack',
      type: 'website',
    },
  }
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getCompanyBySlug(slug).catch(() => null)
  if (!data) notFound()

  const { company, jobs, profile, updates } = data

  const facts: { label: string; value: string }[] = []
  if (profile?.headquarters) facts.push({ label: 'Headquarters', value: profile.headquarters })
  if (profile?.founded_year) facts.push({ label: 'Founded', value: String(profile.founded_year) })
  if (profile?.num_data_centers) facts.push({ label: 'Data Centers', value: String(profile.num_data_centers) })
  if (profile?.total_mw_capacity) facts.push({ label: 'Capacity', value: profile.total_mw_capacity })
  if (profile?.markets && profile.markets.length > 0) facts.push({ label: 'Markets', value: profile.markets.join(', ') })

  const links: { label: string; url: string }[] = []
  if (profile?.website_url) links.push({ label: 'Website', url: profile.website_url })
  if (profile?.careers_url) links.push({ label: 'Careers Page', url: profile.careers_url })
  if (profile?.linkedin_url) links.push({ label: 'LinkedIn', url: profile.linkedin_url })

  return (
    <div>
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <section
        className="px-6 pt-10 pb-12 border-b border-black"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3, #ffffff 85%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-black/40 mb-8">
            <Link
              href="/"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Corestack
            </Link>
            <span>/</span>
            <Link
              href="/companies"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Companies
            </Link>
            <span>/</span>
            <span className="text-black/60 truncate max-w-[200px]">{company}</span>
          </div>

          <div className="flex items-start gap-6 flex-wrap">
            <CompanyLogo company={company} size={80} />

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
                {company}
              </h1>

              {profile?.tagline && (
                <p className="text-base text-black/60 mt-3 max-w-xl">{profile.tagline}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap mt-4">
                <span className="text-xs font-semibold text-[#3ecf8e] border border-[#3ecf8e]/30 px-3 py-1 tabular-nums">
                  {jobs.length} open role{jobs.length === 1 ? '' : 's'}
                </span>
                {facts.map((f) => (
                  <span
                    key={f.label}
                    className="text-xs font-medium border border-black/20 px-3 py-1"
                  >
                    {f.label}: {f.value}
                  </span>
                ))}
              </div>

              {links.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-4">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs border border-black px-3 py-1.5 transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      {profile?.about && (
        <section className="border-b border-black">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
              About
            </h2>
            <p className="text-sm text-black/75 leading-relaxed whitespace-pre-wrap max-w-3xl">
              {profile.about}
            </p>
          </div>
        </section>
      )}

      {/* ── RECENT UPDATES ───────────────────────────────────────────────── */}
      {updates.length > 0 && (
        <section className="border-b border-black bg-white/70 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-5">
              Recent Updates
            </h2>
            <ul role="list" className="divide-y divide-black/10">
              {updates.map((u) => (
                <li key={u.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-bold text-sm leading-snug">{u.title}</h3>
                    <span className="text-[11px] text-black/35 whitespace-nowrap">
                      {daysAgo(u.published_at)}
                    </span>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed mt-1.5 whitespace-pre-wrap max-w-3xl">
                    {u.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── OPEN ROLES ───────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-5">
            Open Roles ({jobs.length})
          </h2>
          <ul role="list" className="grid grid-cols-1 border-l border-t border-black">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="border-r border-b border-black bg-white/75 backdrop-blur-sm"
              >
                <JobCard job={job} hideLogo />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
