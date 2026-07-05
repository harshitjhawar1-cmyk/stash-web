'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Inbox, Bookmark, FolderPlus, LogOut, Plus } from 'lucide-react'
import { useFolders } from '@/lib/hooks/use-folders'
import { useUser, useSignOut } from '@/lib/hooks/use-user'
import { cn } from '@/lib/utils/cn'
import type { Folder } from '@/types'

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  unsorted: <Inbox className="h-4 w-4" />,
  to_read: <Bookmark className="h-4 w-4" />,
}

export function Sidebar() {
  const pathname = usePathname()
  const { systemFolders, customFolders } = useFolders()
  const { user } = useUser()
  const { signOut } = useSignOut()

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4">
        <BookOpen className="h-6 w-6 text-stash-blue" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">Stash</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* System Folders */}
        <div className="space-y-0.5">
          {systemFolders.map((folder) => (
            <FolderLink
              key={folder.id}
              folder={folder}
              icon={SYSTEM_ICONS[folder.system_identifier || ''] || <Inbox className="h-4 w-4" />}
              isActive={pathname === `/folder/${folder.id}`}
            />
          ))}
        </div>

        {/* Custom Folders */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Folders
            </span>
            <Link
              href="/settings"
              className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            >
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-1 space-y-0.5">
            {customFolders.map((folder) => (
              <FolderLink
                key={folder.id}
                folder={folder}
                icon={
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: folder.color_hex || '#007AFF' }}
                  />
                }
                isActive={pathname === `/folder/${folder.id}`}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </span>
          <button
            onClick={signOut}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function FolderLink({
  folder,
  icon,
  isActive,
}: {
  folder: Folder
  icon: React.ReactNode
  isActive: boolean
}) {
  return (
    <Link
      href={`/folder/${folder.id}`}
      className={cn(
        'flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-stash-blue/10 text-stash-blue font-medium'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {folder.name}
      </span>
      {(folder.unreadCount ?? 0) > 0 && (
        <span className="text-xs text-gray-400">{folder.unreadCount}</span>
      )}
    </Link>
  )
}
