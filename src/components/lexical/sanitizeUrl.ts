const SAFE_PROTOCOLS = /^(https?:|mailto:|tel:)/i

/**
 * Normalizes user-entered link text into a safe URL: bare domains get an
 * https:// prefix, and unknown/unsafe protocols (javascript:, data:, …) are
 * neutralized to "about:blank".
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (trimmed === '') return ''
  if (SAFE_PROTOCOLS.test(trimmed)) {
    try {
      // Reject anything that doesn't parse as a real URL.
      return new URL(trimmed).toString()
    } catch {
      return 'about:blank'
    }
  }
  // No protocol: assume it's a bare web address.
  if (/^[^\s/]+\.[^\s/]/.test(trimmed)) {
    return `https://${trimmed}`
  }
  return 'about:blank'
}
