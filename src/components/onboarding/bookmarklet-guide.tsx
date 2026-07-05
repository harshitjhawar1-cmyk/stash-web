'use client'

import { useState } from 'react'
import { BookOpen, GripVertical, ExternalLink } from 'lucide-react'
import { useUser } from '@/lib/hooks/use-user'
import { generateBookmarkletCode } from '@/lib/utils/bookmarklet'

export function BookmarkletGuide() {
  const { user } = useUser()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  // In production, this would use a proper API token
  const bookmarkletCode = user
    ? generateBookmarkletCode(appUrl, user.id)
    : ''

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        <BookOpen className="h-5 w-5 text-stash-blue" />
        Save from Any Website
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Drag the button below to your bookmark bar to save articles with one click.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <a
          href={bookmarkletCode}
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2 rounded-lg bg-stash-blue px-4 py-2 text-sm font-medium text-white shadow-sm"
          title="Drag this to your bookmark bar"
        >
          <GripVertical className="h-4 w-4" />
          Save to Stash
        </a>
        <span className="text-xs text-gray-400">&larr; Drag this to your bookmark bar</span>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          How to use:
        </h4>
        <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>Show your browser&apos;s bookmark bar (Cmd+Shift+B)</li>
          <li>Drag the &quot;Save to Stash&quot; button above to your bookmark bar</li>
          <li>Visit any article you want to save</li>
          <li>Click the bookmarklet in your bookmark bar</li>
          <li>The article will be saved to your Stash!</li>
        </ol>
      </div>
    </div>
  )
}
