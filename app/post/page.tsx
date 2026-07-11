import type { Metadata } from 'next'
import PostJobForm from '@/components/post/PostJobForm'

export const metadata: Metadata = {
  title: 'Post a Job',
  description: 'Post a data center job opening on Corestack. Reach operations, construction, electrical, cooling, and networking professionals.',
}

export default function PostJobPage() {
  return (
    <div className="px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-black/50 text-sm mb-10">
          Your listing will be live immediately after checkout.
        </p>
        <PostJobForm />
      </div>
    </div>
  )
}
