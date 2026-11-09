import { getReference } from '../data'
import { linkFor } from '../lib/citation'

/** Short "Authors (year)" list of sources, linking out when a safe link exists. */
export function SourceList({ ids }: { ids: string[] }) {
  return (
    <p className="sources">
      <span className="sources-label">Sources: </span>
      {ids.map((id, i) => {
        const ref = getReference(id)
        if (!ref) return null
        const link = linkFor(ref)
        const first = ref.authors.split(',')[0]
        const label = `${first} (${ref.year})`
        return (
          <span key={id}>
            {i > 0 && '; '}
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              label
            )}
            {!ref.verified && <span className="unverified" title="Not yet checked against the original source"> *</span>}
          </span>
        )
      })}
    </p>
  )
}
