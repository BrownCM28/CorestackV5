'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import NavAuth from '@/components/NavAuth'

const navLinks = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/news', label: 'News' },
  { href: '/resources', label: 'Resources' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function MosaicNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Main navigation" className="border-b border-black">
      <div className="flex items-stretch h-12">
        {/* Logo tile */}
        <Link
          href="/"
          className="flex items-center px-4 border-r border-black bg-white flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
          aria-label="Corestack home"
        >
          <Image
            src="/corestack-logo.webp"
            alt="Corestack"
            width={120}
            height={28}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Spacer pushes nav links to the right */}
        <div className="flex-1" />

        {/* Nav links — right-aligned, desktop only */}
        <div className="hidden md:flex items-stretch">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          <NavAuth />
        </div>

        {/* Menu toggle — mobile/tablet only */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden flex items-center justify-center w-12 border-l border-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden flex flex-col divide-y divide-black border-t border-black">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
            >
              {link.label}
            </Link>
          ))}

          <NavAuth mobile onNavigate={() => setOpen(false)} />
        </div>
      )}
    </nav>
  )
}
