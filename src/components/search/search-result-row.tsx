'use client'

import Link from 'next/link'
import { FileText, Highlighter } from 'lucide-react'
import { DomainLabel } from '@/components/common/domain-label'
import { formatRelativeDate } from '@/lib/utils/date-format'
import type { Article, Highlight } from '@/types'
import { HIGHLIGHT_COLORS } from '@/types'

export function ArticleSearchResult({ article }: { article: Article }) {
  return (
    <Link
      href={`/reader/${article.id}`}
      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {article.title || article.url}
        </h4>
        {article.snippet && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
            {article.snippet}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          {article.domain && <DomainLabel domain={article.domain} />}
          <span className="text-[10px] text-gray-400">
            {formatRelativeDate(article.saved_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function HighlightSearchResult({ highlight }: { highlight: Highlight }) {
  const color = HIGHLIGHT_COLORS[highlight.color_name as keyof typeof HIGHLIGHT_COLORS]

  return (
    <Link
      href={`/reader/${highlight.article_id}`}
      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
    >
      <Highlighter className="mt-0.5 h-4 w-4 shrink-0" style={{ color: color?.hex }} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          &ldquo;{highlight.selected_text}&rdquo;
        </p>
        {highlight.note && (
          <p className="mt-0.5 text-xs text-gray-500">{highlight.note}</p>
        )}
        {highlight.article && (
          <p className="mt-1 text-xs text-gray-400">
            from {highlight.article.title || 'Untitled'}
          </p>
        )}
      </div>
    </Link>
  )
}
