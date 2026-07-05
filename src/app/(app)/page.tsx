'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { FolderCard } from '@/components/folders/folder-card'
import { ArticleCard } from '@/components/articles/article-card'
import { FolderEditorDialog } from '@/components/folders/folder-editor-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useFolders, useCreateFolder } from '@/lib/hooks/use-folders'
import { useArticles, useUpdateArticle, useDeleteArticle } from '@/lib/hooks/use-articles'
import { toast } from '@/components/ui/toast'

export default function HomePage() {
  const { folders, systemFolders, customFolders, isLoading: foldersLoading, mutate: mutateFolders } = useFolders()
  const { articles, isLoading: articlesLoading } = useArticles(undefined, 'saved_newest')
  const { trigger: createFolder, isMutating } = useCreateFolder()
  const [showNewFolder, setShowNewFolder] = useState(false)

  const recentArticles = articles.slice(0, 6)

  async function handleCreateFolder(data: { name: string; icon: string; color_hex: string }) {
    try {
      await createFolder(data)
      mutateFolders()
      setShowNewFolder(false)
      toast('Folder created!')
    } catch {
      toast('Failed to create folder')
    }
  }

  return (
    <>
      <Header title="Home" />

      <div className="space-y-8 py-6">
        {/* Hero */}
        <section className="py-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your calm corner of the internet.
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Everything you saved, organized and ready to read.
          </p>
        </section>

        {/* Your Folders */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Your Folders
            </h2>
            <Link
              href="/settings"
              className="text-sm font-medium text-stash-blue hover:underline"
            >
              View All
            </Link>
          </div>

          {foldersLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {/* System folders as cards */}
              <div className="grid grid-cols-2 gap-3">
                {systemFolders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} variant="card" />
                ))}
              </div>

              {/* Custom folders as chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {customFolders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} variant="chip" />
                ))}
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3.5 py-1.5 text-sm font-medium text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700 active:scale-95 dark:border-gray-600 dark:text-gray-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </button>
              </div>
            </>
          )}
        </section>

        {/* Recently Saved */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
            Recently Saved
          </h2>

          {articlesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : recentArticles.length === 0 ? (
            <EmptyState
              title="No articles saved yet"
              description="Save your first article using the + button above"
            />
          ) : (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
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
