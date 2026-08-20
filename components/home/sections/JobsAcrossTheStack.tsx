import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionContainer from './SectionContainer'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { Category } from '@/lib/types'

interface Props {
  categoryCounts: { category: Category; count: number }[]
}

export default function JobsAcrossTheStack({ categoryCounts }: Props) {
  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
          Specialization
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          One Industry. Every Role.
        </h2>
        <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
          From the people building the next hyperscale campus to the engineers keeping it
          online, Corestack connects the entire infrastructure workforce.
        </p>

        <ul role="list" className="mt-10 border-t border-black divide-y divide-black">
          {categoryCounts.map(({ category, count }, i) => (
            <li key={category}>
              <Link
                href={`/jobs?category=${category}`}
                className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-4 px-2 sm:px-4 py-6 transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
              >
                <span className="flex items-baseline gap-4 sm:gap-8 min-w-0">
                  <span className="text-sm text-black/25 tabular-nums flex-shrink-0 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xl sm:text-3xl font-black uppercase tracking-tight group-hover:text-[#3ecf8e] transition-colors">
                    {CATEGORY_LABELS[category]}
                  </span>
                </span>
                <span className="flex items-center gap-3 flex-shrink-0 pl-12 sm:pl-0">
                  <span className="text-sm text-black/40 tabular-nums whitespace-nowrap">
                    {count > 0 ? `${count} open role${count === 1 ? '' : 's'}` : '—'}
                  </span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="text-black/30 group-hover:text-[#3ecf8e] group-hover:translate-x-1 transition-all"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </section>
  )
}
