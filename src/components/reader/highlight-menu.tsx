'use client'

import { useCreateHighlight } from '@/lib/hooks/use-highlights'
import { HIGHLIGHT_COLORS, type HighlightColor } from '@/types'
import { cn } from '@/lib/utils/cn'

interface HighlightMenuProps {
  articleId: string
  selectedText: string
  rect: DOMRect
  onClose: () => void
  onHighlightCreated?: () => void
}

export function HighlightMenu({
  articleId,
  selectedText,
  rect,
  onClose,
  onHighlightCreated,
}: HighlightMenuProps) {
  const { trigger } = useCreateHighlight()

  async function handleHighlight(color: HighlightColor) {
    await trigger({
      article_id: articleId,
      selected_text: selectedText,
      color_name: color,
    })
    onHighlightCreated?.()
    onClose()
  }

  const top = rect.top - 48
  const left = rect.left + rect.width / 2 - 72

  return (
    <div
      className="fixed z-50 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      style={{ top: `${Math.max(8, top)}px`, left: `${Math.max(8, left)}px` }}
    >
      {(Object.entries(HIGHLIGHT_COLORS) as [HighlightColor, typeof HIGHLIGHT_COLORS[HighlightColor]][]).map(
        ([key, color]) => (
          <button
            key={key}
            onClick={() => handleHighlight(key)}
            className="h-7 w-7 rounded-full border-2 border-transparent transition-transform hover:scale-110 hover:border-gray-400"
            style={{ backgroundColor: color.rgba }}
            title={color.name}
          />
        )
      )}
    </div>
  )
}
