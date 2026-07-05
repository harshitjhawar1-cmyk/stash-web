import type { Database } from './database'

// ---------------------------------------------------------------------------
// Row type aliases
// ---------------------------------------------------------------------------

export type Article = Database['public']['Tables']['articles']['Row'] & {
  folder_ids?: string[]
}

export type Folder = Database['public']['Tables']['folders']['Row'] & {
  articles?: Article[]
  articleCount?: number
  unreadCount?: number
}

export type Highlight = Database['public']['Tables']['highlights']['Row'] & {
  article?: Article
}

export type ReadingProgress = Database['public']['Tables']['reading_progress']['Row']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

export type ArticleFolder = Database['public']['Tables']['article_folders']['Row']

// ---------------------------------------------------------------------------
// Union / literal types
// ---------------------------------------------------------------------------

export type SortOption =
  | 'saved_newest'
  | 'saved_oldest'
  | 'title_asc'
  | 'title_desc'
  | 'domain_asc'
  | 'read_time_short'
  | 'read_time_long'

export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink'

export type ReaderTheme = 'light' | 'dark' | 'sepia'

export type MetadataStatus = 'pending' | 'fetching' | 'fetched' | 'failed'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const HIGHLIGHT_COLORS: Record<
  HighlightColor,
  { name: string; hex: string; rgba: string }
> = {
  yellow: {
    name: 'Yellow',
    hex: '#FDE68A',
    rgba: 'rgba(253, 230, 138, 0.4)',
  },
  blue: {
    name: 'Blue',
    hex: '#93C5FD',
    rgba: 'rgba(147, 197, 253, 0.4)',
  },
  green: {
    name: 'Green',
    hex: '#6EE7B7',
    rgba: 'rgba(110, 231, 183, 0.4)',
  },
  pink: {
    name: 'Pink',
    hex: '#F9A8D4',
    rgba: 'rgba(249, 168, 212, 0.4)',
  },
} as const

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'saved_newest', label: 'Newest first' },
  { value: 'saved_oldest', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'domain_asc', label: 'Domain A-Z' },
  { value: 'read_time_short', label: 'Shortest read' },
  { value: 'read_time_long', label: 'Longest read' },
] as const

// Re-export Database type for convenience
export type { Database } from './database'
