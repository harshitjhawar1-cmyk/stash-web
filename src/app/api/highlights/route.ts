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
    const articleId = searchParams.get('article_id')

    let query = supabase
      .from('highlights')
      .select('*, articles(title, domain)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (articleId) {
      query = query.eq('article_id', articleId)
    }

    const { data: highlights, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch highlights' },
        { status: 500 }
      )
    }

    return NextResponse.json({ highlights })
  } catch (error) {
    console.error('GET /api/highlights error:', error)
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
    const { article_id, selected_text, color_name, note, start_offset, end_offset } = body

    if (!article_id || !selected_text) {
      return NextResponse.json(
        { error: 'article_id and selected_text are required' },
        { status: 400 }
      )
    }

    if (start_offset === undefined || end_offset === undefined) {
      return NextResponse.json(
        { error: 'start_offset and end_offset are required' },
        { status: 400 }
      )
    }

    const { data: highlight, error } = await supabase
      .from('highlights')
      .insert({
        user_id: user.id,
        article_id,
        selected_text,
        color_name: color_name || 'yellow',
        note: note || null,
        start_offset,
        end_offset,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create highlight' },
        { status: 500 }
      )
    }

    return NextResponse.json(highlight, { status: 201 })
  } catch (error) {
    console.error('POST /api/highlights error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
