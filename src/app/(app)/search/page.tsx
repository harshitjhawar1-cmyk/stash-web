'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { SearchInput } from '@/components/search/search-input'
import { ArticleSearchResult, HighlightSearchResult } from '@/components/search/search-result-row'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearch } from '@/lib/hooks/use-search'
import { Search as SearchIcon } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const { results, isLoading } = useSearch(query, tab as 'all' | 'articles' | 'highlights')

  const tabs = [
    { id: 'all', label: 'All', count: results.articles.length + results.highlights.length },
    { id: 'articles', label: 'Articles', count: results.articles.length },
    { id: 'highlights', label: 'Highlights', count: results.highlights.length },
  ]

  const hasResults = results.articles.length > 0 || results.highlights.length > 0

  return (
    <>
      <Header title="Search" />

      <div className="py-4">
        <SearchInput value={query} onChange={setQuery} autoFocus />

        {query.length >= 2 && (
          <div className="mt-4">
            <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

            <div className="mt-4">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : !hasResults ? (
                <EmptyState
                  icon={<SearchIcon className="h-10 w-10" />}
                  title="No results found"
                  description={`No matches for "${query}"`}
                />
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(tab === 'all' || tab === 'articles') &&
                    results.articles.map((article) => (
                      <ArticleSearchResult key={article.id} article={article} />
                    ))}
                  {(tab === 'all' || tab === 'highlights') &&
                    results.highlights.map((highlight) => (
                      <HighlightSearchResult key={highlight.id} highlight={highlight} />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {query.length < 2 && (
          <EmptyState
            icon={<SearchIcon className="h-10 w-10" />}
            title="Search your Stash"
            description="Find articles by title, domain, or search through your highlights"
          />
        )}
      </div>
    </>
  )
}
