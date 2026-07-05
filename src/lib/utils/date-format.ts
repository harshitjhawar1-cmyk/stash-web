import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isYesterday,
  isSameYear,
  format,
} from 'date-fns'

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()

  const minutesAgo = differenceInMinutes(now, d)
  if (minutesAgo < 1) {
    return 'Just now'
  }

  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`
  }

  const hoursAgo = differenceInHours(now, d)
  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`
  }

  if (isYesterday(d)) {
    return 'Yesterday'
  }

  const daysAgo = differenceInDays(now, d)
  if (daysAgo < 7) {
    return `${daysAgo} days ago`
  }

  if (isSameYear(d, now)) {
    return format(d, 'MMM d')
  }

  return format(d, 'MMM d, yyyy')
}

export function formatFullDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, "MMMM d, yyyy 'at' h:mm a")
}
