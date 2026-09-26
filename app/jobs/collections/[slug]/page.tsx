import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/api'
import CollectionJobsClient from '@/components/jobs/CollectionJobsClient'
import TexasIcon from '@/components/icons/TexasIcon'
import { FEATURED_COLLECTIONS, SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

function findCollection(slug: string) {
  return FEATURED_COLLECTIONS.find((c) => c.slug === slug)
}

// Per-collection header icon -- a plain lookup here rather than a component
// reference on FeaturedCollection itself, since lib/constants.ts stays
// framework-agnostic data (imported by both server and client code).
const COLLECTION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'texas-dc-construction': TexasIcon,
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = findCollection(slug)
  if (!collection) return {}

  const title = `${collection.label} Jobs — Corestack`
  return {
    title,
    description: collection.description,
    openGraph: {
      title,
      description: collection.description,
      url: `${SITE_URL}/jobs/collections/${slug}`,
      siteName: 'Corestack',
      type: 'website',
    },
  }
}

export default async function JobCollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = findCollection(slug)
  if (!collection) notFound()

  const jobs = await getJobs({ collection: slug }).catch(() => [])
  const Icon = COLLECTION_ICONS[slug]

  return (
    <div
      className="px-6 py-10"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Link
          href="/jobs"
          className="text-xs text-black/40 hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          ← All Jobs
        </Link>

        <div className="flex items-start justify-between gap-6 mt-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.label}</h1>
            <p className="text-sm text-black/50 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          </div>
          {Icon && <Icon size={88} className="text-black flex-shrink-0 hidden sm:block" />}
        </div>

        <CollectionJobsClient jobs={jobs} trades={collection.trades} />
      </div>
    </div>
  )
}
