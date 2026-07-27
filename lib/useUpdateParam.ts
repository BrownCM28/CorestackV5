'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useUpdateParam(pathname: string) {
  const router = useRouter()
  const params = useSearchParams()

  return useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      router.replace(`${pathname}?${next.toString()}`)
    },
    [router, params, pathname]
  )
}
