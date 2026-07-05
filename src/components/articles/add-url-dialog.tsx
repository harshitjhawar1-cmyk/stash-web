'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateArticle } from '@/lib/hooks/use-articles'
import { toast } from '@/components/ui/toast'
import { useSWRConfig } from 'swr'

interface AddUrlDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddUrlDialog({ isOpen, onClose }: AddUrlDialogProps) {
  const [url, setUrl] = useState('')
  const { trigger, isMutating } = useCreateArticle()
  const { mutate } = useSWRConfig()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    try {
      await trigger({ url: url.trim() })
      toast('Article saved!')
      mutate((key: string) => typeof key === 'string' && key.startsWith('/api/'), undefined, { revalidate: true })
      setUrl('')
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save article'
      toast(message)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Save a URL">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="URL"
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
          required
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isMutating}>
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
