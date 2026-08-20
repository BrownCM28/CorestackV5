import Link from 'next/link'
import SectionContainer from './SectionContainer'
import CompanyLogo from '@/components/jobs/CompanyLogo'

interface Props {
  companies: string[]
}

export default function Employers({ companies }: Props) {
  const shown = companies.slice(0, 18)

  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
          For Employers
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none max-w-2xl">
          Building The Infrastructure Of The Future?
        </h2>
        <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
          Reach the people building, powering, cooling, and operating it.
        </p>

        {shown.length > 0 && (
          <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 border-l border-t border-black">
            {shown.map((company) => (
              <div
                key={company}
                className="border-r border-b border-black aspect-square flex items-center justify-center p-6"
              >
                <CompanyLogo company={company} size={56} />
              </div>
            ))}
          </div>
        )}

        <Link
          href="/post"
          className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          Post a Job →
        </Link>
      </SectionContainer>
    </section>
  )
}
