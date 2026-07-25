import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import EditJobForm from '@/components/dashboard/EditJobForm'

export const metadata: Metadata = {
  title: 'Edit Job — Corestack',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/signin?next=${encodeURIComponent(`/dashboard/employer/${id}/edit`)}`)

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('posted_by', user.id)
    .single()

  if (error || !job) redirect('/dashboard/employer')

  return (
    <div className="px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
        <p className="text-black/50 text-sm mb-10">
          Update your listing&apos;s details below.
        </p>
        <EditJobForm job={job} />
      </div>
    </div>
  )
}
