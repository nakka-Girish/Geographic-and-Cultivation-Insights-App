# Geographic & Cultivation Insights App — Implementation Plan

Thesis project: an interactive educational and analytical app for **Paddy (Rice)**, **Oil Palm**, and **Soybean**.
Audience: agricultural science students, thesis researchers, extension workers.

---

## 1. Vision and Scope

Bridge traditional agricultural knowledge and peer-reviewed science. Every piece of content is a **traceable claim** that links to its sources, so researchers can cite it.

| Pillar | Outcome |
|---|---|
| Origin and spread mapping | Interactive map and timeline of domestication, migration, and dissemination |
| Comparative cultivation | Traditional vs. scientific methods, side by side, per crop and per stage |
| Risk and avoidance | Evidence-backed "what NOT to do" alerts |
| Research hub | Bibliography, datasets, and citation export |

**In scope (MVP):** 3 crops, web PWA (mobile-friendly), read-only content, search, citation export.
**Out of scope (MVP):** user-generated content, real-time sensor data, payments, native app-store builds.

---

## 2. Key Design Techniques and Methodologies

### 2.1 Process methodology
- **Design Science Research (DSR)** frames the thesis: problem → artifact → evaluation → contribution. Each sprint ends with an evaluable artifact.
- **Agile (2-week sprints)** with a thin Kanban board. Scope is fixed by pillar, and depth is flexible.
- **User-centred design:** personas (student, researcher, extension worker), then low-fi wireframes, then usability tests (SUS score) with 8–10 target users.
- **Evidence-first content workflow:** no content is published without at least one citation and a reviewer sign-off.

### 2.2 Content and knowledge modelling (the core idea)
Model everything as a **Claim** instead of free text:

```
Claim
  id, crop, topic (planting | irrigation | fertilization | pest | harvest | post-harvest | ...)
  approach: traditional | scientific
  statement, region/agro-climatic zone, season
  evidence[]  -> Source(id, type, DOI, year, quality grade)
  validation: validated | partially-validated | unvalidated | contradicted | harmful
  risk_level (for avoidance alerts): low | medium | high
  linked_claim_ids[]  (traditional <-> scientific pairing)
```

- **Pairing** a traditional claim with its scientific counterpart drives the Side-by-Side module and the "validation" badge.
- **Evidence grading** is a simplified GRADE-style scale (meta-analysis, RCT/field trial, observational, expert/ethnographic) shown as a badge.
- **Controlled vocabularies** for crops, growth stages (BBCH scale), agro-climatic zones (Köppen–Geiger, FAO AEZ), and soil types (WRB) keep data consistent and make it comparable.

### 2.3 Geospatial design
- **Vector tiles and GeoJSON** rendered with **MapLibre GL JS** (open source, no vendor lock-in or API-key dependency).
- **Temporal layer:** features carry `valid_from` / `valid_to` (years, BCE supported). A timeline slider filters them (the "time-aware map" pattern).
- **Layers:** domestication centres, migration routes (animated polylines), historical range polygons, current production, and climate suitability (rainfall, temperature, altitude).
- **Uncertainty is shown, not hidden:** each origin or route carries a `confidence` field (archaeological, genetic, or historical) and renders dashed or faded when uncertain.
- Data sources are cited in the data itself: FAOSTAT, FAO GAEZ, WorldClim, GBIF, and archaeobotany and population-genetics literature.

### 2.4 Architecture patterns
- **Static-first / Jamstack:** content is versioned data (YAML/Markdown + GeoJSON) in the repo, validated at build time and compiled into JSON and a search index. This is cheap, fast, secure (no database to attack), and offline-capable.
- **Optional API tier (Phase 4):** small FastAPI service backed by PostgreSQL + PostGIS only if dynamic features are needed (feedback, admin CMS, heavy spatial queries).
- **Clean/layered frontend:** `features/` (map, compare, alerts, research) → `domain/` (types, rules) → `data/` (loaders, cache). Features never import each other directly.
- **PWA + offline:** service worker caches content and tiles for field use and low-connectivity users.
- **Schema-driven content:** JSON Schema / Zod validates every record in CI. Bad data fails the build.

### 2.5 UX and learning design
- **Progressive disclosure:** summary → detail → primary sources.
- **Side-by-side comparison** with a synchronised scroll and a validation badge per row.
- **Risk alerts** use severity colour plus icon plus text (never colour alone) and always state the *why* with a citation.
- **Accessibility:** WCAG 2.2 AA, keyboard map controls, and a data-table alternative for every map and chart.
- **i18n-ready** (English first; Bahasa, Hindi, and Telugu are candidates since the crops are regional).
- **Charts:** accessible, consistent palettes, and a table fallback.

### 2.6 Research-hub design
- Bibliography stored as **CSL-JSON** and exportable to **BibTeX/RIS/APA**.
- Dataset catalogue with licence, provenance, and download links (CSV/GeoJSON).
- Persistent "cite this page" button with permalink and access date.
- Tagging and filtering by crop, topic, region, evidence grade, and year.

### 2.7 Quality and security principles
- **Testing pyramid:** unit (domain rules, schema), component, E2E (Playwright), plus automated accessibility checks (axe).
- **Content QA:** link checker for DOIs, duplicate-claim detection, and a rule that every `harmful` or `contradicted` claim needs a mitigation note.
- **Security by default:** no secrets in the repo (env vars/secret manager only), strict CSP, dependency scanning (`npm audit`/Dependabot), pinned lockfiles, HTTPS only, and no inline scripts. Treat all external data (DOI metadata, imported datasets) as untrusted: validate and sanitise it before render, and never render raw HTML from sources.
- **Licensing hygiene:** record the licence for every dataset and image. Prefer CC-BY and public-domain sources.

---

## 3. Recommended Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite | Mature, typed, fast builds |
| Styling/UI | Tailwind CSS + Radix UI (accessible primitives) | Accessibility and consistency |
| Map | MapLibre GL JS + PMTiles/GeoJSON | Open, serverless tiles |
| Charts | Observable Plot or Recharts | Light, accessible |
| Content | YAML/Markdown + Zod schemas | Versionable, validated |
| Search | MiniSearch / Pagefind (client-side) | No backend needed |
| PWA | Workbox | Offline caching |
| Hosting | GitHub Pages / Netlify / Azure Static Web Apps | Static hosting, free tier |
| Optional backend | FastAPI + PostgreSQL/PostGIS | Phase 4 only |
| Testing | Vitest, Testing Library, Playwright, axe | Full pyramid |
| CI/CD | GitHub Actions (build, validate, test, deploy) | Automated gates |

**Tradeoff:** static-first gives the strongest security and lowest cost. The price is no live user features until Phase 4. This is the right default for a read-only educational app.

---

## 4. Proposed Repository Structure

```
Geographic-and-Cultivation-Insights-App/
├─ docs/                    # plan, architecture, ADRs, user research, thesis notes
├─ content/
│  ├─ crops/{paddy,oil-palm,soybean}/
│  │   ├─ overview.md
│  │   ├─ origin.yml         # origin + migration features
│  │   ├─ claims/*.yml       # traditional + scientific claims
│  │   └─ risks/*.yml        # avoidance alerts
│  ├─ references/references.json   # CSL-JSON
│  └─ vocab/                 # zones, growth stages, soil types
├─ data/geo/                 # GeoJSON, PMTiles, source licences
├─ schemas/                  # Zod / JSON Schema definitions
├─ scripts/                  # content build, validation, DOI checks
├─ src/
│  ├─ features/{map,compare,alerts,research,search}/
│  ├─ domain/
│  ├─ data/
│  └─ components/
├─ tests/{unit,e2e}/
└─ .github/workflows/
```

---

## 5. Phased Roadmap (≈ 20 weeks)

| Phase | Weeks | Deliverables | Exit criteria |
|---|---|---|---|
| **0. Discovery** | 1–2 | Literature scan, personas, scope, data inventory, licence check | Approved scope and source list |
| **1. Foundations** | 3–4 | Repo, CI, schemas, vocab, design system, app shell, one crop seeded end-to-end | Build validates content; deploys to staging |
| **2. Origin Map and Timeline** | 5–8 | Map layers, timeline slider, migration routes, confidence styling for all 3 crops | Map works for all crops; a11y table fallback |
| **3. Comparison and Avoidance** | 9–13 | Side-by-side module, validation badges, risk alerts, crop-rotation and soil-health content | ≥ 25 paired claims and ≥ 15 risk alerts per crop, all cited |
| **4. Research Hub and Search** | 14–16 | Bibliography, CSL export, dataset catalogue, search and filters, "cite this page" | Citation export verified in Zotero/BibTeX |
| **5. Evaluation and Hardening** | 17–19 | Usability study (SUS), expert content review, performance, a11y, security review | SUS ≥ 70; Lighthouse ≥ 90; no critical vulns |
| **6. Thesis and Release** | 20 | Thesis write-up, v1.0 release, handover docs | Public release and thesis draft |

---

## 6. Content Production Workflow

1. **Collect** sources (peer-reviewed, FAO/IRRI/MPOB/ICAR guides, and ethnographic studies for traditional practice).
2. **Extract** claims into the schema and record the evidence grade.
3. **Pair** traditional and scientific claims and assign a validation status.
4. **Review:** a domain expert (agronomist) signs off. Reviewer and date are stored in the record.
5. **Validate** in CI: schema, DOI resolution, and licence check.
6. **Publish** via merge to `main`, with a version-stamped content release.

Seed topics:
- **Paddy:** puddling vs. direct seeding, AWD irrigation, SRI, salinity, blast and brown planthopper IPM, straw management.
- **Oil palm:** peat vs. mineral soil, planting density, Ganoderma, fertiliser balance, zero-burning replanting, deforestation and biodiversity impacts.
- **Soybean:** rhizobial inoculation, rotation (e.g. with cereals), photoperiod sensitivity, rust and pod-borer management, herbicide-resistance avoidance.

---

## 7. Evaluation Plan (thesis contribution)

- **Usability:** SUS and task-completion tests with students and extension workers.
- **Content validity:** expert panel rating accuracy and usefulness (Likert scale, with inter-rater agreement).
- **Learning impact (optional):** pre/post knowledge quiz on a small cohort.
- **Technical:** Lighthouse performance, WCAG audit, and offline behaviour tests.

---

## 8. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Content volume exceeds time | Fix a "minimum viable claim set" per crop. Expand only after the MVP. |
| Contested origin or migration science | Show confidence levels and cite competing hypotheses |
| Licensing of maps and data | Use open-licensed sources only. Track licences in `data/geo/`. |
| Traditional knowledge is sensitive or community-owned | Cite published sources, acknowledge communities, and follow ethical guidelines (e.g. Nagoya Protocol principles) |
| Advice misused as agronomic prescription | Add a clear disclaimer: educational, not site-specific advice. Show regional applicability. |
| Security or supply-chain issues | Static hosting, dependency scanning, and pinned versions |

---

## 9. Immediate Next Steps

1. Confirm stack (React + TS + MapLibre, static-first) and hosting target.
2. Initialise the repo, CI, and schemas (Phase 1).
3. Draft the 3-crop source list and literature matrix (Phase 0).
4. Build the Claim schema and seed 5 paired claims for one crop as a vertical slice.
5. Choose the thesis supervisor and domain reviewer for content sign-off.
