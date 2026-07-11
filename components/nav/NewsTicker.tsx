'use client'

import type { NewsItem } from '@/lib/types'

interface Props {
  items: NewsItem[]
}

export default function NewsTicker({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div
      className="w-full overflow-hidden border-b border-black bg-white py-2 text-xs"
      aria-label="Industry news headlines"
      aria-live="off"
    >
      {/* Reduced motion: static scrollable list */}
      <ul className="hidden motion-reduce:flex flex-wrap gap-x-6 gap-y-1 px-4 list-none">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              {item.headline}
            </a>
          </li>
        ))}
      </ul>

      {/* Animated ticker */}
      <div className="ticker-track motion-reduce:hidden" aria-hidden="true">
        {/* First copy — focusable */}
        {items.map((item) => (
          <span key={item.id} className="inline-flex items-center px-6">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
              className="hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              {item.headline}
            </a>
            <span className="mx-4 text-black/30" aria-hidden="true">·</span>
          </span>
        ))}
        {/* Duplicate copy — not focusable (purely visual loop) */}
        {items.map((item) => (
          <span key={`dup-${item.id}`} className="inline-flex items-center px-6" aria-hidden="true">
            <span className="hover:text-[#3ecf8e] transition-colors duration-150">
              {item.headline}
            </span>
            <span className="mx-4 text-black/30" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
