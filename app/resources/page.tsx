import type { Metadata } from 'next'
import Link from 'next/link'
import { getResources } from '@/lib/api'
import { MOCK_RESOURCES } from '@/lib/mock-resources'
import type { Resource } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Training & Resources',
  description:
    'Certifications, training programs, and schools for data center careers — operations, power, cooling, cabling, and design.',
}

const TYPE_LABELS: Record<Resource['type'], string> = {
  program: 'Training Programs',
  cert: 'Certifications',
  school: 'Schools & Community Colleges',
}

const CERT_LEVEL: Record<string, string> = {
  'Data Center Design Consultant (DCDC)': 'Advanced',
  'Registered Communications Distribution Designer (RCDD)': 'Advanced',
  'CompTIA Server+': 'Entry',
  'CompTIA Network+': 'Entry',
  'Certified Data Center Professional (CDCP)': 'Foundation',
  'Certified Data Center Specialist (CDCS)': 'Intermediate',
}

const PATHWAY_STEPS = [
  {
    role: 'Data Center Technician',
    timeframe: '0 – 2 yrs',
    skills: ['CompTIA Server+', 'CompTIA Network+', 'CDCP'],
    salary: '$50K – $70K',
    color: '#3ecf8e',
  },
  {
    role: 'Operations Specialist',
    timeframe: '2 – 5 yrs',
    skills: ['CDCS', 'BICSI Installer 2'],
    salary: '$70K – $90K',
    color: '#3b82f6',
  },
  {
    role: 'Shift Lead / Senior Tech',
    timeframe: '4 – 7 yrs',
    skills: ['Vendor certs (Schneider, Vertiv)', 'OSHA 30'],
    salary: '$85K – $110K',
    color: '#8b5cf6',
  },
  {
    role: 'Critical Facilities Manager',
    timeframe: '7 – 12 yrs',
    skills: ['BICSI DCDC', 'PE License (preferred)'],
    salary: '$110K – $145K',
    color: '#f97316',
  },
  {
    role: 'Campus Director / VP Ops',
    timeframe: '12+ yrs',
    skills: ['PMP', 'MBA or equivalent'],
    salary: '$145K – $200K+',
    color: '#ec4899',
  },
]

function ProgramCard({ resource }: { resource: Resource }) {
  return (
    <article className="border border-black p-6 flex flex-col gap-3 hover:bg-black/[0.015] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">
            {resource.provider}
          </p>
          <h3 className="font-bold text-sm leading-snug">{resource.name}</h3>
        </div>
        <span className="text-[10px] border border-black/20 px-2 py-0.5 whitespace-nowrap flex-shrink-0 text-black/50">
          Program
        </span>
      </div>

      {resource.description && (
        <p className="text-xs text-black/60 leading-relaxed line-clamp-4 flex-1">
          {resource.description}
        </p>
      )}

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs mt-auto border border-black px-3 py-1.5 self-start transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        aria-label={`Learn more about ${resource.name}`}
      >
        Learn more →
      </a>
    </article>
  )
}

function CertCard({ resource }: { resource: Resource }) {
  const level = CERT_LEVEL[resource.name]
  const levelColors: Record<string, string> = {
    Entry: '#3ecf8e',
    Foundation: '#3b82f6',
    Intermediate: '#f97316',
    Advanced: '#8b5cf6',
  }
  return (
    <article className="border border-black p-5 flex gap-4 hover:bg-black/[0.015] transition-colors">
      {/* Level indicator */}
      <div
        className="w-1 flex-shrink-0 self-stretch"
        style={{ backgroundColor: level ? levelColors[level] : '#d1d5db' }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm leading-snug">{resource.name}</h3>
            {level && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: `${levelColors[level]}20`, color: levelColors[level] }}
              >
                {level}
              </span>
            )}
          </div>
          <p className="text-[10px] text-black/40 mt-0.5 font-medium uppercase tracking-wider">
            {resource.provider}
          </p>
        </div>

        {resource.description && (
          <p className="text-xs text-black/60 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        )}

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-black/30 px-3 py-1 self-start transition-colors duration-150 hover:bg-[#3ecf8e] hover:border-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          aria-label={`View ${resource.name} details`}
        >
          View cert →
        </a>
      </div>
    </article>
  )
}

function SchoolRow({ resource }: { resource: Resource }) {
  return (
    <article className="border-b border-black/10 last:border-b-0 py-5 flex items-start gap-5">
      {/* Initials badge */}
      <div className="w-10 h-10 bg-black/[0.04] border border-black/10 flex items-center justify-center text-[11px] font-bold text-black/40 flex-shrink-0">
        {resource.provider
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm leading-snug">{resource.name}</h3>
        <p className="text-xs text-black/50 mt-0.5">{resource.provider}</p>
        {resource.description && (
          <p className="text-xs text-black/55 mt-2 leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        )}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 self-start text-xs border border-black/30 px-3 py-1.5 transition-colors hover:bg-[#3ecf8e] hover:border-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        aria-label={`View ${resource.name} at ${resource.provider}`}
      >
        View program →
      </a>
    </article>
  )
}

export default async function ResourcesPage() {
  const dbResources = await getResources().catch(() => [])
  const resources = dbResources.length > 0 ? dbResources : MOCK_RESOURCES

  const programs = resources.filter((r) => r.type === 'program')
  const certs = resources.filter((r) => r.type === 'cert')
  const schools = resources.filter((r) => r.type === 'school')

  const featured = programs.find((r) => r.provider === 'Meta') ?? programs[0]

  return (
    <div>
      {/* Page header */}
      <section
        className="px-6 py-14 border-b border-black"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3, #ffffff 80%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3">
            Corestack
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Training &amp; Resources
          </h1>
          <p className="mt-3 text-black/50 max-w-md text-sm leading-relaxed">
            Certifications, programs, and schools to start or advance a career in
            data center operations, power, cooling, cabling, and design.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            <div>
              <p className="text-2xl font-bold tabular-nums">{programs.length}</p>
              <p className="text-xs text-black/40 mt-0.5">Training programs</p>
            </div>
            <div className="border-l border-black/10 pl-6">
              <p className="text-2xl font-bold tabular-nums">{certs.length}</p>
              <p className="text-xs text-black/40 mt-0.5">Certifications</p>
            </div>
            <div className="border-l border-black/10 pl-6">
              <p className="text-2xl font-bold tabular-nums">{schools.length}</p>
              <p className="text-xs text-black/40 mt-0.5">Schools</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Career pathway */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6">
            Career Pathway
          </h2>
          <div className="flex overflow-x-auto gap-0 border border-black">
            {PATHWAY_STEPS.map((step, i) => (
              <div
                key={step.role}
                className="flex-1 min-w-40 p-5 border-r border-black last:border-r-0"
              >
                <div
                  className="w-2 h-2 mb-3"
                  style={{ backgroundColor: step.color }}
                  aria-hidden="true"
                />
                <p className="font-bold text-xs leading-snug">{step.role}</p>
                <p className="text-[10px] text-black/35 mt-1">{step.timeframe}</p>
                <p className="text-[10px] font-medium mt-2 tabular-nums" style={{ color: step.color }}>
                  {step.salary}
                </p>
                <ul className="mt-3 space-y-1">
                  {step.skills.map((s) => (
                    <li key={s} className="text-[10px] text-black/45 flex gap-1">
                      <span className="text-black/20 flex-shrink-0">–</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Featured spotlight */}
        {featured && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
              Featured Spotlight
            </h2>
            <article className="border border-black p-8 flex flex-col sm:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#3ecf8e] mb-2">
                  {featured.provider}
                </p>
                <h3 className="text-xl font-bold leading-snug">{featured.name}</h3>
                {featured.description && (
                  <p className="mt-3 text-sm text-black/60 leading-relaxed">{featured.description}</p>
                )}
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-5 py-2.5 transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                >
                  Learn more →
                </a>
              </div>
              <div className="sm:w-48 flex-shrink-0 border border-black/10 p-5 flex flex-col gap-3 bg-black/[0.02]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  Program details
                </p>
                <div>
                  <p className="text-xs text-black/40">Type</p>
                  <p className="text-sm font-medium mt-0.5">Training Program</p>
                </div>
                <div>
                  <p className="text-xs text-black/40">Provider</p>
                  <p className="text-sm font-medium mt-0.5">{featured.provider}</p>
                </div>
                <div>
                  <p className="text-xs text-black/40">For</p>
                  <p className="text-sm font-medium mt-0.5">Entry-level candidates</p>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Training programs */}
        {programs.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-lg font-bold">{TYPE_LABELS.program}</h2>
              <span className="text-xs text-black/40 tabular-nums">{programs.length} programs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-black">
              {programs.map((r) => (
                <div key={r.id} className="border-r border-b border-black">
                  <ProgramCard resource={r} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-lg font-bold">{TYPE_LABELS.cert}</h2>
              <div className="flex items-center gap-3 text-[10px] text-black/40">
                {['Entry', 'Foundation', 'Intermediate', 'Advanced'].map((lvl) => (
                  <span key={lvl} className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 inline-block"
                      style={{
                        backgroundColor:
                          { Entry: '#3ecf8e', Foundation: '#3b82f6', Intermediate: '#f97316', Advanced: '#8b5cf6' }[lvl],
                      }}
                    />
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-black">
              {certs.map((r) => (
                <div key={r.id} className="border-r border-b border-black">
                  <CertCard resource={r} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Schools */}
        {schools.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-lg font-bold">{TYPE_LABELS.school}</h2>
              <span className="text-xs text-black/40 tabular-nums">{schools.length} schools</span>
            </div>
            <div className="border border-black divide-y divide-black/10 px-5">
              {schools.map((r) => (
                <SchoolRow key={r.id} resource={r} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border border-black p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-bold text-base">Looking for your next role?</h2>
            <p className="text-sm text-black/50 mt-1">
              Browse open positions from top data center operators and contractors.
            </p>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 bg-black text-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none whitespace-nowrap"
          >
            Browse Jobs
          </Link>
        </section>
      </div>
    </div>
  )
}
