'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { Highlight, HighlightColor } from '@/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch')
    return r.json()
  })

export function useHighlights(articleId?: string) {
  const params = new URLSearchParams()
  if (articleId) params.set('article_id', articleId)

  const { data, error, isLoading, mutate } = useSWR<{
    highlights: Highlight[]
  }>(`/api/highlights?${params.toString()}`, fetcher)

  return {
    highlights: data?.highlights ?? [],
    isLoading,
    error,
    mutate,
  }
}

async function postHighlight(
  url: string,
  {
    arg,
  }: {
    arg: {
      article_id: string
      selected_text: string
      color_name?: HighlightColor
      note?: string
      start_offset?: number
      end_offset?: number
    }
  }
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to create highlight')
  return res.json()
}

export function useCreateHighlight() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/highlights',
    postHighlight
  )
  return { trigger, isMutating, error }
}

async function patchHighlight(
  url: string,
  { arg }: { arg: { note?: string; color_name?: HighlightColor } }
) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to update highlight')
  return res.json()
}

export function useUpdateHighlight(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/highlights/${id}`,
    patchHighlight
  )
  return { trigger, isMutating }
}

async function deleteHighlight(url: string) {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete highlight')
}

export function useDeleteHighlight(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/highlights/${id}`,
    deleteHighlight
  )
  return { trigger, isMutating }
}
