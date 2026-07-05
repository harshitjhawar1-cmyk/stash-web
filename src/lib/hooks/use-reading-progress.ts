'use client'

import { useRef, useCallback, useEffect } from 'react'

export function useReadingProgress(articleId: string) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const saveProgress = useCallback(
    (scrollPercentage: number, scrollYOffset: number) => {
      const now = Date.now()
      if (now - lastSavedRef.current < 2000) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          saveProgress(scrollPercentage, scrollYOffset)
        }, 2000)
        return
      }

      lastSavedRef.current = now

      fetch('/api/reading-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          scroll_percentage: scrollPercentage,
          scroll_y_offset: scrollYOffset,
        }),
      }).catch(() => {})
    },
    [articleId]
  )

  return { saveProgress }
}
