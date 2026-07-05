'use client'

import { useState } from 'react'
import { Menu, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddUrlDialog } from '@/components/articles/add-url-dialog'
import Link from 'next/link'

interface HeaderProps {
  title: string
  onMenuToggle?: () => void
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const [showAddUrl, setShowAddUrl] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/search">
            <Button variant="ghost" size="icon" title="Search (Cmd+K)">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddUrl(true)}
            title="Add URL"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <AddUrlDialog isOpen={showAddUrl} onClose={() => setShowAddUrl(false)} />
    </>
  )
}
