import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all folders for the user
    const { data: folders, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      )
    }

    // Get article counts and unread counts for each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        // Total article count in this folder
        const { count: articleCount } = await supabase
          .from('article_folders')
          .select('*', { count: 'exact', head: true })
          .eq('folder_id', folder.id)
          .eq('user_id', user.id)

        // Get unread count by joining with articles
        const { data: articleFolders } = await supabase
          .from('article_folders')
          .select('article_id')
          .eq('folder_id', folder.id)
          .eq('user_id', user.id)

        let unreadCount = 0
        if (articleFolders && articleFolders.length > 0) {
          const articleIds = articleFolders.map((af) => af.article_id)
          const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .in('id', articleIds)
            .eq('is_read', false)

          unreadCount = count || 0
        }

        return {
          ...folder,
          article_count: articleCount || 0,
          unread_count: unreadCount,
        }
      })
    )

    return NextResponse.json({ folders: foldersWithCounts })
  } catch (error) {
    console.error('GET /api/folders error:', error)
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
    const { name, icon, color_hex } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      )
    }

    // Get max sort_order for the user's folders
    const { data: maxSortFolder } = await supabase
      .from('folders')
      .select('sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextSortOrder = (maxSortFolder?.sort_order ?? 0) + 1

    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: name.trim(),
        icon: icon || null,
        color_hex: color_hex || null,
        sort_order: nextSortOrder,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('POST /api/folders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
