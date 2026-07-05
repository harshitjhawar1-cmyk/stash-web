'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR('user', async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  })

  return { user: data ?? null, isLoading, error, mutate }
}

export function useSignOut() {
  const router = useRouter()
  const { mutate } = useUser()

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    await mutate(null, { revalidate: false })
    router.push('/login')
  }, [router, mutate])

  return { signOut }
}
