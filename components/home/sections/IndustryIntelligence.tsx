import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionContainer from './SectionContainer'
import { sourceColor } from '@/lib/news-source-colors'
import type { NewsItem } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface Props {
  news: NewsItem[]
}

export default function IndustryIntelligence({ news }: Props) {
  const items = news.slice(0, 8)

  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
          Industry Intelligence
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          What’s Moving The Industry
        </h2>
        <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
          The infrastructure industry is moving fast. We track the projects, capital,
          technology, and policy shaping what gets built next.
        </p>

        {items.length > 0 && (
          <ul role="list" className="mt-10 border-t border-black">
            {items.map((item) => {
              const Content = (
                <>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 text-white flex-shrink-0 whitespace-nowrap"
                    style={{ backgroundColor: sourceColor(item.source) }}
                  >
                    {item.source}
                  </span>
                  <span className="flex-1 min-w-[60%] sm:min-w-0 font-semibold text-sm sm:text-base leading-snug group-hover:text-[#3ecf8e] transition-colors">
                    {item.headline}
                  </span>
                  <span className="text-xs text-black/40 tabular-nums whitespace-nowrap flex-shrink-0 ml-auto sm:ml-0">
                    {formatDate(item.published_at)}
                  </span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="text-black/30 group-hover:text-[#3ecf8e] group-hover:translate-x-1 transition-all flex-shrink-0"
                  />
                </>
              )
              const rowClasses =
                'group flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 px-2 sm:px-4 py-5 border-b border-black transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none'

              return (
                <li key={item.id}>
                  {item.slug ? (
                    <Link href={item.url} className={rowClasses}>
                      {Content}
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClasses}
                    >
                      {Content}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <Link
          href="/news"
          className="mt-8 inline-flex items-center gap-2 border border-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          View All Industry Intelligence →
        </Link>
      </SectionContainer>
    </section>
  )
}
