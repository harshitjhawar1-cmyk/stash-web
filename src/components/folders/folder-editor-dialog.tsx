'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FOLDER_COLORS } from '@/lib/utils/color'
import { cn } from '@/lib/utils/cn'

interface FolderEditorDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; icon: string; color_hex: string }) => void
  initialData?: { name: string; icon: string; color_hex: string }
  isLoading?: boolean
}

export function FolderEditorDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading,
}: FolderEditorDialogProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [colorHex, setColorHex] = useState(initialData?.color_hex ?? '#007AFF')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), icon: 'folder', color_hex: colorHex })
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Folder' : 'New Folder'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Folder"
          autoFocus
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {FOLDER_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColorHex(color)}
                className={cn(
                  'h-8 w-8 rounded-full border-2 transition-transform',
                  colorHex === color
                    ? 'scale-110 border-gray-900 dark:border-white'
                    : 'border-transparent hover:scale-105'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
