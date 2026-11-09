import { SourceList } from '../components/SourceList'
import { avoidItems, forCrop } from '../data'
import type { CropFilterValue } from '../data'
import { cropLabel } from '../types'

const SEVERITY_ORDER = { high: 0, medium: 1 } as const

export function AvoidScreen({ crop }: { crop: CropFilterValue }) {
  const items = [...forCrop(avoidItems, crop)].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

  return (
    <section aria-label="Practices to avoid">
      {items.map((a) => (
        <article className={`card avoid-${a.severity}`} key={a.id}>
          <h3>
            {a.title}
            {crop === 'all' && <small> · {cropLabel(a.crop)}</small>}
          </h3>
          <p>
            <span className={`badge sev-${a.severity}`}>
              {a.severity === 'high' ? '⚠ High risk' : '⚠ Medium risk'}
            </span>
          </p>
          <p>
            <strong>Why:</strong> {a.why}
          </p>
          <p className="instead">
            <strong>Do this instead:</strong> {a.instead}
          </p>
          <SourceList ids={a.sourceIds} />
        </article>
      ))}
    </section>
  )
}
