import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

export interface ParsedArticle {
  title: string
  content: string
  textContent: string
  excerpt: string
  byline: string | null
  length: number
}

export async function parseArticle(
  url: string,
  html?: string
): Promise<ParsedArticle | null> {
  try {
    let articleHtml = html

    if (!articleHtml) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      })

      clearTimeout(timeoutId)
      articleHtml = await response.text()
    }

    const dom = new JSDOM(articleHtml, { url })
    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article) {
      return null
    }

    return {
      title: article.title ?? '',
      content: article.content ?? '',
      textContent: article.textContent ?? '',
      excerpt: article.excerpt ?? '',
      byline: article.byline ?? null,
      length: article.length ?? 0,
    }
  } catch {
    return null
  }
}
