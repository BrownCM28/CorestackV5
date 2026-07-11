'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function NavAuth() {
  const router = useRouter()
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
    router.push('/')
  }

  if (user) {
    const email = user.email ?? ''
    const displayEmail = email.length > 24 ? email.slice(0, 24) + '...' : email
    return (
      <>
        <span className="h-full px-4 text-xs text-black/50 flex items-center border-l border-black whitespace-nowrap">
          {displayEmail}
        </span>
        <button
          onClick={handleSignOut}
          className="h-full px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        >
          Sign Out
        </button>
      </>
    )
  }

  return (
    <Link
      href="/signin"
      className="flex items-center px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
    >
      Sign In
    </Link>
  )
}
