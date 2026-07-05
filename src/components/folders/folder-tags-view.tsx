'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useFolders } from '@/lib/hooks/use-folders'
import { useArticleFolders } from '@/lib/hooks/use-article-folders'
import { cn } from '@/lib/utils/cn'
import type { Folder } from '@/types'

interface FolderTagsViewProps {
  articleId: string
  currentFolderIds: string[]
}

export function FolderTagsView({ articleId, currentFolderIds }: FolderTagsViewProps) {
  const { folders } = useFolders()
  const { addToFolder, removeFromFolder } = useArticleFolders()
  const [showPicker, setShowPicker] = useState(false)

  const currentFolders = folders.filter((f) => currentFolderIds.includes(f.id))
  const availableFolders = folders.filter(
    (f) => !currentFolderIds.includes(f.id) && !f.is_system
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {currentFolders.map((folder) => (
          <span
            key={folder.id}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${folder.color_hex || '#007AFF'}20`,
              color: folder.color_hex || '#007AFF',
            }}
          >
            {folder.name}
            {!folder.is_system && (
              <button
                onClick={() => removeFromFolder(articleId, folder.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
      {showPicker && availableFolders.length > 0 && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
          {availableFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => {
                addToFolder(articleId, folder.id)
                setShowPicker(false)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: folder.color_hex || '#007AFF' }}
              />
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
