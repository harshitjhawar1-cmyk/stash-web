'use client'

import { useState, useEffect } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'

interface CondenseSheetProps {
  isOpen: boolean
  onClose: () => void
  textContent: string
}

export function CondenseSheet({ isOpen, onClose, textContent }: CondenseSheetProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || summary) return

    async function fetchSummary() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/condense', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textContent }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to generate summary')
        }
        const data = await res.json()
        setSummary(data.summary)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate summary')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSummary()
  }, [isOpen, textContent, summary])

  // Reset on close (summary is ephemeral, never persisted)
  function handleClose() {
    setSummary(null)
    setError(null)
    onClose()
  }

  return (
    <Sheet isOpen={isOpen} onClose={handleClose} title="AI Summary" side="bottom">
      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 animate-pulse text-stash-blue" />
              Generating summary...
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {summary && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div
              className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: summary.replace(/^[-•]\s*/gm, '').split('\n').filter(Boolean).map((line) => `<p>• ${line}</p>`).join(''),
              }}
            />
          </div>
        )}
      </div>
    </Sheet>
  )
}
