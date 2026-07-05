'use client'

import { useEffect, useRef } from 'react'
import { useReadingProgress } from '@/lib/hooks/use-reading-progress'
import { cn } from '@/lib/utils/cn'
import type { ReaderTheme, Highlight } from '@/types'

interface ReaderContentProps {
  articleId: string
  htmlContent: string
  theme: ReaderTheme
  fontSize: number
  fontFamily: 'serif' | 'sans-serif'
  highlights: Highlight[]
  onTextSelected?: (text: string, rect: DOMRect) => void
}

export function ReaderContent({
  articleId,
  htmlContent,
  theme,
  fontSize,
  fontFamily,
  highlights,
  onTextSelected,
}: ReaderContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { saveProgress } = useReadingProgress(articleId)

  // Scroll progress tracking
  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const percentage = Math.round((window.scrollY / scrollHeight) * 100)
      saveProgress(percentage, window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [saveProgress])

  // Text selection handling
  useEffect(() => {
    function handleMouseUp() {
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim().length > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          onTextSelected?.(selection.toString().trim(), rect)
        }
      }, 10)
    }
    const el = contentRef.current
    el?.addEventListener('mouseup', handleMouseUp)
    return () => el?.removeEventListener('mouseup', handleMouseUp)
  }, [onTextSelected])

  // Apply highlights to content
  useEffect(() => {
    if (!contentRef.current || highlights.length === 0) return
    // Re-apply highlight marks
    const el = contentRef.current
    highlights.forEach((h) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let node: Text | null
      while ((node = walker.nextNode() as Text | null)) {
        const idx = node.textContent?.indexOf(h.selected_text) ?? -1
        if (idx >= 0) {
          const range = document.createRange()
          range.setStart(node, idx)
          range.setEnd(node, idx + h.selected_text.length)
          const mark = document.createElement('mark')
          mark.setAttribute('data-highlight-id', h.id)
          mark.setAttribute('data-highlight-color', h.color_name)
          range.surroundContents(mark)
          break
        }
      }
    })
  }, [highlights, htmlContent])

  const themeClass = theme === 'dark' ? 'dark' : theme === 'sepia' ? 'sepia' : ''

  return (
    <div className={themeClass}>
      <div
        ref={contentRef}
        className={cn(
          'reader-content prose mx-auto max-w-reader px-4 py-8',
          fontFamily === 'serif' ? 'font-serif' : 'font-sans',
          'prose-headings:text-[var(--reader-text)]',
          'prose-p:text-[var(--reader-text)]',
          'prose-a:text-stash-blue',
          'prose-strong:text-[var(--reader-text)]',
          'prose-img:rounded-lg'
        )}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
