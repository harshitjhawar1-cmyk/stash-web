'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Trash2, ExternalLink, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DomainLabel } from '@/components/common/domain-label'
import { ReadTimeBadge } from '@/components/common/read-time-badge'
import { FolderTagsView } from '@/components/folders/folder-tags-view'
import { ErrorRetry } from '@/components/common/error-retry'
import { useArticle } from '@/lib/hooks/use-articles'
import { formatFullDate } from '@/lib/utils/date-format'
import { toast } from '@/components/ui/toast'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { article, isLoading, error, mutate } = useArticle(id)

  async function handleToggleRead() {
    if (!article) return
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_read: !article.is_read,
        read_at: article.is_read ? null : new Date().toISOString(),
      }),
    })
    mutate()
  }

  async function handleDelete() {
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    toast('Article deleted')
    router.push('/')
  }

  if (isLoading) {
    return (
      <>
        <Header title="Article" />
        <div className="space-y-4 py-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </>
    )
  }

  if (error || !article) {
    return (
      <>
        <Header title="Article" />
        <ErrorRetry message="Article not found" onRetry={() => mutate()} />
      </>
    )
  }

  return (
    <>
      <Header title="Article" />

      <div className="py-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          {article.image_url && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image src={article.image_url} alt="" fill className="object-cover" />
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {article.title || article.url}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {article.domain && <DomainLabel domain={article.domain} />}
            <ReadTimeBadge minutes={article.estimated_read_time_minutes} />
            <Badge variant={article.is_read ? 'success' : 'default'}>
              {article.is_read ? 'Read' : 'Unread'}
            </Badge>
          </div>

          {article.snippet && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {article.snippet}
            </p>
          )}

          <div className="mt-4 text-xs text-gray-400">
            Saved {formatFullDate(article.saved_at)}
            {article.read_at && ` · Read ${formatFullDate(article.read_at)}`}
          </div>

          {/* Folder tags */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Folders
            </h3>
            <FolderTagsView articleId={article.id} currentFolderIds={[]} />
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Link href={`/reader/${article.id}`}>
              <Button>
                <BookOpen className="mr-1 h-4 w-4" />
                Read
              </Button>
            </Link>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="mr-1 h-4 w-4" />
                Open Original
              </Button>
            </a>
            <Button variant="outline" onClick={handleToggleRead}>
              {article.is_read ? 'Mark Unread' : 'Mark Read'}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
