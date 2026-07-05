'use client'

import Link from 'next/link'
import { Inbox, Bookmark, Folder as FolderIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Folder } from '@/types'

interface FolderCardProps {
  folder: Folder
  variant?: 'card' | 'chip'
}

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  unsorted: <Inbox className="h-5 w-5" />,
  to_read: <Bookmark className="h-5 w-5" />,
}

export function FolderCard({ folder, variant = 'card' }: FolderCardProps) {
  if (variant === 'chip') {
    return (
      <Link
        href={`/folder/${folder.id}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-all hover:shadow-sm active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: folder.color_hex || '#007AFF' }}
        />
        {folder.name}
      </Link>
    )
  }

  const icon = folder.system_identifier
    ? SYSTEM_ICONS[folder.system_identifier]
    : <FolderIcon className="h-5 w-5" />

  const itemCount = folder.articleCount ?? 0

  return (
    <Link
      href={`/folder/${folder.id}`}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center transition-all hover:shadow-md active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${folder.color_hex || '#007AFF'}15`, color: folder.color_hex || '#007AFF' }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {folder.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>
    </Link>
  )
}
