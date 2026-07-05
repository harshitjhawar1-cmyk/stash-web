'use client'

import { ArrowLeft, Type, Minus, Plus, Sun, Moon, BookText, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'
import type { ReaderTheme } from '@/types'

interface ReaderToolbarProps {
  title: string
  fontSize: number
  fontFamily: 'serif' | 'sans-serif'
  theme: ReaderTheme
  scrollPercentage: number
  onFontSizeChange: (size: number) => void
  onFontFamilyChange: (family: 'serif' | 'sans-serif') => void
  onThemeChange: (theme: ReaderTheme) => void
  onCondense: () => void
}

export function ReaderToolbar({
  title,
  fontSize,
  fontFamily,
  theme,
  scrollPercentage,
  onFontSizeChange,
  onFontFamilyChange,
  onThemeChange,
  onCondense,
}: ReaderToolbarProps) {
  const router = useRouter()

  const themes: { id: ReaderTheme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'sepia', label: 'Sepia', icon: <BookText className="h-4 w-4" /> },
  ]

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-stash-blue transition-all duration-300"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-2 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="hidden max-w-xs truncate text-sm text-gray-600 sm:block dark:text-gray-400">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Font size controls */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
            title="Decrease font size"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-xs text-gray-500">{fontSize}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFontSizeChange(Math.min(28, fontSize + 2))}
            title="Increase font size"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Font family toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onFontFamilyChange(fontFamily === 'serif' ? 'sans-serif' : 'serif')
            }
            title="Toggle font"
          >
            <Type className="h-4 w-4" />
          </Button>

          {/* Theme */}
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="icon" title="Reader theme">
                {themes.find((t) => t.id === theme)?.icon}
              </Button>
            }
            items={themes.map((t) => ({
              label: t.label,
              icon: t.icon,
              onClick: () => onThemeChange(t.id),
            }))}
          />

          {/* Condense */}
          <Button variant="ghost" size="icon" onClick={onCondense} title="AI Summary">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </header>
    </>
  )
}
