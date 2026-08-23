'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, MapPin, Wrench, DollarSign, Clock, Wifi } from 'lucide-react'
import { MARKET_LIST, SKILL_LIST, DATE_POSTED_OPTIONS } from '@/lib/constants'

const LOCATIONS = MARKET_LIST.filter((m) => m !== 'Remote' && m !== 'Other')

const SALARY_OPTIONS = [
  { value: 50000, label: '$50K+' },
  { value: 75000, label: '$75K+' },
  { value: 100000, label: '$100K+' },
  { value: 125000, label: '$125K+' },
  { value: 150000, label: '$150K+' },
]

const POPULAR_SEARCHES = [
  'Data Center Technician',
  'Electrical Engineer',
  'HVAC Technician',
  'Construction Manager',
  'Network Engineer',
  'Commissioning Engineer',
  'Critical Facilities',
  'Project Manager',
]

interface DropdownProps {
  id: string
  label: string
  icon: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterDropdown({ id, label, icon, open, onToggle, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        className={[
          'flex items-center gap-2 px-4 py-2 text-xs font-medium whitespace-nowrap border border-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none',
          open ? 'bg-black text-white' : 'bg-white hover:bg-[#3ecf8e] hover:text-black',
        ].join(' ')}
      >
        {icon}
        {label}
        <ChevronDown size={12} aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <div
          id={`${id}-menu`}
          role="menu"
          className="absolute left-0 top-full mt-1.5 z-20 min-w-48 max-h-72 overflow-y-auto border border-black bg-white shadow-[4px_4px_0_0_#000]"
        >
          {children}
        </div>
      )}
    </div>
  )
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block px-4 py-2.5 text-sm text-left hover:bg-[#3ecf8e] hover:text-black transition-colors border-b border-black/10 last:border-b-0"
    >
      {children}
    </Link>
  )
}

export default function HeroFilters() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  function toggle(id: string) {
    setOpenMenu((cur) => (cur === id ? null : id))
  }

  return (
    <div ref={containerRef} className="mt-6 flex flex-col items-center gap-5 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterDropdown
          id="location"
          label="Location"
          icon={<MapPin size={13} aria-hidden="true" />}
          open={openMenu === 'location'}
          onToggle={() => toggle('location')}
        >
          {LOCATIONS.map((loc) => (
            <MenuLink key={loc} href={`/jobs?location=${encodeURIComponent(loc)}`}>
              {loc}
            </MenuLink>
          ))}
        </FilterDropdown>

        <FilterDropdown
          id="skills"
          label="Skills"
          icon={<Wrench size={13} aria-hidden="true" />}
          open={openMenu === 'skills'}
          onToggle={() => toggle('skills')}
        >
          {SKILL_LIST.map((skill) => (
            <MenuLink key={skill} href={`/jobs?skills=${encodeURIComponent(skill)}`}>
              {skill}
            </MenuLink>
          ))}
        </FilterDropdown>

        <FilterDropdown
          id="salary"
          label="Minimum Salary"
          icon={<DollarSign size={13} aria-hidden="true" />}
          open={openMenu === 'salary'}
          onToggle={() => toggle('salary')}
        >
          {SALARY_OPTIONS.map((opt) => (
            <MenuLink key={opt.value} href={`/jobs?minSalary=${opt.value}`}>
              {opt.label}
            </MenuLink>
          ))}
        </FilterDropdown>

        <FilterDropdown
          id="posted"
          label="Posted"
          icon={<Clock size={13} aria-hidden="true" />}
          open={openMenu === 'posted'}
          onToggle={() => toggle('posted')}
        >
          {DATE_POSTED_OPTIONS.map((opt) => (
            <MenuLink key={opt.value} href={`/jobs?posted=${opt.value}`}>
              {opt.label}
            </MenuLink>
          ))}
        </FilterDropdown>

        <Link
          href="/jobs?remote=true"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium whitespace-nowrap border border-black bg-white hover:bg-[#3ecf8e] hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        >
          <Wifi size={13} aria-hidden="true" />
          Remote Only
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 max-w-2xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mr-1">
          Popular:
        </span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/jobs?search=${encodeURIComponent(term)}`}
            className="border border-black/15 px-3 py-1 text-xs text-black/55 hover:border-black hover:bg-[#3ecf8e] hover:text-black transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  )
}
