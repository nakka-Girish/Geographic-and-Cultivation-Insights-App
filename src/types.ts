export type CropId = 'paddy' | 'oil-palm' | 'soybean'

export const CROPS: { id: CropId; label: string }[] = [
  { id: 'paddy', label: 'Paddy (Rice)' },
  { id: 'oil-palm', label: 'Oil Palm' },
  { id: 'soybean', label: 'Soybean' },
]

export function cropLabel(id: CropId): string {
  return CROPS.find((c) => c.id === id)?.label ?? id
}

export type Confidence ='high' | 'moderate' | 'low'

/** A point on the origin/spread map. Negative years are BCE. */
export interface MapEvent {
  id: string
  crop: CropId
  year: number
  kind: 'origin' | 'spread'
  title: string
  place: string
  lat: number
  lng: number
  confidence: Confidence
  note: string
  /** id of the event this one spread from (draws a direction line) */
  from?: string
  sourceIds: string[]
}

export type Support = 'yes' | 'partly' | 'no'

/** One traditional method paired with its scientific counterpart. */
export interface Practice {
  id: string
  crop: CropId
  topic: string
  traditional: string
  scientific: string
  /** does science support the traditional method? */
  supported: Support
  explanation: string
  sourceIds: string[]
}

export interface AvoidItem {
  id: string
  crop: CropId
  title: string
  why: string
  instead: string
  severity: 'high' | 'medium'
  sourceIds: string[]
}

export interface Reference {
  id: string
  authors: string
  year: number
  title: string
  venue?: string
  doi?: string
  url?: string
  /** true only after someone has checked the citation against the source */
  verified: boolean
}
