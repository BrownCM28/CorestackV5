import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'
import { FEATURED_COLLECTIONS, SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

function findCollection(slug: string) {
  return FEATURED_COLLECTIONS.find((c) => c.slug === slug)
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

        <h1 className="text-3xl font-bold mt-3 mb-2">{collection.label}</h1>
        <p className="text-sm text-black/50 mb-8 max-w-2xl leading-relaxed">
          {collection.description}
        </p>

        <JobGrid jobs={jobs} titleWeight="medium" />
      </div>
    </div>
  )
}
