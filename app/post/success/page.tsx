import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Received — Corestack',
}

export default function PostSuccessPage() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-3">Payment Received</h1>
        <p className="text-sm text-black/60 mb-8">
          Thanks — your listing is now awaiting admin review. It&apos;ll go
          live on Corestack as soon as it&apos;s approved.
        </p>
        <Link
          href="/dashboard/employer"
          className="inline-block border border-black px-6 py-3 text-sm font-medium bg-black text-white hover:bg-white hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          View My Listings
        </Link>
      </div>
    </div>
  )
}
