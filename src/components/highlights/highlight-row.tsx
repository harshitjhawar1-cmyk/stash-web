'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Edit3 } from 'lucide-react'
import { HIGHLIGHT_COLORS, type Highlight } from '@/types'
import { formatRelativeDate } from '@/lib/utils/date-format'

interface HighlightRowProps {
  highlight: Highlight
  onDelete?: (id: string) => void
  onEditNote?: (id: string, note: string) => void
}

export function HighlightRow({ highlight, onDelete, onEditNote }: HighlightRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [note, setNote] = useState(highlight.note || '')
  const color = HIGHLIGHT_COLORS[highlight.color_name as keyof typeof HIGHLIGHT_COLORS]

  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div
        className="rounded px-2 py-1 text-sm"
        style={{ backgroundColor: color?.rgba || 'rgba(255,230,0,0.35)' }}
      >
        &ldquo;{highlight.selected_text}&rdquo;
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
            rows={2}
            placeholder="Add a note..."
            autoFocus
          />
          <div className="mt-1 flex gap-1">
            <button
              onClick={() => {
                onEditNote?.(highlight.id, note)
                setIsEditing(false)
              }}
              className="rounded bg-stash-blue px-2 py-0.5 text-xs text-white"
            >
              Save
            </button>
            <button
              onClick={() => {
                setNote(highlight.note || '')
                setIsEditing(false)
              }}
              className="rounded px-2 py-0.5 text-xs text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        highlight.note && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {highlight.note}
          </p>
        )
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {highlight.article && (
            <Link
              href={`/reader/${highlight.article_id}`}
              className="text-xs text-stash-blue hover:underline"
            >
              {highlight.article.title || 'Untitled'}
            </Link>
          )}
          <span className="text-[10px] text-gray-400">
            {formatRelativeDate(highlight.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(highlight.id)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
