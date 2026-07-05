import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Fetch the folder to check if it's a system folder
    const { data: existingFolder, error: fetchError } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch folder' },
        { status: 500 }
      )
    }

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    const allowedFields = ['name', 'icon', 'color_hex', 'sort_order'] as const
    const updates: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (field in body) {
        // Prevent updating name on system folders
        if (field === 'name' && existingFolder.is_system) {
          continue
        }
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const { data: folder, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update folder' },
        { status: 500 }
      )
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('PATCH /api/folders/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if this is a system folder
    const { data: folder, error: fetchError } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch folder' },
        { status: 500 }
      )
    }

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    if (folder.is_system) {
      return NextResponse.json(
        { error: 'Cannot delete system folders' },
        { status: 403 }
      )
    }

    // Find articles that are ONLY in this folder (not in any other folder)
    const { data: articleFoldersInThis } = await supabase
      .from('article_folders')
      .select('article_id')
      .eq('folder_id', id)
      .eq('user_id', user.id)

    if (articleFoldersInThis && articleFoldersInThis.length > 0) {
      const articleIds = articleFoldersInThis.map((af) => af.article_id)

      // For each article, check if it exists in any other folder
      const { data: unsortedFolder } = await supabase
        .from('folders')
        .select('id')
        .eq('user_id', user.id)
        .eq('system_identifier', 'unsorted')
        .single()

      if (unsortedFolder) {
        for (const articleId of articleIds) {
          const { count } = await supabase
            .from('article_folders')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId)
            .eq('user_id', user.id)
            .neq('folder_id', id)

          // If article is only in this folder, move it to Unsorted
          if (count === 0) {
            await supabase.from('article_folders').insert({
              user_id: user.id,
              article_id: articleId,
              folder_id: unsortedFolder.id,
            })
          }
        }
      }
    }

    // Delete the folder (article_folders rows will cascade or be handled by RLS)
    const { error: deleteError } = await supabase
      .from('article_folders')
      .delete()
      .eq('folder_id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to clean up article-folder associations' },
        { status: 500 }
      )
    }

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete folder' },
        { status: 500 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/folders/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
