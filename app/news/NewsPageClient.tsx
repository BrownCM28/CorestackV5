'use client'

import { useState, useMemo } from 'react'
import type { NewsItem } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function timeSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return '1d ago'
  return `${d}d ago`
}

// Assign a display color to each source tag
const SOURCE_COLORS: Record<string, string> = {
  Hyperscale: '#3b82f6',
  'Supply Chain': '#f97316',
  Policy: '#8b5cf6',
  Technology: '#3ecf8e',
  Workforce: '#eab308',
  Development: '#ec4899',
  Industry: '#64748b',
}

function sourceColor(source: string): string {
  return SOURCE_COLORS[source] ?? '#64748b'
}

interface Props {
  news: NewsItem[]
}

export default function NewsPageClient({ news }: Props) {
  const [activeSource, setActiveSource] = useState<string>('all')

  const sources = useMemo(() => {
    const set = new Set(news.map((n) => n.source))
    return Array.from(set).sort()
  }, [news])

  const filtered = useMemo(
    () => (activeSource === 'all' ? news : news.filter((n) => n.source === activeSource)),
    [news, activeSource]
  )

  const [featured, ...rest] = filtered

  return (
    <div>
      {/* Header */}
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
            Industry News
          </h1>
          <p className="mt-3 text-black/50 max-w-md text-sm leading-relaxed">
            Breaking analysis and updates from the data center industry — hyperscale
            construction, supply chain, policy, and workforce.
          </p>

          {/* Source filter tabs */}
          <div className="flex flex-wrap gap-0 mt-6" role="group" aria-label="Filter by source">
            {(['all', ...sources] as const).map((src, i) => {
              const isActive = activeSource === src
              const label = src === 'all' ? 'All' : src
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveSource(src)}
                  aria-pressed={isActive}
                  style={
                    isActive && src !== 'all'
                      ? { backgroundColor: sourceColor(src), color: '#fff', borderColor: sourceColor(src) }
                      : {}
                  }
                  className={[
                    'px-4 py-2 text-xs font-medium whitespace-nowrap border border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none',
                    i > 0 ? '-ml-px' : '',
                    isActive && src === 'all' ? 'bg-black text-white' : '',
                    !isActive ? 'bg-white hover:bg-black/5' : '',
                  ]
                    .join(' ')
                    .trim()}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <p className="text-sm text-black/40 py-16 text-center border border-black">
            No articles in this category yet.
          </p>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <article className="border border-black p-7 mb-8 group">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white"
                    style={{ backgroundColor: sourceColor(featured.source) }}
                  >
                    {featured.source}
                  </span>
                  <span className="text-xs text-black/40">{timeSince(featured.published_at)}</span>
                  <span className="text-xs text-black/20">·</span>
                  <span className="text-xs text-black/40">{formatDate(featured.published_at)}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold leading-snug text-balance">
                  <a
                    href={featured.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  >
                    {featured.headline}
                  </a>
                </h2>

                {featured.excerpt && (
                  <p className="mt-3 text-sm text-black/60 leading-relaxed max-w-2xl">
                    {featured.excerpt}
                  </p>
                )}

                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-medium border border-black px-4 py-2 transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                  aria-label={`Read full article: ${featured.headline}`}
                >
                  Read article →
                </a>
              </article>
            )}

            {/* Rest of articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-black">
                {rest.map((item) => (
                  <article
                    key={item.id}
                    className="border-r border-b border-black p-6 flex flex-col gap-3 hover:bg-black/[0.015] transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 text-white flex-shrink-0"
                        style={{ backgroundColor: sourceColor(item.source) }}
                      >
                        {item.source}
                      </span>
                      <span className="text-xs text-black/35">{timeSince(item.published_at)}</span>
                    </div>

                    <h3 className="font-semibold text-sm leading-snug">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                      >
                        {item.headline}
                      </a>
                    </h3>

                    {item.excerpt && (
                      <p className="text-xs text-black/55 line-clamp-3 leading-relaxed flex-1">
                        {item.excerpt}
                      </p>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs mt-auto border border-black/30 px-3 py-1.5 self-start transition-colors duration-150 hover:bg-[#3ecf8e] hover:border-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
                      aria-label={`Read: ${item.headline}`}
                    >
                      Read →
                    </a>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
