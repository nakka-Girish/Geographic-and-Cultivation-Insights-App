import { CROPS } from '../types'
import type { CropFilterValue } from '../data'

interface Props {
  value: CropFilterValue
  onChange: (value: CropFilterValue) => void
}

const OPTIONS: { id: CropFilterValue; label: string }[] = [{ id: 'all', label: 'All crops' }, ...CROPS]

export function CropFilter({ value, onChange }: Props) {
  return (
    <div className="crop-filter" role="group" aria-label="Choose a crop">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          className={o.id === value ? 'chip chip-active' : 'chip'}
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
