const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'fbclid',
  'gclid',
  'msclkid',
  'mc_cid',
  'mc_eid',
  'ref',
  's',
  'share',
  'si',
  'igshid',
  'ncid',
])

export function normalizeUrl(urlString: string): string {
  try {
    const url = new URL(urlString)

    // Lowercase scheme and hostname
    url.protocol = url.protocol.toLowerCase()
    url.hostname = url.hostname.toLowerCase()

    // Remove 'www.' prefix from hostname
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
    }

    // Strip tracking parameters and sort remaining ones alphabetically
    const params = new URLSearchParams(url.searchParams)
    const cleanedParams = new URLSearchParams()

    const sortedKeys = Array.from(params.keys())
      .filter((key) => !TRACKING_PARAMS.has(key.toLowerCase()))
      .sort()

    for (const key of sortedKeys) {
      const value = params.get(key)
      if (value !== null) {
        cleanedParams.set(key, value)
      }
    }

    url.search = cleanedParams.toString() ? `?${cleanedParams.toString()}` : ''

    // Remove fragment/hash
    url.hash = ''

    // Remove trailing slash from pathname
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }

    return url.toString()
  } catch {
    return urlString
  }
}
