'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Highlighter, Search, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/highlights', icon: Highlighter, label: 'Highlights' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/settings', icon: Bookmark, label: 'Saved' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95 md:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1',
                isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
