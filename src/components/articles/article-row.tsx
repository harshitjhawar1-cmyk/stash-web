'use client'

import Link from 'next/link'
import { MoreHorizontal, BookOpen, Trash2, FolderPlus, CheckCircle } from 'lucide-react'
import { DomainLabel } from '@/components/common/domain-label'
import { ReadTimeBadge } from '@/components/common/read-time-badge'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { formatRelativeDate } from '@/lib/utils/date-format'
import { cn } from '@/lib/utils/cn'
import type { Article } from '@/types'

interface ArticleRowProps {
  article: Article
  onDelete?: (id: string) => void
  onToggleRead?: (id: string) => void
  onMoveToFolder?: (id: string) => void
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

export function ArticleRow({
  article,
  onDelete,
  onToggleRead,
  onMoveToFolder,
  selectable,
  selected,
  onSelect,
}: ArticleRowProps) {
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
        'group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900',
        selected && 'border-stash-blue bg-stash-blue/5',
        article.is_read && 'opacity-60'
      )}
    >
      {selectable && (
        <button onClick={() => onSelect?.(article.id)} className="shrink-0">
          <CheckCircle
            className={cn(
              'h-5 w-5',
              selected ? 'text-stash-blue fill-stash-blue' : 'text-gray-300'
            )}
          />
        </button>
      )}

      <Link href={`/reader/${article.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {article.title || article.url}
          </h3>
          <div className="mt-0.5 flex items-center gap-3">
            {article.domain && <DomainLabel domain={article.domain} />}
            <ReadTimeBadge minutes={article.estimated_read_time_minutes} />
            <span className="text-[10px] text-gray-400">
              {formatRelativeDate(article.saved_at)}
            </span>
          </div>
        </div>
      </Link>

      {menuItems.length > 0 && (
        <DropdownMenu
          trigger={
            <button className="shrink-0 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-800">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
          items={menuItems}
        />
      )}
    </div>
  )
}
