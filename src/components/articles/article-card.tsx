'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MoreHorizontal, BookOpen, Trash2, FolderPlus, CheckCircle } from 'lucide-react'
import { DomainLabel } from '@/components/common/domain-label'
import { ReadTimeBadge } from '@/components/common/read-time-badge'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { formatRelativeDate } from '@/lib/utils/date-format'
import { cn } from '@/lib/utils/cn'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  onDelete?: (id: string) => void
  onToggleRead?: (id: string) => void
  onMoveToFolder?: (id: string) => void
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

export function ArticleCard({
  article,
  onDelete,
  onToggleRead,
  onMoveToFolder,
  selectable,
  selected,
  onSelect,
}: ArticleCardProps) {
  const menuItems = [
    ...(onToggleRead
      ? [{ label: article.is_read ? 'Mark as unread' : 'Mark as read', icon: <BookOpen className="h-4 w-4" />, onClick: () => onToggleRead(article.id) }]
      : []),
    ...(onMoveToFolder
      ? [{ label: 'Move to folder', icon: <FolderPlus className="h-4 w-4" />, onClick: () => onMoveToFolder(article.id) }]
      : []),
    ...(onDelete
      ? [{ label: '', onClick: () => {}, divider: true }, { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: () => onDelete(article.id), danger: true }]
      : []),
  ]

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 transition-all hover:shadow-md active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900',
        selected && 'ring-2 ring-stash-blue',
        article.is_read && 'opacity-60'
      )}
    >
      {selectable && (
        <button
          onClick={() => onSelect?.(article.id)}
          className="absolute left-2 top-2 z-10"
        >
          <CheckCircle
            className={cn(
              'h-5 w-5',
              selected ? 'text-stash-blue fill-stash-blue' : 'text-gray-300'
            )}
          />
        </button>
      )}

      {/* Text content - left side */}
      <Link href={`/reader/${article.id}`} className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {article.title || article.url}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          {article.domain && <DomainLabel domain={article.domain} />}
          <ReadTimeBadge minutes={article.estimated_read_time_minutes} />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Saved {formatRelativeDate(article.saved_at)}
        </p>
      </Link>

      {/* Thumbnail - right side */}
      {article.image_url && (
        <Link href={`/reader/${article.id}`} className="shrink-0">
          <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            <Image
              src={article.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="72px"
            />
          </div>
        </Link>
      )}

      {/* More menu */}
      {menuItems.length > 0 && (
        <div className="absolute right-2 top-2">
          <DropdownMenu
            trigger={
              <button className="rounded-lg p-1 text-gray-300 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-500 group-hover:opacity-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
            items={menuItems}
          />
        </div>
      )}
    </div>
  )
}
