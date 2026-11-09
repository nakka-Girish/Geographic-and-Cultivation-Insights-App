import { SourceList } from '../components/SourceList'
import { forCrop, practices } from '../data'
import type { CropFilterValue } from '../data'
import { cropLabel } from '../types'
import type { Support } from '../types'

// Each label has a symbol as well as a colour, so meaning never depends on colour alone.
const SUPPORT: Record<Support, { label: string; className: string }> = {
  yes: { label: '✔ Science supports the tradition', className: 'badge support-yes' },
  partly: { label: '◐ Partly supported', className: 'badge support-partly' },
  no: { label: '✖ Not supported by science', className: 'badge support-no' },
}

export function CompareScreen({ crop }: { crop: CropFilterValue }) {
  const items = forCrop(practices, crop)

  return (
    <section aria-label="Traditional and scientific methods compared">
      {items.map((p) => (
        <article className="card" key={p.id}>
          <h3>
            {p.topic}
            {crop === 'all' && <small> · {cropLabel(p.crop)}</small>}
          </h3>
          <div className="compare-grid">
            <div className="col col-traditional">
              <h4>Traditional</h4>
              <p>{p.traditional}</p>
            </div>
            <div className="col col-scientific">
              <h4>Scientific</h4>
              <p>{p.scientific}</p>
            </div>
          </div>
          <p>
            <span className={SUPPORT[p.supported].className}>{SUPPORT[p.supported].label}</span>
          </p>
          <p>{p.explanation}</p>
          <SourceList ids={p.sourceIds} />
        </article>
      ))}
    </section>
  )
}
