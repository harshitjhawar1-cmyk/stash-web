import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSummary } from '@/lib/services/summary'

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
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    const summary = await generateSummary(text)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('POST /api/condense error:', error)

    // Handle missing API key specifically
    if (
      error instanceof Error &&
      error.message.includes('OPENAI_API_KEY')
    ) {
      return NextResponse.json(
        { error: 'AI summary service is not configured' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
