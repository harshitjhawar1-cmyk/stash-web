import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const { article_id, scroll_percentage, scroll_y_offset } = body

    if (!article_id) {
      return NextResponse.json(
        { error: 'article_id is required' },
        { status: 400 }
      )
    }

    if (scroll_percentage === undefined || scroll_y_offset === undefined) {
      return NextResponse.json(
        { error: 'scroll_percentage and scroll_y_offset are required' },
        { status: 400 }
      )
    }

    // Upsert reading progress
    const { data: progress, error } = await supabase
      .from('reading_progress')
      .upsert(
        {
          user_id: user.id,
          article_id,
          scroll_percentage,
          scroll_y_offset,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,article_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update reading progress' },
        { status: 500 }
      )
    }

    // If scroll_percentage >= 80, mark article as read
    if (scroll_percentage >= 80) {
      await supabase
        .from('articles')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', article_id)
        .eq('user_id', user.id)
        .eq('is_read', false) // Only update if not already read
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('POST /api/reading-progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
