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
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
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
              href="/jobs"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Jobs
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY: job listings + sidebar ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex gap-0 divide-x divide-black border-b border-black min-h-screen">

        {/* ── Main: about + open roles ─── */}
        <main className="flex-1 min-w-0 p-8 sm:p-10">
          {/* About */}
          <div className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
              About
            </h2>
            <p className="text-sm text-black/75 leading-relaxed whitespace-pre-wrap max-w-2xl">
              {profile?.about || 'No company description available yet.'}
            </p>
          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6">
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
        </main>

        {/* ── Sidebar: other info, updates ─── */}
        <aside className="w-80 flex-shrink-0 hidden xl:block" aria-label="Company info and updates">
          <div className="sticky top-0 divide-y divide-black">

            {/* Other info */}
            {(facts.length > 0 || links.length > 0) && (
              <div className="p-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-5">
                  Other Info
                </p>
                {facts.length > 0 && (
                  <dl className="space-y-4">
                    {facts.map((f) => (
                      <div key={f.label} className="flex justify-between gap-4">
                        <dt className="text-xs text-black/40">{f.label}</dt>
                        <dd className="text-xs font-medium text-right">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {links.length > 0 && (
                  <div className={`flex flex-col gap-2 ${facts.length > 0 ? 'mt-5' : ''}`}>
                    {links.map((l) => (
                      <a
                        key={l.label}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-center border border-black px-3 py-2 transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                      >
                        {l.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent updates */}
            <div className="p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
                Recent Updates
              </p>
              {updates.length > 0 ? (
                <ul role="list" className="space-y-5">
                  {updates.map((u) => (
                    <li key={u.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-semibold leading-snug">{u.title}</p>
                      </div>
                      <p className="text-[11px] text-black/45 mt-1 leading-relaxed">
                        {u.body}
                      </p>
                      <p className="text-[10px] text-black/35 mt-1">{daysAgo(u.published_at)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-black/40">No recent updates.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
