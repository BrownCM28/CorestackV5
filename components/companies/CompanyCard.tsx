import Link from 'next/link'
import CompanyLogo from '@/components/jobs/CompanyLogo'
import { generateCompanySlug } from '@/lib/utils'

interface Props {
  company: string
  count: number
}

export default function CompanyCard({ company, count }: Props) {
  return (
    <Link
      href={`/companies/${generateCompanySlug(company)}`}
      className="border border-black p-6 flex flex-col items-center text-center gap-3 hover:bg-black/[0.015] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
    >
      <CompanyLogo company={company} size={56} />
      <div className="min-w-0">
        <h3 className="font-bold text-sm leading-snug truncate max-w-[12rem]">{company}</h3>
        <p className="text-xs text-black/40 mt-1 tabular-nums">
          {count} open role{count === 1 ? '' : 's'}
        </p>
      </div>
    </Link>
  )
}
