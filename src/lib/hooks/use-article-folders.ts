'use client'

import { useCallback } from 'react'
import { useSWRConfig } from 'swr'

export function useArticleFolders() {
  const { mutate } = useSWRConfig()

  const addToFolder = useCallback(
    async (articleId: string, folderId: string) => {
      const res = await fetch('/api/article-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, folder_id: folderId }),
      })
      if (!res.ok) throw new Error('Failed to add to folder')
      mutate((key: string) => typeof key === 'string' && (key.startsWith('/api/articles') || key.startsWith('/api/folders')), undefined, { revalidate: true })
    },
    [mutate]
  )

  const removeFromFolder = useCallback(
    async (articleId: string, folderId: string) => {
      const res = await fetch('/api/article-folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, folder_id: folderId }),
      })
      if (!res.ok) throw new Error('Failed to remove from folder')
      mutate((key: string) => typeof key === 'string' && (key.startsWith('/api/articles') || key.startsWith('/api/folders')), undefined, { revalidate: true })
    },
    [mutate]
  )

  return { addToFolder, removeFromFolder }
}
