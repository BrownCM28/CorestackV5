'use client'

import { useSearchParams } from 'next/navigation'
import { DATE_POSTED_OPTIONS, SKILL_LIST } from '@/lib/constants'
import { useUpdateParam } from '@/lib/useUpdateParam'

interface Props {
  companies: { company: string; count: number }[]
}

export default function JobsSidebar({ companies }: Props) {
  const params = useSearchParams()
  const updateParam = useUpdateParam('/jobs')

  const selectedCompanies = params.get('companies')?.split(',').filter(Boolean) ?? []
  const selectedSkills = params.get('skills')?.split(',').filter(Boolean) ?? []
  const postedWithin = params.get('posted') ?? ''

  function toggleListParam(key: string, current: string[], value: string) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateParam(key, next.length > 0 ? next.join(',') : null)
  }

  return (
    <aside className="w-56 flex-shrink-0 hidden xl:block" aria-label="Job filters">
      <div className="sticky top-0 divide-y divide-black border border-black bg-white/75 backdrop-blur-sm">
        {/* Companies */}
        <div className="px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
            Companies
          </p>
          <ul role="list" className="space-y-3">
            {companies.map(({ company, count }) => (
              <li key={company}>
                <label className="flex items-center justify-between gap-2 cursor-pointer select-none group">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company)}
                      onChange={() => toggleListParam('companies', selectedCompanies, company)}
                      className="w-4 h-4 border border-black flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none accent-[#3ecf8e]"
                    />
                    <span className="text-xs truncate group-hover:text-black text-black/70">
                      {company}
                    </span>
                  </span>
                  <span className="text-[10px] text-black/30 tabular-nums flex-shrink-0">
                    {count}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Date posted */}
        <div className="px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
            Date Posted
          </p>
          <ul role="list" className="space-y-3">
            <li>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="radio"
                  name="posted"
                  checked={postedWithin === ''}
                  onChange={() => updateParam('posted', null)}
                  className="w-4 h-4 border border-black flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none accent-[#3ecf8e]"
                />
                <span className="text-xs text-black/70">Any time</span>
              </label>
            </li>
            {DATE_POSTED_OPTIONS.map(({ value, label }) => (
              <li key={value}>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="posted"
                    checked={postedWithin === value}
                    onChange={() => updateParam('posted', value)}
                    className="w-4 h-4 border border-black flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none accent-[#3ecf8e]"
                  />
                  <span className="text-xs text-black/70">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills mentioned */}
        <div className="px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4">
            Skills Mentioned
          </p>
          <ul role="list" className="space-y-3">
            {SKILL_LIST.map((skill) => (
              <li key={skill}>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleListParam('skills', selectedSkills, skill)}
                    className="w-4 h-4 border border-black flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none accent-[#3ecf8e]"
                  />
                  <span className="text-xs text-black/70">{skill}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
