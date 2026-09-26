import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/api'
import CollectionJobsClient from '@/components/jobs/CollectionJobsClient'
import GeorgiaIcon from '@/components/icons/GeorgiaIcon'
import { FEATURED_COLLECTIONS, SITE_URL } from '@/lib/constants'

const COLLECTION_SLUG = 'georgia-dc'

function getCollection() {
  return FEATURED_COLLECTIONS.find((c) => c.slug === COLLECTION_SLUG)
}

export function generateMetadata(): Metadata {
  const collection = getCollection()
  if (!collection) return {}

  const title = `${collection.label} — Corestack`
  return {
    title,
    description: collection.description,
    openGraph: {
      title,
      description: collection.description,
      url: `${SITE_URL}${collection.path}`,
      siteName: 'Corestack',
      type: 'website',
    },
  }
}

export default async function GeorgiaJobsPage() {
  const collection = getCollection()
  if (!collection) notFound()

  const jobs = await getJobs({ collection: COLLECTION_SLUG }).catch(() => [])

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

        <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-4 sm:gap-6 mt-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.label}</h1>
            <p className="text-sm text-black/50 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          </div>
          <GeorgiaIcon size={88} className="text-black flex-shrink-0" />
        </div>

        <CollectionJobsClient jobs={jobs} trades={collection.trades} />
      </div>
    </div>
  )
}
