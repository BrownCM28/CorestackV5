'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Props {
  mobile?: boolean
  onNavigate?: () => void
}

export default function NavAuth({ mobile = false, onNavigate }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onNavigate?.()
    router.push('/')
    router.refresh()
  }

  if (user) {
    const email = user.email ?? ''
    const displayEmail = email.length > 24 ? email.slice(0, 24) + '...' : email
    return (
      <>
        <span
          className={
            mobile
              ? 'block px-4 py-3 text-xs text-black/50 truncate'
              : 'h-full px-4 text-xs text-black/50 flex items-center border-l border-black whitespace-nowrap'
          }
        >
          {displayEmail}
        </span>
        <button
          onClick={handleSignOut}
          className={
            mobile
              ? 'w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none'
              : 'h-full px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap'
          }
        >
          Sign Out
        </button>
      </>
    )
  }

  const showNext = pathname !== '/signin' && pathname !== '/signup'

  return (
    <Link
      href={showNext ? `/signin?next=${encodeURIComponent(pathname)}` : '/signin'}
      onClick={onNavigate}
      className={
        mobile
          ? 'block px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none'
          : 'flex items-center px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap'
      }
    >
      Sign In
    </Link>
  )
}
