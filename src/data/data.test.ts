import { describe, expect, it } from 'vitest'
import { avoidItems, getReference, mapEvents, practices, references, referencesForCrop } from './index'

const CROP_IDS = ['paddy', 'oil-palm', 'soybean']

function allIds(items: { id: string }[]) {
  return items.map((i) => i.id)
}

describe('content data', () => {
  it('has unique ids inside each file', () => {
    for (const items of [mapEvents, practices, avoidItems, references]) {
      expect(new Set(allIds(items)).size).toBe(items.length)
    }
  })

  it('uses only known crops and has content for each crop', () => {
    for (const items of [mapEvents, practices, avoidItems]) {
      for (const item of items) expect(CROP_IDS).toContain(item.crop)
      for (const crop of CROP_IDS) expect(items.some((i) => i.crop === crop)).toBe(true)
    }
  })

  it('cites at least one source everywhere, and every cited source exists', () => {
    for (const item of [...mapEvents, ...practices, ...avoidItems]) {
      expect(item.sourceIds.length, item.id).toBeGreaterThan(0)
      for (const id of item.sourceIds) expect(getReference(id), `${item.id} -> ${id}`).toBeDefined()
    }
  })

  it('has no unused references', () => {
    const used = new Set([...mapEvents, ...practices, ...avoidItems].flatMap((i) => i.sourceIds))
    for (const ref of references) expect(used.has(ref.id), ref.id).toBe(true)
  })

  it('points every "from" at an existing event of the same crop that is not later', () => {
    const byId = new Map(mapEvents.map((e) => [e.id, e]))
    for (const e of mapEvents) {
      if (!e.from) continue
      const parent = byId.get(e.from)
      expect(parent, e.id).toBeDefined()
      expect(parent!.crop).toBe(e.crop)
      expect(parent!.year).toBeLessThanOrEqual(e.year)
    }
  })

  it('lists only the references a crop actually cites', () => {
    const soy = referencesForCrop('soybean').map((r) => r.id)
    expect(soy).toContain('hungria2015')
    expect(soy).not.toContain('bouman2001')
    expect(referencesForCrop('all')).toHaveLength(references.length)
  })

  it('has valid coordinates', () => {
    for (const e of mapEvents) {
      expect(Math.abs(e.lat)).toBeLessThanOrEqual(90)
      expect(Math.abs(e.lng)).toBeLessThanOrEqual(180)
    }
  })
})
