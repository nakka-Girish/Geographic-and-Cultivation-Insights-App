# Options Glossary: what each option is for

Plain-language companion to `TECHNIQUE_OPTIONS_AND_DECISIONS.md`. Each entry says what the thing is, what it is used for, and when you would pick it.

---

## 1. Delivery platform: how users get the app
- **PWA (Progressive Web App):** a website that can be installed on a phone's home screen and works offline. It is one codebase for phone and desktop, with no app store.
- **React Native / Flutter:** toolkits for building real phone apps for the App Store and Play Store. Pick them if you need native phone features or store distribution.
- **Capacitor:** wraps a web app or PWA into a store-ready phone app. It is a later upgrade path if you want store presence.
- **Desktop-only web:** a site designed for laptops. It is the simplest, but it ignores the mobile requirement.

## 2. Frontend framework: how the screens are built
- **React + TypeScript + Vite:** React builds interactive screens from components. TypeScript adds type checking to catch mistakes early. Vite is the fast build and dev tool. It has the most map and chart add-ons.
- **Astro / Next.js:** frameworks that pre-build pages as plain HTML, so every page has a stable, citable URL and loads quickly. Pick them if page permalinks and SEO matter most.
- **SvelteKit:** a lighter framework that produces small, fast apps. Its ecosystem is smaller.
- **Angular:** a full, opinionated framework with strong structure. Pick it if you already know it well.

## 3. Map library: how maps are drawn
- **MapLibre GL JS:** a free, open-source engine that draws smooth, zoomable vector maps in the browser. It needs no paid key.
- **Leaflet:** a very simple, lightweight map library. It is great for basic maps and weaker with large or animated data.
- **OpenLayers:** a powerful GIS-grade library. It handles map projections and professional map services. It is more complex.
- **deck.gl:** a layer for large animated visuals, such as arcs showing crop migration. It sits on top of a map library.
- **Mapbox / Google Maps:** polished commercial maps. They need an API key (a secret to protect), cost money, and lock you in.

## 4. Time and history display: how the timeline works
- **Slider filtering:** drag a year slider and the map shows only what was true in that year.
- **Animated playback:** a play button that moves the slider by itself, so you can watch spread over time. It is good for teaching.
- **Separate timeline chart:** a standalone horizontal chart of events. It is useful, but it duplicates the slider.
- **Space-time cube:** a research-grade 3D method for analysing change over space and time. It is too heavy for this project.

## 5. Data architecture: where the content lives
- **Static files in the repo:** content is stored as text files (YAML/JSON/GeoJSON) and built into the site. There is no database or server to run or attack, and git history records every change.
- **In-browser database (SQLite/DuckDB-WASM):** a small database that runs inside the browser, so users can filter and query large tables without a server.
- **API + PostgreSQL/PostGIS:** a real server and database. PostGIS adds spatial queries such as "find all regions within 100 km". Pick it for many users, live updates, or user-created data.
- **Headless CMS / Backend-as-a-Service (Strapi, Directus, Supabase):** a ready-made admin screen and database. Reviewers who don't use git can edit content there. You then manage accounts and secrets.

## 6. Content model: how knowledge is structured
- **Claim model:** each fact is a small record with its source, evidence grade, region, and a link to its traditional or scientific partner. Comparison, alerts, and citations all draw on it.
- **Flat articles:** plain pages of prose. They are fast to write and cannot be compared or cross-checked automatically.
- **Knowledge graph (RDF/OWL/Neo4j):** facts stored as a network of linked concepts, so you can ask complex questions. It is powerful and needs ontology expertise.
- **Spreadsheet-first:** domain experts fill in a spreadsheet, which is then imported and validated. It is friendly for reviewers.

## 7. Evidence grading: how strong each claim is
- **Custom 5-tier agronomy scale:** ranks sources from systematic reviews and multi-site trials down to single trials, surveys, and expert or ethnographic knowledge. It fits agriculture.
- **GRADE:** a standard way to rate evidence quality, designed for medicine. It is well known but awkward for farming.
- **Oxford CEBM levels:** a simple evidence hierarchy, also built for clinical research.
- **No grading:** show citations only. It is the least work, but "evidence-based" becomes harder to justify.
- **Validation status** is separate: it says whether science supports, partly supports, doesn't support, contradicts, or warns against a traditional practice.

## 8. Comparison view: how traditional and scientific are shown
- **Side-by-side rows:** the traditional method on the left, the scientific one on the right, with a badge showing whether science backs it. It matches the brief.
- **Matrix:** a grid of practices against crop stages. It gives a good overview and is dense.
- **Growth-stage timeline (BBCH):** practices laid out along the crop's life cycle, from sowing to harvest. BBCH is the standard code scale for growth stages.
- **Tabs:** a "Traditional" tab and a "Scientific" tab. It is easy on a phone, but you can't see both at once.

## 9. Climate suitability: how "where it can grow" is shown
- **Precomputed layers (WorldClim, FAO GAEZ):** WorldClim supplies global temperature and rainfall data. GAEZ is the FAO's crop-suitability model. You process them once into map layers.
- **Rule-based thresholds (EcoCrop):** EcoCrop lists each crop's ideal temperature, rainfall, and soil ranges. The app checks a location against those ranges. It is simple, transparent, and interactive.
- **Species distribution model (MaxEnt + GBIF):** a statistical model that learns where a crop grows from recorded sightings (GBIF is the global occurrence database). It is strong science and needs R/Python skills and validation time.
- **Hand-drawn zones:** manually drawn regions. They are the fastest and the least rigorous.

## 10. Search: how users find things
- **Client-side search (MiniSearch / Pagefind):** an index shipped with the site, so search runs in the browser. It is free and works offline.
- **Algolia:** a hosted search service with excellent relevance. It is a third party with keys and costs.
- **Meilisearch / Postgres full-text:** your own search server. It is powerful and needs a backend.

## 11. Citations: how references are managed
- **CSL-JSON + Zotero:** CSL-JSON is the standard data format for references. Zotero is the free tool researchers use to collect them. The app can export BibTeX, RIS, or APA from it.
- **BibTeX-only:** the LaTeX format. It is familiar and holds less detail.
- **Database-only:** a custom store. It reinvents what the standards already do.

## 12. Methodology: how the project is run
- **Design Science Research (DSR):** a thesis method where you build a useful artifact, here the app, and then evaluate it scientifically.
- **Agile sprints:** work in 2-week cycles, with something usable at the end of each.
- **Waterfall:** finish the full design, then build, then test. It is rigid and a poor fit for content that keeps evolving.
- **Design Thinking:** an empathy-led method focused on user needs. It is strong on ideas and light on rigour.
- **Evaluation tools:**
  - **SUS (System Usability Scale):** a 10-question usability score out of 100. 70 or above is considered good.
  - **Expert panel with Likert ratings:** specialists rate content accuracy on a 1–5 scale. Cohen's or Fleiss' kappa measures how much they agree.
  - **Pre/post quiz:** tests whether users learned something.

## 13. Hosting and accounts: where it runs and who can log in
- **Static host, no accounts (GitHub Pages / Netlify / Azure Static Web Apps):** serves ready-made files. It is the safest option, with no secrets and no personal data.
- **Static + anonymous analytics (Plausible/Umami):** adds visit counts without cookies or personal data. It gives usage evidence for the thesis.
- **API with login:** allows saved bookmarks, feedback, and admin screens. It brings authentication, secrets, privacy law (GDPR) duties, and patching.
- **Security terms used in the plan:**
  - **CSP (Content Security Policy):** a browser rule that blocks unauthorised scripts.
  - **Dependency scanning:** automatic checks for known flaws in third-party code.
  - **Sanitising:** cleaning outside text before showing it, so it can't run as code.

## 14. Traditional knowledge: how it is gathered ethically
- **Published sources only:** use papers, books, and reports, and credit the communities. It is low risk.
- **Primary fieldwork interviews:** talk to farmers yourself. It gives original data and needs ethics approval and consent.
- **Community co-curation:** communities help write the content. It is the best practice and the slowest.
- **CARE principles:** a framework for respecting indigenous data (Collective benefit, Authority to control, Responsibility, Ethics).
- **Nagoya Protocol:** an international agreement on fair sharing of benefits from genetic resources and associated traditional knowledge.

## 15. Language and accessibility
- **i18n (internationalisation):** building the app so text can be translated later without rewriting code.
- **WCAG 2.2 AA:** the international web accessibility standard. It means keyboard use, readable contrast, and screen-reader support.
- **Data-table alternative:** a text table behind each map or chart for users who can't use the visual.
