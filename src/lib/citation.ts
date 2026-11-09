import type { Reference } from '../types'

// DOI and URL values come from data files, so they are checked before they
// are ever used as a link target.
const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/

export function doiUrl(doi: string): string | null {
  return DOI_PATTERN.test(doi) ? `https://doi.org/${encodeURI(doi)}` : null
}

export function httpsUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.href : null
  } catch {
    return null
  }
}

/** The safe link for a reference, or null if it has none. */
export function linkFor(ref: Reference): string | null {
  if (ref.doi) return doiUrl(ref.doi)
  if (ref.url) return httpsUrl(ref.url)
  return null
}

/** Plain-text citation in a simple author-year style, for copying into a thesis. */
export function formatCitation(ref: Reference): string {
  const parts = [`${ref.authors} (${ref.year}). ${ref.title}.`]
  if (ref.venue) parts.push(`${ref.venue}.`)
  const link = linkFor(ref)
  if (link) parts.push(link)
  return parts.join(' ')
}
