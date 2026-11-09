import { useState } from 'react'
import { CropFilter } from './components/CropFilter'
import type { CropFilterValue } from './data'
import { AvoidScreen } from './screens/AvoidScreen'
import { CompareScreen } from './screens/CompareScreen'
import { MapScreen } from './screens/MapScreen'
import { ReferencesScreen } from './screens/ReferencesScreen'

type TabId = 'map' | 'compare' | 'avoid' | 'references'

const TABS: { id: TabId; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'compare', label: 'Compare' },
  { id: 'avoid', label: 'Avoid' },
  { id: 'references', label: 'References' },
]

export function App() {
  const [tab, setTab] = useState<TabId>('map')
  const [crop, setCrop] = useState<CropFilterValue>('all')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Geographic &amp; Cultivation Insights</h1>
        <p className="tagline">Paddy · Oil Palm · Soybean</p>
        <p className="draft-note">Draft content for study. Check every source before citing it.</p>
      </header>

      <nav className="tabs" role="tablist" aria-label="Screens">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={t.id === tab}
            aria-controls="panel"
            className={t.id === tab ? 'tab tab-active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <CropFilter value={crop} onChange={setCrop} />

      <main id="panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'map' && <MapScreen key={crop} crop={crop} />}
        {tab === 'compare' && <CompareScreen crop={crop} />}
        {tab === 'avoid' && <AvoidScreen crop={crop} />}
        {tab === 'references' && <ReferencesScreen crop={crop} />}
      </main>
    </div>
  )
}
