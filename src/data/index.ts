import type { AvoidItem, CropId, MapEvent, Practice, Reference } from '../types'
import avoidRaw from './avoid.json'
import mapEventsRaw from './mapEvents.json'
import practicesRaw from './practices.json'
import referencesRaw from './references.json'

export const mapEvents = mapEventsRaw as MapEvent[]
export const practices = practicesRaw as Practice[]
export const avoidItems = avoidRaw as AvoidItem[]
export const references = referencesRaw as Reference[]

const referencesById = new Map(references.map((r) => [r.id, r]))

export function getReference(id: string): Reference | undefined {
  return referencesById.get(id)
}

export type CropFilterValue = CropId | 'all'

export function forCrop<T extends { crop: CropId }>(items: T[], crop: CropFilterValue): T[] {
  return crop === 'all' ? items : items.filter((i) => i.crop === crop)
}

/** Every reference cited by something for this crop, sorted by author then year. */
export function referencesForCrop(crop: CropFilterValue): Reference[] {
  const cited = new Set(
    [...forCrop(mapEvents, crop), ...forCrop(practices, crop), ...forCrop(avoidItems, crop)].flatMap(
      (item) => item.sourceIds,
    ),
  )
  return references
    .filter((r) => cited.has(r.id))
    .sort((a, b) => a.authors.localeCompare(b.authors) || a.year - b.year)
}
