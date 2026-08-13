import type { Metadata } from 'next'
import { getJobCompanies } from '@/lib/api'
import CompanyCard from '@/components/companies/CompanyCard'

export const metadata: Metadata = {
  title: 'Companies — Corestack',
  description:
    'Browse data center and infrastructure companies actively hiring on Corestack.',
  openGraph: {
    title: 'Companies — Corestack',
    description:
      'Browse data center and infrastructure companies actively hiring on Corestack.',
    url: 'https://corestackjobs.com/companies',
    siteName: 'Corestack',
    type: 'website',
  },
}

export default async function CompaniesPage() {
  const companies = await getJobCompanies().catch(() => [])

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
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className="text-sm text-black/50 mb-8">
          {companies.length} companies with open roles on Corestack.
        </p>

        {companies.length === 0 ? (
          <div className="py-16 text-center border border-black bg-white/70 backdrop-blur-sm">
            <p className="text-sm text-black/50">No companies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-black">
            {companies.map(({ company, count }) => (
              <div key={company} className="border-r border-b border-black">
                <CompanyCard company={company} count={count} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
