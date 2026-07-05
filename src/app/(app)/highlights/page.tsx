'use client'

import { Header } from '@/components/layout/header'
import { HighlightRow } from '@/components/highlights/highlight-row'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useHighlights, useUpdateHighlight, useDeleteHighlight } from '@/lib/hooks/use-highlights'
import { Highlighter } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import type { Highlight } from '@/types'

export default function HighlightsPage() {
  const { highlights, isLoading, mutate } = useHighlights()

  // Group highlights by article
  const grouped = highlights.reduce<Record<string, Highlight[]>>((acc, h) => {
    const key = h.article_id
    if (!acc[key]) acc[key] = []
    acc[key].push(h)
    return acc
  }, {})

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/highlights/${id}`, { method: 'DELETE' })
      mutate()
      toast('Highlight deleted')
    } catch {
      toast('Failed to delete')
    }
  }

  async function handleEditNote(id: string, note: string) {
    try {
      await fetch(`/api/highlights/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      mutate()
    } catch {
      toast('Failed to update note')
    }
  }

  return (
    <>
      <Header title="Highlights" />

      <div className="py-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : highlights.length === 0 ? (
          <EmptyState
            icon={<Highlighter className="h-12 w-12" />}
            title="No highlights yet"
            description="Select text while reading an article to create highlights"
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([articleId, articleHighlights]) => (
              <div key={articleId}>
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {articleHighlights[0]?.article?.title || 'Untitled Article'}
                </h3>
                <div className="space-y-2">
                  {articleHighlights.map((highlight) => (
                    <HighlightRow
                      key={highlight.id}
                      highlight={highlight}
                      onDelete={handleDelete}
                      onEditNote={handleEditNote}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
