'use client'

import useSWR from 'swr'
import type { Article, Highlight } from '@/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch')
    return r.json()
  })

export function useSearch(
  query: string,
  type: 'articles' | 'highlights' | 'all' = 'all'
) {
  const shouldFetch = query.length >= 2

  const { data, error, isLoading } = useSWR<{
    articles: Article[]
    highlights: Highlight[]
  }>(
    shouldFetch
      ? `/api/search?q=${encodeURIComponent(query)}&type=${type}`
      : null,
    fetcher,
    { keepPreviousData: true }
  )

  return {
    results: {
      articles: data?.articles ?? [],
      highlights: data?.highlights ?? [],
    },
    isLoading: shouldFetch && isLoading,
    error,
  }
}
