'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ListFilter, CheckSquare, FolderOpen } from 'lucide-react'
import { ArticleCard } from '@/components/articles/article-card'
import { BatchActionBar } from '@/components/articles/batch-action-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useArticles } from '@/lib/hooks/use-articles'
import { useFolders } from '@/lib/hooks/use-folders'
import { SORT_OPTIONS, type SortOption } from '@/types'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { useSWRConfig } from 'swr'

export default function FolderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [sort, setSort] = useState<SortOption>('saved_newest')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const { articles, isLoading, mutate } = useArticles(id, sort)
  const { folders } = useFolders()
  const { mutate: globalMutate } = useSWRConfig()

  const folder = folders.find((f) => f.id === id)
  const isSelecting = selectMode || selectedIds.size > 0

  function toggleSelect(articleId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(articleId)) next.delete(articleId)
      else next.add(articleId)
      return next
    })
  }

  async function handleDelete(articleId: string) {
    try {
      await fetch(`/api/articles/${articleId}`, { method: 'DELETE' })
      mutate()
      globalMutate((key: string) => typeof key === 'string' && key.startsWith('/api/folders'))
      toast('Article deleted')
    } catch {
      toast('Failed to delete')
    }
  }

  async function handleToggleRead(articleId: string) {
    const article = articles.find((a) => a.id === articleId)
    if (!article) return
    try {
      await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !article.is_read, read_at: article.is_read ? null : new Date().toISOString() }),
      })
      mutate()
    } catch {
      toast('Failed to update')
    }
  }

  async function handleBatchDelete() {
    const ids = Array.from(selectedIds)
    await Promise.all(ids.map((aid) => fetch(`/api/articles/${aid}`, { method: 'DELETE' })))
    setSelectedIds(new Set())
    setSelectMode(false)
    mutate()
    globalMutate((key: string) => typeof key === 'string' && key.startsWith('/api/folders'))
    toast(`${ids.length} articles deleted`)
  }

  async function handleBatchMarkRead() {
    const ids = Array.from(selectedIds)
    await Promise.all(
      ids.map((aid) =>
        fetch(`/api/articles/${aid}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true, read_at: new Date().toISOString() }),
        })
      )
    )
    setSelectedIds(new Set())
    setSelectMode(false)
    mutate()
    toast(`${ids.length} articles marked as read`)
  }

  return (
    <>
      {/* Folder header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {folder?.color_hex && (
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: folder.color_hex }}
                />
              )}
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {folder?.name || 'Folder'}
              </h1>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {articles.length}
              </span>
            </div>
          </div>
          <Button
            variant={isSelecting ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              if (isSelecting) {
                setSelectedIds(new Set())
                setSelectMode(false)
              } else {
                setSelectMode(true)
              }
            }}
          >
            <CheckSquare className="mr-1 h-4 w-4" />
            {isSelecting ? 'Cancel' : 'Select'}
          </Button>
        </div>
      </header>

      <div className="py-4">
        {/* Sort bar */}
        <div className="mb-4 flex items-center justify-end">
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="sm">
                <ListFilter className="mr-1 h-4 w-4" />
                Sort
              </Button>
            }
            items={SORT_OPTIONS.map((opt) => ({
              label: opt.label,
              onClick: () => setSort(opt.value),
            }))}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-12 w-12" />}
            title="No articles in this folder"
            description="Save an article and add it to this folder"
          />
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDelete={handleDelete}
                onToggleRead={handleToggleRead}
                selectable={isSelecting}
                selected={selectedIds.has(article.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </div>

      <BatchActionBar
        count={selectedIds.size}
        onMarkRead={handleBatchMarkRead}
        onMoveToFolder={() => {}}
        onDelete={handleBatchDelete}
        onCancel={() => { setSelectedIds(new Set()); setSelectMode(false) }}
      />
    </>
  )
}
