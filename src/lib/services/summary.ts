import OpenAI from 'openai'

export async function generateSummary(text: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not configured')
  }

  const client = new OpenAI({ apiKey })

  // Truncate text to first 4000 words
  const words = text.split(/\s+/)
  const truncatedText = words.slice(0, 4000).join(' ')

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that summarizes articles. Provide a concise summary in 3-5 bullet points. Each bullet should capture a key insight or takeaway. Be specific, not generic.',
      },
      {
        role: 'user',
        content: `Summarize this article:\n\n${truncatedText}`,
      },
    ],
    max_tokens: 500,
  })

  const summary = response.choices[0]?.message?.content
  if (!summary) {
    throw new Error('No summary generated from OpenAI response')
  }

  return summary
}
