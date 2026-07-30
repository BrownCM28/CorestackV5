'use client'

import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  count: number
  defaultOpen?: boolean
  isLast?: boolean
  children: ReactNode
}

export default function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  isLast = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={isLast ? '' : 'border-b border-black'}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
      >
        <span className="text-sm font-semibold">
          {title} <span className="font-normal text-black/40">({count})</span>
        </span>
        <span className="text-sm leading-none" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 px-5 pb-5">
          {count === 0 ? (
            <p className="text-sm text-black/50 text-center py-6">
              {emptyMessage(title)}
            </p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
}

function emptyMessage(title: string): string {
  if (title === 'Active') return 'No active listings — post your first job.'
  if (title === 'In Review') return 'No listings awaiting review.'
  return 'No closed listings.'
}
