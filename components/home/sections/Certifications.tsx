import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionContainer from './SectionContainer'
import { CERT_LEVEL } from '@/lib/resource-levels'
import type { Resource } from '@/lib/types'

interface Props {
  resources: Resource[]
}

export default function Certifications({ resources }: Props) {
  const certs = resources.filter((r) => r.type === 'cert')
  const programs = resources.filter((r) => r.type === 'program')
  const schools = resources.filter((r) => r.type === 'school')
  const featured = certs.slice(0, 3)

  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
          Certifications
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          Get Qualified.
        </h2>
        <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
          The credentials employers actually look for.
        </p>

        {featured.length > 0 && (
          <ul role="list" className="mt-10 border-t border-black divide-y divide-black/10">
            {featured.map((cert, i) => {
              const level = CERT_LEVEL[cert.name]
              return (
                <li key={cert.id} className="py-6 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                  <span className="text-sm text-black/25 tabular-nums flex-shrink-0 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <p className="font-bold text-base leading-snug">{cert.name}</p>
                      {level && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border border-black/20 text-black/50 flex-shrink-0">
                          {level}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-black/40 uppercase tracking-wide mt-1">
                      {cert.provider}
                    </p>
                    {cert.description && (
                      <p className="text-sm text-black/50 leading-relaxed mt-2 max-w-2xl line-clamp-2">
                        {cert.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${cert.name} details`}
                    className="flex-shrink-0 self-start sm:self-center focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    <ArrowRight size={18} className="text-black/30 hover:text-[#3ecf8e] transition-colors" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <p className="text-sm text-black/50">
            <span className="font-semibold text-black">
              {programs.length} programs · {certs.length} certifications · {schools.length} schools
            </span>{' '}
            tracked in the Corestack directory.
          </p>
          <Link
            href="/resources"
            className="flex-shrink-0 border border-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none whitespace-nowrap"
          >
            View All Resources →
          </Link>
        </div>
      </SectionContainer>
    </section>
  )
}
