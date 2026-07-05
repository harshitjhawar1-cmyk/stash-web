'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FolderEditorDialog } from '@/components/folders/folder-editor-dialog'
import { BookmarkletGuide } from '@/components/onboarding/bookmarklet-guide'
import { useFolders, useCreateFolder, useDeleteFolder } from '@/lib/hooks/use-folders'
import { useUser, useSignOut } from '@/lib/hooks/use-user'
import { toast } from '@/components/ui/toast'
import { Plus, Trash2, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useSignOut()
  const { customFolders, mutate } = useFolders()
  const { trigger: createFolder, isMutating } = useCreateFolder()
  const [showNewFolder, setShowNewFolder] = useState(false)

  async function handleCreateFolder(data: { name: string; icon: string; color_hex: string }) {
    try {
      await createFolder(data)
      mutate()
      setShowNewFolder(false)
      toast('Folder created!')
    } catch {
      toast('Failed to create folder')
    }
  }

  async function handleDeleteFolder(folderId: string) {
    try {
      await fetch(`/api/folders/${folderId}`, { method: 'DELETE' })
      mutate()
      toast('Folder deleted')
    } catch {
      toast('Failed to delete folder')
    }
  }

  return (
    <>
      <Header title="Settings" />

      <div className="space-y-8 py-4">
        {/* Account */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Account
          </h2>
          <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
          <Button variant="outline" className="mt-3" onClick={signOut}>
            <LogOut className="mr-1 h-4 w-4" />
            Sign Out
          </Button>
        </section>

        {/* Folders */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Folders
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setShowNewFolder(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
          </div>
          {customFolders.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No custom folders yet</p>
          ) : (
            <div className="mt-3 space-y-2">
              {customFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: folder.color_hex || undefined }}
                    />
                    {folder.name}
                  </span>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookmarklet */}
        <BookmarkletGuide />
      </div>

      <FolderEditorDialog
        isOpen={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onSave={handleCreateFolder}
        isLoading={isMutating}
      />
    </>
  )
}
