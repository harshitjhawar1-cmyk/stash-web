import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorRetryProps {
  message?: string
  onRetry?: () => void
}

export function ErrorRetry({
  message = 'Something went wrong',
  onRetry,
}: ErrorRetryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
