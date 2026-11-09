# Technique Options and Decision Record (pre-implementation)

Purpose: finalise the approach **before** any code is written. Each step lists the options, how they compare, and a recommended default. Where security is a factor, the safest option is labelled as the default. Mark your choice in the checklist at the end (Section 5).

---

## 1. The Ask (restated)

Build an interactive mobile/web app for agricultural students, thesis researchers, and extension workers covering **Paddy (Rice)**, **Oil Palm**, and **Soybean**.

| # | Objective | Feature |
|---|---|---|
| 1 | Geographical and historical origin mapping: origin, migration paths, global and regional spread, and how cultivation shifted across agro-climatic zones | Interactive crop map and timeline |
| 2 | Comparative cultivation framework: traditional practice (indigenous knowledge, organic soil prep, seed saving, water management, seasonal cycles) vs. scientific agronomy (density, IPM, nutrients, yield, post-harvest) | Side-by-side module |
| 3 | Risk mitigation: "what NOT to do" (chemical overuse, salinisation, bad rotations, resistance), cross-referencing traditional wisdom with scientific validation | Scientific avoidance and risk alerts |
| 4 | Academic support: bibliography and datasets for thesis documentation | Student research hub |

**Core benefit:** bridge traditional practice and modern evidence so researchers can make data-backed, sustainable recommendations.

**Open scope questions (answer in Section 5):** MVP depth per crop, target regions, languages, and whether any user accounts or feedback are needed.

---

## 2. The Plan We Are Using (baseline)

Baseline from `IMPLEMENTATION_PLAN.md`:

1. **Process:** Design Science Research plus 2-week agile sprints.
2. **Content:** every item is a "Claim" with an evidence grade and a validation status, paired traditional ↔ scientific.
3. **Geo:** MapLibre with GeoJSON/PMTiles and a timeline slider. Uncertain data is shown as uncertain.
4. **Architecture:** static-first PWA (React + TypeScript + Vite), schema-validated content in the repo, client-side search.
5. **Research hub:** CSL-JSON bibliography with BibTeX/RIS export.
6. **Quality and security:** a11y (WCAG 2.2 AA), the testing pyramid, CSP, dependency scanning, untrusted-input validation.
7. **Roadmap:** 7 phases, ≈ 20 weeks.

Everything below challenges these choices with alternatives.

---

## 3. Step-by-Step Technique Analysis

### Step 1 — Delivery platform

| Option | Pros | Cons | Fit |
|---|---|---|---|
| **A. Responsive PWA** (recommended) | One codebase, installable, offline, no store review, easiest to share with a thesis committee | Limited device APIs, iOS PWA quirks | ★★★★★ |
| B. Cross-platform native (React Native / Flutter) | Native feel, store presence | Map and data-heavy UI is harder. Two build pipelines. Store review. | ★★★ |
| C. PWA wrapped with Capacitor | PWA plus store packaging later | Extra build and maintenance | ★★★★ (later upgrade path) |
| D. Desktop-only web | Simplest | Ignores the "mobile" requirement | ★★ |

**Recommendation:** A, with C as an optional later step.

### Step 2 — Frontend framework

| Option | Pros | Cons |
|---|---|---|
| **React + TS + Vite** (recommended) | Largest ecosystem for maps and charts (react-map-gl, MapLibre bindings), fast dev | You choose your own router, state, and so on |
| Next.js / Astro (SSG) | Pre-rendered pages, good SEO, citable permalinks | More framework surface. Map pages are client-only anyway. |
| SvelteKit | Small bundles, simple reactivity | Smaller ecosystem |
| Angular | Strong structure, typed, good if you are already fluent | Heavier. Fewer map examples. |

**Recommendation:** React + Vite. Pick Astro or Angular instead if you want pre-rendered pages or you are already fluent in Angular. A faster build beats a new framework.

### Step 3 — Map technology

| Option | Pros | Cons |
|---|---|---|
| **MapLibre GL JS** (recommended) | Open source, vector tiles, smooth zoom, 3D, no API key, PMTiles-friendly | WebGL needed. Steeper than Leaflet. |
| Leaflet | Very simple and lightweight, huge plugin set | Raster-oriented. Large vector or animated data is slow. |
| OpenLayers | Best for GIS: projections, WMS/WFS, rasters | Heavier API, more complex |
| deck.gl (on top of MapLibre) | Large animated layers (arcs, trips) | Overkill for MVP. Add only for animated migration. |
| Mapbox GL / Google Maps | Polished | Licence cost, API keys (a secret to manage), lock-in |

**Recommendation:** MapLibre. Add deck.gl later only if migration animation needs it. Avoid keyed commercial APIs, which removes a secret to manage.

### Step 4 — Time and history visualisation

| Option | Notes |
|---|---|
| **Slider-driven filtering** on `valid_from/valid_to` (recommended) | Simple and accessible, works with any map |
| Animated playback (play/pause) | Add on top of the slider. Great for teaching. |
| Separate timeline chart (e.g. vis-timeline) | Good for the event list. Duplicate UI if the map slider exists. |
| Space-time cube / heavy temporal GIS | Research-grade, too complex for the scope |

**Recommendation:** slider plus play button, and a linked event list.

### Step 5 — Data architecture

| Option | Pros | Cons | Security |
|---|---|---|---|
| **A. Static files in repo** (YAML/JSON/GeoJSON → build) (recommended) | Free, versioned (git history is your audit trail), no server | No live edits. Rebuild per change. | Safest: nothing to attack |
| B. Static plus in-browser analytics (SQLite/DuckDB-WASM over Parquet) | Rich filtering and queries still serverless | Larger download, learning curve | Safe |
| C. API + PostgreSQL/PostGIS | Spatial queries, many users, live updates | Hosting, patching, auth, cost | Larger attack surface |
| D. Headless CMS (Strapi/Directus) or BaaS (Supabase) | Nice editor UI for reviewers | Account/secret management, uptime | Moderate. Needs RBAC and secrets handling. |

**Recommendation:** A for MVP. Move to B if filtering gets heavy, or D if non-technical reviewers must edit. Choose C only if the thesis needs user-generated data.

### Step 6 — Knowledge and content modelling

| Option | Pros | Cons |
|---|---|---|
| **Claim-based model with pairing** (recommended) | Traceable, citable, powers compare and alerts, and is itself a thesis contribution | More upfront structuring effort |
| Flat articles per topic | Fastest to write | No structured comparison or validation. Hard to cross-reference. |
| Knowledge graph (RDF/OWL/Neo4j) | Rich semantics, reasoning | Heavy. Needs ontology expertise. |
| Spreadsheet-first, then import | Easy for domain reviewers | Needs a strict import validator |

**Recommendation:** claim model in YAML with Zod/JSON Schema validation. Keep a spreadsheet import for reviewers. Defer graph ideas to future work.

### Step 7 — Evidence-grading scheme

| Option | Pros | Cons |
|---|---|---|
| **Custom agricultural 5-tier scale** (recommended): systematic review/meta-analysis → multi-site field trials → single trial → survey/observational → expert/ethnographic | Fits agronomy and is explainable | You must justify and document it |
| GRADE (adapted) | Well known | Built for clinical evidence. Awkward for agronomy. |
| Oxford CEBM levels | Simple hierarchy | Also clinical |
| No grading, citations only | Least effort | Weakens the "evidence-based" claim |

Validation status is separate from the grade: validated, partially validated, unvalidated, contradicted, harmful.

**Recommendation:** custom 5-tier scale plus the validation status. Cite the adaptation rationale in the thesis.

### Step 8 — Traditional vs. scientific comparison UI

| Option | Pros | Cons |
|---|---|---|
| **Paired side-by-side rows with validation badge** (recommended) | Direct, clear, matches the brief | Cramped on phones (stack vertically) |
| Matrix (practice × crop stage) | Good overview | Dense |
| Growth-stage timeline (BBCH) with practices on each stage | Intuitive for the crop cycle | More modelling work |
| Tabs (Traditional / Scientific) | Simple on mobile | Hides the comparison |

**Recommendation:** side-by-side on desktop that stacks on mobile, with a stage filter. Add the growth-stage timeline as an enhancement.

### Step 9 — Climate suitability and "agro-climatic shift" method (key thesis lever)

| Option | Pros | Cons |
|---|---|---|
| **Precomputed layers from open datasets** (WorldClim + FAO GAEZ / EcoCrop ranges), converted to tiles (recommended) | Credible, citable, serverless | Static. You must document processing. |
| Rule-based suitability in the browser (temperature/rainfall thresholds from EcoCrop) | Interactive "what if", transparent | Simplified |
| Species distribution model (MaxEnt, GBIF occurrences) | Strong scientific novelty | Needs R/Python expertise and validation time |
| Hand-drawn zones only | Fastest | Low rigour |

**Recommendation:** precomputed layers for the MVP, with optional rule-based interactivity. Treat a modelled SDM as a stretch goal or future work.

### Step 10 — Search and discovery

| Option | Pros | Cons |
|---|---|---|
| **Client-side index (MiniSearch/Pagefind)** (recommended) | Offline, free, no data leaves the device | Index size limits |
| Hosted search (Algolia) | Excellent relevance | Third party and API keys, cost |
| Self-hosted (Meilisearch / Postgres FTS) | Powerful | Needs a backend |

**Recommendation:** client-side, which fits the static-first approach.

### Step 11 — Research hub and citations

| Option | Notes |
|---|---|
| **CSL-JSON as the source of truth, with Zotero as the curation tool** (recommended) | Standard, works with citation-js for BibTeX/RIS/APA export |
| BibTeX-only | Familiar to LaTeX users, weaker metadata |
| DB-only | Reinvents the wheel |

Datasets: a catalogue file (title, licence, provenance, DOI, format). Only host data whose licence allows it. Otherwise link to the source.

### Step 12 — Project methodology and thesis evaluation

| Option | Pros | Cons |
|---|---|---|
| **Design Science Research + Agile sprints** (recommended) | Gives an academic frame for building an artifact, with evaluation | Needs explicit evaluation criteria |
| Pure Agile | Flexible | Weak academic framing |
| Waterfall | Predictable | Poor fit for evolving content |
| Design Thinking only | Strong on empathy | Weak on delivery and rigour |

Evaluation instruments (combinable): SUS usability, expert-panel content validity (Likert, with inter-rater agreement such as Cohen's/Fleiss' kappa), task success rate, and an optional pre/post knowledge quiz.

### Step 13 — Hosting, access control, and security posture

| Option | Pros | Cons |
|---|---|---|
| **Static host (GitHub Pages / Netlify / Azure Static Web Apps), no accounts** (recommended, safest default) | Minimal attack surface, no secrets, no PII | No personalisation |
| Static plus anonymous analytics (privacy-friendly, e.g. self-hosted Plausible/Umami) | Usage insight for the thesis | One more service. No cookies or PII. |
| Container/serverless API with login | Saved bookmarks, feedback, admin | Auth, secrets, PII/GDPR duties, patching |

**Tradeoff:** convenience features (accounts, saved lists) cost security and compliance effort. The safest default is static with no accounts. Add anonymous feedback through a third-party form only after you approve it.

Controls in all cases: strict CSP, HTTPS only, pinned dependencies and lockfile, dependency scanning, sanitised rendering of all external text (DOI metadata, imported CSVs), and no secrets in the repo, config, logs, or tests.

### Step 14 — Ethics and traditional-knowledge handling

| Option | Notes |
|---|---|
| **Use only published, citable sources and credit communities** (recommended) | Low risk, consistent with the citation model |
| Primary fieldwork interviews | Strong originality. Needs ethics approval, consent, and data protection. |
| Community co-curation | Best practice, slower |

Follow the CARE principles for indigenous data governance, and note Nagoya Protocol considerations. Add a disclaimer that content is educational and not site-specific advice.

### Step 15 — Localisation and accessibility

- Language: English first with i18n-ready strings (react-i18next or similar). Add regional languages after the content stabilises.
- Accessibility: WCAG 2.2 AA, keyboard-operable map, data-table alternative for every map or chart, and colour-blind-safe palettes.

---

## 4. Recommended Baseline (if you accept all defaults)

PWA · React + TypeScript + Vite · MapLibre (PMTiles/GeoJSON) · static content in YAML with Zod validation · claim model with a custom 5-tier evidence scale · MiniSearch · CSL-JSON via citation-js · precomputed WorldClim/GAEZ layers · static hosting without accounts · DSR + agile · SUS + expert-panel evaluation.

**Implementation order (step by step):**
1. Fix decisions (this document).
2. Repo, CI, lint/test/a11y gates, CSP and security baseline.
3. Schemas and controlled vocabularies.
4. Vertical slice: one crop, 5 paired claims, 1 map layer, 1 alert.
5. Map and timeline for all three crops.
6. Side-by-side comparison and risk alerts.
7. Research hub and search.
8. Evaluation, hardening, thesis write-up.

---

## 5. Decision Checklist (mark your choices)

| # | Decision | Default | Your choice |
|---|---|---|---|
| 1 | Platform | PWA | |
| 2 | Frontend framework | React + TS + Vite | |
| 3 | Map library | MapLibre | |
| 4 | Time visualisation | Slider + play | |
| 5 | Data architecture | Static files | |
| 6 | Content model | Claim model | |
| 7 | Evidence scale | Custom 5-tier | |
| 8 | Comparison UI | Side-by-side, stacked on mobile | |
| 9 | Climate suitability | Precomputed layers | |
| 10 | Search | Client-side | |
| 11 | Citations | CSL-JSON | |
| 12 | Methodology | DSR + Agile | |
| 13 | Hosting / accounts | Static, no accounts | |
| 14 | Traditional knowledge sourcing | Published sources only | |
| 15 | Languages | English first | |
| 16 | MVP depth per crop | ≥ 25 paired claims, ≥ 15 alerts | |
| 17 | Target regions | (to decide: e.g. South/Southeast Asia, global) | |
