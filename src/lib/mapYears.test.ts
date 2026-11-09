import { describe, expect, it } from 'vitest'
import type { MapEvent } from '../types'
import { formatYear, timelineSteps, visibleEvents } from './mapYears'

function event(id: string, year: number): MapEvent {
  return {
    id,
    crop: 'paddy',
    year,
    kind: 'spread',
    title: id,
    place: 'x',
    lat: 0,
    lng: 0,
    confidence: 'high',
    note: '',
    sourceIds: [],
  }
}

const events = [event('c', 1690), event('a', -7000), event('b', -2500), event('d', -2500)]

describe('formatYear', () => {
  it('labels BCE and CE years', () => {
    expect(formatYear(-7000)).toBe('7000 BCE')
    expect(formatYear(1848)).toBe('1848 CE')
  })
})

describe('timelineSteps', () => {
  it('returns each distinct year once, oldest first', () => {
    expect(timelineSteps(events)).toEqual([-7000, -2500, 1690])
  })
})

describe('visibleEvents', () => {
  it('keeps events up to and including the year, oldest first', () => {
    expect(visibleEvents(events, -2500).map((e) => e.id)).toEqual(['a', 'b', 'd'])
    expect(visibleEvents(events, -8000)).toEqual([])
  })
})
