import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { normalizeUrl } from '@/lib/services/url-normalizer'

function htmlResponse(message: string, success: boolean): NextResponse {
  const color = success ? '#22c55e' : '#ef4444'
  const icon = success ? '&#10003;' : '&#10007;'
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stash - ${success ? 'Saved' : 'Error'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .icon {
      font-size: 3rem;
      color: ${color};
      margin-bottom: 1rem;
    }
    .message {
      font-size: 1.125rem;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${icon}</div>
    <p class="message">${message}</p>
  </div>
  <script>
    setTimeout(function() { window.close(); }, 2000);
  </script>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const token = searchParams.get('token')

    if (!url) {
      return htmlResponse('No URL provided.', false)
    }

    if (!token) {
      return htmlResponse('Authentication token is required.', false)
    }

    // Create a Supabase client and verify the user via the provided token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op for bookmarklet
          },
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return htmlResponse('Invalid or expired authentication token.', false)
    }

    const canonicalUrl = normalizeUrl(url)

    // Check for duplicate
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('user_id', user.id)
      .eq('canonical_url', canonicalUrl)
      .maybeSingle()

    if (existing) {
      return htmlResponse('Article already saved!', true)
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

    if (insertError || !article) {
      return htmlResponse('Failed to save article. Please try again.', false)
    }

    // Add to Unsorted folder
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

    return htmlResponse('Article saved to Stash!', true)
  } catch (error) {
    console.error('GET /api/bookmarklet error:', error)
    return htmlResponse('An unexpected error occurred.', false)
  }
}
