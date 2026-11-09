import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SourceList } from '../components/SourceList'
import { forCrop, mapEvents } from '../data'
import type { CropFilterValue } from '../data'
import { formatYear, timelineSteps, visibleEvents } from '../lib/mapYears'
import { CROPS } from '../types'
import type { Confidence, CropId, MapEvent } from '../types'

const CROP_COLOR: Record<CropId, string> = {
  paddy: '#1f6b3a',
  'oil-palm': '#b45309',
  soybean: '#6b3fa0',
}

const CONFIDENCE_OPACITY: Record<Confidence, number> = { high: 0.9, moderate: 0.6, low: 0.3 }

const STEP_DELAY_MS = 1200

/** Popup content is built as DOM nodes with textContent, never as an HTML string. */
function popupFor(e: MapEvent): HTMLElement {
  const box = document.createElement('div')
  const title = document.createElement('strong')
  title.textContent = e.title
  const meta = document.createElement('div')
  meta.textContent = `${formatYear(e.year)} · ${e.place}`
  box.append(title, meta)
  return box
}

function drawEvents(layer: L.LayerGroup, events: MapEvent[]) {
  layer.clearLayers()
  const byId = new Map(events.map((e) => [e.id, e]))

  for (const e of events) {
    const parent = e.from ? byId.get(e.from) : undefined
    if (parent) {
      L.polyline(
        [
          [parent.lat, parent.lng],
          [e.lat, e.lng],
        ],
        { color: CROP_COLOR[e.crop], weight: 2, dashArray: '6 6', opacity: 0.7, interactive: false },
      ).addTo(layer)
    }
  }

  for (const e of events) {
    L.circleMarker([e.lat, e.lng], {
      radius: e.kind === 'origin' ? 11 : 7,
      color: CROP_COLOR[e.crop],
      weight: 2,
      dashArray: e.confidence === 'low' ? '3 3' : undefined,
      fillColor: CROP_COLOR[e.crop],
      fillOpacity: CONFIDENCE_OPACITY[e.confidence],
    })
      .bindPopup(popupFor(e))
      .addTo(layer)
  }
}

export function MapScreen({ crop }: { crop: CropFilterValue }) {
  const cropEvents = useMemo(() => forCrop(mapEvents, crop), [crop])
  const steps = useMemo(() => timelineSteps(cropEvents), [cropEvents])

  // Start at the end of the timeline so the first view shows everything.
  const [index, setIndex] = useState(steps.length - 1)
  const [playing, setPlaying] = useState(false)

  const year = steps[index]
  const visible = useMemo(() => visibleEvents(cropEvents, year), [cropEvents, year])

  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  // Create the map once.
  useEffect(() => {
    const map = L.map(containerRef.current!, { scrollWheelZoom: false, worldCopyJump: true })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 8,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)

    const bounds = L.latLngBounds(cropEvents.map((e) => [e.lat, e.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 })

    return () => {
      map.remove()
      layerRef.current = null
    }
  }, [cropEvents])

  // Redraw the markers whenever the year changes.
  useEffect(() => {
    if (layerRef.current) drawEvents(layerRef.current, visible)
  }, [visible])

  // Auto-play: step forward every moment until the end.
  useEffect(() => {
    if (!playing) return
    if (index >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), STEP_DELAY_MS)
    return () => clearTimeout(timer)
  }, [playing, index, steps.length])

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    if (index >= steps.length - 1) setIndex(0)
    setPlaying(true)
  }

  return (
    <section aria-label="Origin and spread map">
      <div className="map-box" ref={containerRef} role="region" aria-label="Map of crop origin and spread" />

      <div className="slider-row">
        <button type="button" className="play" onClick={togglePlay}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          aria-label="Year"
          aria-valuetext={formatYear(year)}
          onChange={(e) => {
            setPlaying(false)
            setIndex(Number(e.target.value))
          }}
        />
        <span className="year-label" aria-live="polite">
          {formatYear(year)}
        </span>
      </div>

      <div className="legend">
        {CROPS.map((c) => (
          <span key={c.id}>
            <span className="dot" style={{ background: CROP_COLOR[c.id] }} />
            {c.label}
          </span>
        ))}
        <span>Large circle = origin, small = spread</span>
        <span>Faded or dashed outline = less certain</span>
      </div>
      <p className="map-note">
        Dashed lines show the direction of spread only, not the real route. Scroll-wheel zoom is off so the page can
        scroll; use the +/− buttons or pinch.
      </p>

      <h2>Events up to {formatYear(year)}</h2>
      <ol className="event-list">
        {visible.map((e) => (
          <li key={e.id}>
            <strong>{formatYear(e.year)}</strong> · {e.title} <em>({e.place})</em>
            <br />
            {e.note}
            <br />
            <small>Confidence: {e.confidence}</small>
            <SourceList ids={e.sourceIds} />
          </li>
        ))}
      </ol>
    </section>
  )
}
