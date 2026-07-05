import { Clock } from 'lucide-react'

interface ReadTimeBadgeProps {
  minutes: number | null
}

export function ReadTimeBadge({ minutes }: ReadTimeBadgeProps) {
  if (!minutes) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
      <Clock className="h-3 w-3" />
      {minutes} min read
    </span>
  )
}
