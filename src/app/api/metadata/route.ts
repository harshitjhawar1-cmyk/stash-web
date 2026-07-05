import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractMetadata } from '@/lib/services/metadata'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const metadata = await extractMetadata(url)

    return NextResponse.json({
      title: metadata.title,
      description: metadata.description,
      imageUrl: metadata.imageUrl,
      domain: metadata.domain,
      siteName: metadata.siteName,
    })
  } catch (error) {
    console.error('POST /api/metadata error:', error)
    return NextResponse.json(
      { error: 'Failed to extract metadata' },
      { status: 500 }
    )
  }
}
