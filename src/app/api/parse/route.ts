import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseArticle } from '@/lib/services/parser'
import { estimateReadTime } from '@/lib/services/read-time'

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

    const parsed = await parseArticle(url)

    if (!parsed) {
      return NextResponse.json(
        { error: 'Failed to parse article content' },
        { status: 422 }
      )
    }

    const readTime = estimateReadTime(parsed.textContent)

    return NextResponse.json({
      title: parsed.title,
      content: parsed.content,
      textContent: parsed.textContent,
      excerpt: parsed.excerpt,
      byline: parsed.byline,
      readTime,
    })
  } catch (error) {
    console.error('POST /api/parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse article' },
      { status: 500 }
    )
  }
}
