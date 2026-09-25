import Link from 'next/link'
import { FEATURED_COLLECTIONS } from '@/lib/constants'

export default function FeaturedCollectionsBar() {
  if (FEATURED_COLLECTIONS.length === 0) return null

  return (
    <div
      role="navigation"
      aria-label="Featured job collections"
      className="flex flex-wrap items-center gap-2 mb-4"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
        Featured
      </span>
      {FEATURED_COLLECTIONS.map((c) => (
        <Link
          key={c.slug}
          href={`/jobs/collections/${c.slug}`}
          className="border border-black px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          {c.shortLabel} →
        </Link>
      ))}
    </div>
  )
}
