import { describe, expect, it } from 'vitest'
import type { Reference } from '../types'
import { doiUrl, formatCitation, httpsUrl, linkFor } from './citation'

const base: Reference = {
  id: 'x',
  authors: 'Smith J',
  year: 2020,
  title: 'A title',
  venue: 'Journal 1:1–2',
  verified: false,
}

describe('doiUrl', () => {
  it('builds a doi.org link for a valid DOI', () => {
    expect(doiUrl('10.1038/nature11532')).toBe('https://doi.org/10.1038/nature11532')
  })

  it('rejects anything that is not a DOI', () => {
    expect(doiUrl('javascript:alert(1)')).toBeNull()
    expect(doiUrl('10.1038/ bad space')).toBeNull()
    expect(doiUrl('')).toBeNull()
  })
})

describe('httpsUrl', () => {
  it('accepts https only', () => {
    expect(httpsUrl('https://www.weedscience.org')).toBe('https://www.weedscience.org/')
    expect(httpsUrl('http://example.org')).toBeNull()
    expect(httpsUrl('javascript:alert(1)')).toBeNull()
    expect(httpsUrl('not a url')).toBeNull()
  })
})

describe('linkFor / formatCitation', () => {
  it('prefers the DOI and ignores an unsafe URL', () => {
    expect(linkFor({ ...base, doi: '10.1000/abc', url: 'http://x.org' })).toBe('https://doi.org/10.1000/abc')
    expect(linkFor({ ...base, url: 'javascript:alert(1)' })).toBeNull()
  })

  it('formats a copyable citation', () => {
    expect(formatCitation({ ...base, doi: '10.1000/abc' })).toBe(
      'Smith J (2020). A title. Journal 1:1–2. https://doi.org/10.1000/abc',
    )
    expect(formatCitation(base)).toBe('Smith J (2020). A title. Journal 1:1–2.')
  })
})
