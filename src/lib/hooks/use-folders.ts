'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { Folder } from '@/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch')
    return r.json()
  })

export function useFolders() {
  const { data, error, isLoading, mutate } = useSWR<{ folders: Folder[] }>(
    '/api/folders',
    fetcher
  )

  const folders = data?.folders ?? []
  const systemFolders = folders.filter((f) => f.is_system)
  const customFolders = folders.filter((f) => !f.is_system)

  return { folders, systemFolders, customFolders, isLoading, error, mutate }
}

async function postFolder(
  url: string,
  { arg }: { arg: { name: string; icon?: string; color_hex?: string } }
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to create folder')
  return res.json()
}

export function useCreateFolder() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/folders',
    postFolder
  )
  return { trigger, isMutating, error }
}

async function patchFolder(
  url: string,
  { arg }: { arg: Partial<Folder> }
) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Failed to update folder')
  return res.json()
}

export function useUpdateFolder(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/folders/${id}`,
    patchFolder
  )
  return { trigger, isMutating }
}

async function deleteFolder(url: string) {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete folder')
}

export function useDeleteFolder(id: string) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/folders/${id}`,
    deleteFolder
  )
  return { trigger, isMutating }
}
