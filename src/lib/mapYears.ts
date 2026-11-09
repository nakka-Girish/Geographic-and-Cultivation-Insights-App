import type { MapEvent } from '../types'

/** 7000 BCE -> "7000 BCE", 1848 -> "1848 CE". */
export function formatYear(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year} CE`
}

/**
 * The years the slider stops at: one stop per distinct event year, oldest first.
 * Years are thousands apart early on and decades apart later, so stepping
 * through event years keeps every slider move meaningful.
 */
export function timelineSteps(events: MapEvent[]): number[] {
  return [...new Set(events.map((e) => e.year))].sort((a, b) => a - b)
}

/** Everything that has happened by the chosen year, oldest first. */
export function visibleEvents(events: MapEvent[], year: number): MapEvent[] {
  return events.filter((e) => e.year <= year).sort((a, b) => a.year - b.year)
}
