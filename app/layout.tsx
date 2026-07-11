import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import MosaicNav from '@/components/nav/MosaicNav'
import NewsTicker from '@/components/nav/NewsTicker'
import { getNews } from '@/lib/api'
import { MOCK_NEWS } from '@/lib/mock-news'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Corestack — Data Center Jobs',
    template: '%s — Corestack',
  },
  description:
    'The job board for the people building the cloud. Operations, construction, power, cooling, and networking roles across the data center industry.',
  metadataBase: new URL('https://corestack-v1-5nci.vercel.app'),
  openGraph: {
    siteName: 'Corestack',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let newsItems: Awaited<ReturnType<typeof getNews>> = []
  try {
    newsItems = await getNews()
  } catch {
    // Supabase not configured — fall through to mock data
  }
  if (newsItems.length === 0) newsItems = MOCK_NEWS

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <header className="sticky top-0 z-50 bg-white">
          <MosaicNav />
          <NewsTicker items={newsItems} />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black mt-16 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-black/50">
            <p>© {new Date().getFullYear()} Corestack</p>
            <p>Built for the data center industry.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
