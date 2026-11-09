import { useState } from 'react'
import { referencesForCrop } from '../data'
import type { CropFilterValue } from '../data'
import { formatCitation, linkFor } from '../lib/citation'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Copied')
    } catch {
      setStatus('Copy is not available here. Select the text and copy it by hand.')
    }
  }

  return (
    <>
      <button type="button" className="copy" onClick={copy}>
        {label}
      </button>
      <span className="copy-status" role="status">
        {status}
      </span>
    </>
  )
}

export function ReferencesScreen({ crop }: { crop: CropFilterValue }) {
  const refs = referencesForCrop(crop)
  const all = refs.map(formatCitation).join('\n\n')

  return (
    <section aria-label="References">
      <p>
        Sources behind the content for this selection. Entries marked <span className="unverified">*</span> have not yet
        been checked against the original publication. Check each one before using it in a thesis.
      </p>
      <div className="ref-actions">
        <CopyButton text={all} label="Copy all citations" />
      </div>
      <ul className="ref-list">
        {refs.map((r) => {
          const link = linkFor(r)
          return (
            <li className="card" key={r.id}>
              <div>
                {r.authors} ({r.year}). <strong>{r.title}</strong>. {r.venue}
                {!r.verified && <span className="unverified"> *</span>}
              </div>
              {link && (
                <div>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </div>
              )}
              <div className="ref-actions">
                <CopyButton text={formatCitation(r)} label="Copy citation" />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
