'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutTile() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null)
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const displayEmail =
    email && email.length > 20 ? email.slice(0, 20) + '…' : email

  return (
    <>
      {displayEmail && (
        <span className="h-full px-4 text-xs text-black/50 flex items-center border-l border-black whitespace-nowrap">
          {displayEmail}
        </span>
      )}
      <button
        onClick={handleSignOut}
        className="h-full px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        aria-label="Sign out of your account"
      >
        Sign Out
      </button>
    </>
  )
}
