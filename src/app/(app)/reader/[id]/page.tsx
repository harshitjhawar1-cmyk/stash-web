'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FolderPlus, Trash2, Share2, ExternalLink, Sparkles } from 'lucide-react'
import { ReaderContent } from '@/components/reader/reader-content'
import { ReaderToolbar } from '@/components/reader/reader-toolbar'
import { HighlightMenu } from '@/components/reader/highlight-menu'
import { CondenseSheet } from '@/components/reader/condense-sheet'
import { FolderTagsView } from '@/components/folders/folder-tags-view'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorRetry } from '@/components/common/error-retry'
import { useArticle, useDeleteArticle } from '@/lib/hooks/use-articles'
import { useHighlights } from '@/lib/hooks/use-highlights'
import { toast } from '@/components/ui/toast'
import type { ReaderTheme } from '@/types'

export default function ReaderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { article, isLoading, error, mutate: mutateArticle } = useArticle(id)
  const { highlights, mutate: mutateHighlights } = useHighlights(id)
  const { trigger: deleteArticle } = useDeleteArticle(id)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string>('')
  const [isParsingArticle, setIsParsingArticle] = useState(false)

  // Reader settings
  const [fontSize, setFontSize] = useState(18)
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans-serif'>('serif')
  const [theme, setTheme] = useState<ReaderTheme>('light')
  const [scrollPercentage, setScrollPercentage] = useState(0)

  // Highlight selection
  const [selection, setSelection] = useState<{
    text: string
    rect: DOMRect
  } | null>(null)

  // Condense
  const [showCondense, setShowCondense] = useState(false)

  // Parse article content if not already available
  useEffect(() => {
    if (!article || htmlContent) return
    if (article.html_content) {
      setHtmlContent(article.html_content)
      setTextContent(article.text_content || '')
      return
    }

    async function parseContent() {
      setIsParsingArticle(true)
      try {
        const res = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: article!.url }),
        })
        if (res.ok) {
          const data = await res.json()
          setHtmlContent(data.content || '<p>Could not extract article content.</p>')
          setTextContent(data.textContent || '')

          // Save parsed content to article
          await fetch(`/api/articles/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html_content: data.content,
              text_content: data.textContent,
              estimated_read_time_minutes: data.readTime,
              metadata_status: 'fetched',
            }),
          })
          mutateArticle()
        } else {
          setHtmlContent('<p>Failed to load article content. Try opening the original URL.</p>')
        }
      } catch {
        setHtmlContent('<p>Failed to load article content.</p>')
      } finally {
        setIsParsingArticle(false)
      }
    }
    parseContent()
  }, [article, id, htmlContent, mutateArticle])

  // Scroll tracking
  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      setScrollPercentage(Math.round((window.scrollY / scrollHeight) * 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTextSelected = useCallback((text: string, rect: DOMRect) => {
    setSelection({ text, rect })
  }, [])

  async function handleDelete() {
    try {
      await deleteArticle()
      toast('Article deleted')
      router.back()
    } catch {
      toast('Failed to delete')
    }
  }

  function handleShare() {
    if (navigator.share && article) {
      navigator.share({ title: article.title || '', url: article.url })
    } else if (article) {
      navigator.clipboard.writeText(article.url)
      toast('Link copied to clipboard')
    }
  }

  if (isLoading || isParsingArticle) {
    return (
      <div className="mx-auto max-w-reader px-4 py-16">
        <Skeleton className="mb-4 h-8 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-5/6" />
        <Skeleton className="mb-6 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-4/6" />
      </div>
    )
  }

  if (error || !article) {
    return <ErrorRetry message="Article not found" />
  }

  const folderIds = article.folder_ids ?? []

  return (
    <div className="min-h-screen" style={{ background: 'var(--reader-bg)' }}>
      <ReaderToolbar
        title={article.title || 'Untitled'}
        fontSize={fontSize}
        fontFamily={fontFamily}
        theme={theme}
        scrollPercentage={scrollPercentage}
        onFontSizeChange={setFontSize}
        onFontFamilyChange={setFontFamily}
        onThemeChange={setTheme}
        onCondense={() => setShowCondense(true)}
      />

      {/* Article header */}
      <div className="mx-auto max-w-reader px-4 pb-4 pt-8">
        <h1
          className="text-2xl font-bold leading-tight"
          style={{ color: 'var(--reader-text)' }}
        >
          {article.title}
        </h1>
        {article.domain && (
          <p className="mt-2 text-sm" style={{ color: 'var(--reader-secondary)' }}>
            {article.domain}
            {article.estimated_read_time_minutes &&
              ` · ${article.estimated_read_time_minutes} min read`}
          </p>
        )}

        {/* Folder tags */}
        {folderIds.length > 0 && (
          <div className="mt-3">
            <FolderTagsView articleId={id} currentFolderIds={folderIds} />
          </div>
        )}

        {/* Action bar */}
        <div className="mt-4 flex items-center gap-1 border-t border-gray-200 pt-3 dark:border-gray-700">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            Original
          </a>
          <button
            onClick={() => setShowCondense(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-stash-blue hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Sparkles className="h-4 w-4" />
            Condense
          </button>
          <div className="flex-1" />
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {htmlContent && (
        <ReaderContent
          articleId={id}
          htmlContent={htmlContent}
          theme={theme}
          fontSize={fontSize}
          fontFamily={fontFamily}
          highlights={highlights}
          onTextSelected={handleTextSelected}
        />
      )}

      {/* Highlight menu */}
      {selection && (
        <HighlightMenu
          articleId={id}
          selectedText={selection.text}
          rect={selection.rect}
          onClose={() => setSelection(null)}
          onHighlightCreated={() => mutateHighlights()}
        />
      )}

      {/* Condense sheet */}
      <CondenseSheet
        isOpen={showCondense}
        onClose={() => setShowCondense(false)}
        textContent={textContent}
      />
    </div>
  )
}
