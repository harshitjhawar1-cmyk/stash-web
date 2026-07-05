'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DomainLabelProps {
  domain: string
  className?: string
}

export function DomainLabel({ domain, className }: DomainLabelProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400', className)}>
      {imgError ? (
        <Globe className="h-3.5 w-3.5" />
      ) : (
        <Image
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
          alt=""
          width={14}
          height={14}
          className="rounded-sm"
          onError={() => setImgError(true)}
        />
      )}
      <span className="truncate">{domain}</span>
    </span>
  )
}
