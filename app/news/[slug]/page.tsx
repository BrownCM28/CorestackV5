import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticleBySlug } from '@/lib/api'
import { CATEGORY_LABELS, SITE_URL } from '@/lib/constants'
import { daysAgo } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)

  if (!article) return { title: 'Article not found — Corestack' }

  return {
    title: `${article.title} — Corestack`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/news/${article.slug}`,
      siteName: 'Corestack',
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) notFound()

  const categoryLabel = article.category ? CATEGORY_LABELS[article.category] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: 'Corestack',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Corestack',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/corestack-logo.webp`,
      },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/news/${article.slug}`,
    },
  }

  return (
    <div>
      <section
        className="px-6 pt-10 pb-12 border-b border-black"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px), linear-gradient(to bottom, #f3f3f3, #ffffff 85%)',
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-black/40 mb-8">
            <Link
              href="/"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Corestack
            </Link>
            <span>/</span>
            <Link
              href="/news"
              className="hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              News
            </Link>
            <span>/</span>
            <span className="text-black/60 truncate max-w-[200px]">{article.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white bg-black">
              Corestack
            </span>
            {categoryLabel && (
              <span className="text-xs font-medium border border-black/20 px-2.5 py-0.5">
                {categoryLabel}
              </span>
            )}
            <span className="text-xs text-black/40">{daysAgo(article.published_at)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[1.05] text-balance">
            {article.title}
          </h1>

          <p className="mt-4 text-sm text-black/50">By {article.author}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div
          className="prose prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-black prose-headings:uppercase prose-headings:tracking-tight
            prose-h2:text-base prose-h2:mt-10 prose-h3:text-sm
            prose-p:text-black/75 prose-p:leading-relaxed
            prose-li:text-black/75 prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-a:text-[#3ecf8e] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black prose-strong:font-semibold
            prose-hr:border-black/10"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
        </div>

        {article.category && (
          <div className="mt-12 border border-black p-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm font-medium">
              Hiring or looking for {categoryLabel} roles in data centers?
            </p>
            <Link
              href={`/jobs?category=${article.category}`}
              className="flex-shrink-0 border border-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
            >
              Browse {categoryLabel} Jobs →
            </Link>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-black/10">
          <Link
            href="/news"
            className="text-xs text-black/40 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            ← Back to News
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
