'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { Article, SortOption } from '@/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch')
    return r.json()
  })

export function useArticles(folderId?: string, sort?: SortOption) {
  const params = new URLSearchParams()
  if (folderId) params.set('folder_id', folderId)
  if (sort) params.set('sort', sort)

  const { data, error, isLoading, mutate } = useSWR<{
    articles: Article[]
    count: number
  }>(`/api/articles?${params.toString()}`, fetcher)

  return {
    articles: data?.articles ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    mutate,
  }
}

export function useArticle(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Article>(
    id ? `/api/articles/${id}` : null,
    fetcher
  )

  return { article: data ?? null, isLoading, error, mutate }
}

async function postArticle(url: string, { arg }: { arg: { url: string } }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create article')
  }
  return res.json()
}

export function useCreateArticle() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/articles',
    postArticle
  )
  return { trigger, isMutating, error }
}

async function patchArticle(
  url: string,
  { arg }: { arg: Partial<Article> }
) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to update article')
  return res.json()
}

export function useUpdateArticle(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/articles/${id}`,
    patchArticle
  )
  return { trigger, isMutating }
}

async function deleteArticle(url: string) {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete article')
}

export function useDeleteArticle(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/articles/${id}`,
    deleteArticle
  )
  return { trigger, isMutating }
}
