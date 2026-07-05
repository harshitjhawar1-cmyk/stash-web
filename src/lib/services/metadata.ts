import * as cheerio from 'cheerio'

export interface ExtractedMetadata {
  title: string | null
  description: string | null
  imageUrl: string | null
  domain: string | null
  siteName: string | null
}

export async function extractMetadata(url: string): Promise<ExtractedMetadata> {
  const result: ExtractedMetadata = {
    title: null,
    description: null,
    imageUrl: null,
    domain: null,
    siteName: null,
  }

  try {
    const parsedUrl = new URL(url)
    result.domain = parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    // If URL parsing fails, domain stays null
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

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

    const html = await response.text()
    const $ = cheerio.load(html)

    // Title: og:title → twitter:title → <title> tag
    result.title =
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('meta[name="twitter:title"]').attr('content')?.trim() ||
      $('title').text().trim() ||
      null

    // Description: og:description → twitter:description → meta description
    result.description =
      $('meta[property="og:description"]').attr('content')?.trim() ||
      $('meta[name="twitter:description"]').attr('content')?.trim() ||
      $('meta[name="description"]').attr('content')?.trim() ||
      null

    // Image: og:image → twitter:image (resolve relative URLs)
    const rawImageUrl =
      $('meta[property="og:image"]').attr('content')?.trim() ||
      $('meta[name="twitter:image"]').attr('content')?.trim() ||
      null

    if (rawImageUrl) {
      try {
        result.imageUrl = new URL(rawImageUrl, url).href
      } catch {
        result.imageUrl = rawImageUrl
      }
    }

    // Site name
    result.siteName =
      $('meta[property="og:site_name"]').attr('content')?.trim() || null
  } catch {
    // Return whatever partial data we have (at minimum, the domain)
  }

  return result
}
