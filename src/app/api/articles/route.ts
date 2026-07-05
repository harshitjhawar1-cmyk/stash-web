import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeUrl } from '@/lib/services/url-normalizer'

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
    const folderId = searchParams.get('folder_id')
    const isRead = searchParams.get('is_read')
    const sort = searchParams.get('sort') || 'saved_newest'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    // Filter by folder via article_folders join
    if (folderId) {
      const { data: articleFolders, error: afError } = await supabase
        .from('article_folders')
        .select('article_id')
        .eq('folder_id', folderId)
        .eq('user_id', user.id)

      if (afError) {
        return NextResponse.json(
          { error: 'Failed to filter by folder' },
          { status: 500 }
        )
      }

      const articleIds = articleFolders.map((af) => af.article_id)
      if (articleIds.length === 0) {
        return NextResponse.json({ articles: [], count: 0 })
      }
      query = query.in('id', articleIds)
    }

    // Filter by read status
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      query = query.eq('is_read', isRead === 'true')
    }

    // Apply sort
    switch (sort) {
      case 'saved_oldest':
        query = query.order('saved_at', { ascending: true })
        break
      case 'title_asc':
        query = query.order('title', { ascending: true, nullsFirst: false })
        break
      case 'title_desc':
        query = query.order('title', { ascending: false, nullsFirst: false })
        break
      case 'domain_asc':
        query = query.order('domain', { ascending: true, nullsFirst: false })
        break
      case 'read_time_short':
        query = query.order('estimated_read_time_minutes', {
          ascending: true,
          nullsFirst: false,
        })
        break
      case 'read_time_long':
        query = query.order('estimated_read_time_minutes', {
          ascending: false,
          nullsFirst: false,
        })
        break
      case 'saved_newest':
      default:
        query = query.order('saved_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: articles, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      )
    }

    return NextResponse.json({ articles, count })
  } catch (error) {
    console.error('GET /api/articles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const canonicalUrl = normalizeUrl(url)

    // Check for duplicate by canonical_url
    const { data: existing } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .eq('canonical_url', canonicalUrl)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Article already saved', article: existing },
        { status: 409 }
      )
    }

    // Insert the article
    const { data: article, error: insertError } = await supabase
      .from('articles')
      .insert({
        user_id: user.id,
        url,
        canonical_url: canonicalUrl,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      )
    }

    // Find the Unsorted folder and add the article to it
    const { data: unsortedFolder } = await supabase
      .from('folders')
      .select('id')
      .eq('user_id', user.id)
      .eq('system_identifier', 'unsorted')
      .single()

    if (unsortedFolder) {
      await supabase.from('article_folders').insert({
        user_id: user.id,
        article_id: article.id,
        folder_id: unsortedFolder.id,
      })
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('POST /api/articles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
