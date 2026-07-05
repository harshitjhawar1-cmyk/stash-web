import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const searchTerm = query.trim()
    // Format for tsquery: join words with & for AND matching
    const tsQueryTerm = searchTerm
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(' & ')

    let articles: unknown[] = []
    let highlights: unknown[] = []

    // Search articles
    if (type === 'articles' || type === 'all') {
      // Try full-text search first using the fts column
      const { data: ftsArticles, error: ftsError } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user.id)
        .textSearch('fts', tsQueryTerm)
        .order('saved_at', { ascending: false })
        .limit(50)

      if (!ftsError && ftsArticles && ftsArticles.length > 0) {
        articles = ftsArticles
      } else {
        // Fallback to ILIKE on title and domain
        const ilikePattern = `%${searchTerm}%`
        const { data: ilikeArticles, error: ilikeError } = await supabase
          .from('articles')
          .select('*')
          .eq('user_id', user.id)
          .or(`title.ilike.${ilikePattern},domain.ilike.${ilikePattern}`)
          .order('saved_at', { ascending: false })
          .limit(50)

        if (!ilikeError && ilikeArticles) {
          articles = ilikeArticles
        }
      }
    }

    // Search highlights
    if (type === 'highlights' || type === 'all') {
      // Try full-text search on highlights fts column
      const { data: ftsHighlights, error: ftsError } = await supabase
        .from('highlights')
        .select('*, articles(title, domain)')
        .eq('user_id', user.id)
        .textSearch('fts', tsQueryTerm)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!ftsError && ftsHighlights && ftsHighlights.length > 0) {
        highlights = ftsHighlights
      } else {
        // Fallback to ILIKE on selected_text and note
        const ilikePattern = `%${searchTerm}%`
        const { data: ilikeHighlights, error: ilikeError } = await supabase
          .from('highlights')
          .select('*, articles(title, domain)')
          .eq('user_id', user.id)
          .or(
            `selected_text.ilike.${ilikePattern},note.ilike.${ilikePattern}`
          )
          .order('created_at', { ascending: false })
          .limit(50)

        if (!ilikeError && ilikeHighlights) {
          highlights = ilikeHighlights
        }
      }
    }

    return NextResponse.json({ articles, highlights })
  } catch (error) {
    console.error('GET /api/search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
