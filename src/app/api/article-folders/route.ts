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
    const { article_id, folder_id } = body

    if (!article_id || !folder_id) {
      return NextResponse.json(
        { error: 'article_id and folder_id are required' },
        { status: 400 }
      )
    }

    // Insert the article-folder association
    const { data: articleFolder, error } = await supabase
      .from('article_folders')
      .insert({
        user_id: user.id,
        article_id,
        folder_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to add article to folder' },
        { status: 500 }
      )
    }

    // If the target folder is NOT the Unsorted folder, remove from Unsorted
    const { data: targetFolder } = await supabase
      .from('folders')
      .select('system_identifier')
      .eq('id', folder_id)
      .eq('user_id', user.id)
      .single()

    if (targetFolder && targetFolder.system_identifier !== 'unsorted') {
      // Find the Unsorted folder
      const { data: unsortedFolder } = await supabase
        .from('folders')
        .select('id')
        .eq('user_id', user.id)
        .eq('system_identifier', 'unsorted')
        .single()

      if (unsortedFolder) {
        await supabase
          .from('article_folders')
          .delete()
          .eq('article_id', article_id)
          .eq('folder_id', unsortedFolder.id)
          .eq('user_id', user.id)
      }
    }

    return NextResponse.json(articleFolder, { status: 201 })
  } catch (error) {
    console.error('POST /api/article-folders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const { article_id, folder_id } = body

    if (!article_id || !folder_id) {
      return NextResponse.json(
        { error: 'article_id and folder_id are required' },
        { status: 400 }
      )
    }

    // Delete the article-folder association
    const { error } = await supabase
      .from('article_folders')
      .delete()
      .eq('article_id', article_id)
      .eq('folder_id', folder_id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to remove article from folder' },
        { status: 500 }
      )
    }

    // Check if article is still in any folder
    const { count } = await supabase
      .from('article_folders')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', article_id)
      .eq('user_id', user.id)

    // If article is not in any folder, add it to Unsorted
    if (count === 0) {
      const { data: unsortedFolder } = await supabase
        .from('folders')
        .select('id')
        .eq('user_id', user.id)
        .eq('system_identifier', 'unsorted')
        .single()

      if (unsortedFolder) {
        await supabase.from('article_folders').insert({
          user_id: user.id,
          article_id,
          folder_id: unsortedFolder.id,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/article-folders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
