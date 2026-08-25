'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/** Signed-in user, or null while signed out / before the initial auth
 * check resolves. Shared by any client component that needs to know
 * whether someone is signed in without duplicating the Supabase
 * getUser()/onAuthStateChange() wiring (see components/NavAuth.tsx for
 * the fuller version that also loads user_type). */
export function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return user
}
