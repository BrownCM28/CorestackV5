import { permanentRedirect, notFound } from 'next/navigation'
import { FEATURED_COLLECTIONS } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Collections now live at their own path (e.g. /jobs/texas) rather than
// this generic /jobs/collections/[slug] route -- kept only so any link
// already shared at the old URL still resolves instead of 404ing.
export default async function LegacyCollectionRedirect({ params }: PageProps) {
  const { slug } = await params
  const collection = FEATURED_COLLECTIONS.find((c) => c.slug === slug)
  if (!collection) notFound()
  permanentRedirect(collection.path)
}
