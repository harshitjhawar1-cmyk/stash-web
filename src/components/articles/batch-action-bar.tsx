'use client'

import { X, BookOpen, FolderPlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BatchActionBarProps {
  count: number
  onMarkRead: () => void
  onMoveToFolder: () => void
  onDelete: () => void
  onCancel: () => void
}

export function BatchActionBar({
  count,
  onMarkRead,
  onMoveToFolder,
  onDelete,
  onCancel,
}: BatchActionBarProps) {
  if (count === 0) return null

  return (
    <div className="sticky bottom-20 md:bottom-4 z-30 mx-auto flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {count} selected
      </span>
      <Button variant="ghost" size="sm" onClick={onMarkRead}>
        <BookOpen className="mr-1 h-4 w-4" />
        Mark read
      </Button>
      <Button variant="ghost" size="sm" onClick={onMoveToFolder}>
        <FolderPlus className="mr-1 h-4 w-4" />
        Move
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600">
        <Trash2 className="mr-1 h-4 w-4" />
        Delete
      </Button>
      <button onClick={onCancel} className="ml-1 rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
