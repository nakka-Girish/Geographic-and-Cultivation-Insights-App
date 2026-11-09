# Geographic-and-Cultivation-Insights-App

🌾 Thesis Project Proposal: Geographic & Cultivation Insights App
📌 Project Overview
An interactive mobile/web application designed for agricultural students and researchers. The app will serve as an educational and analytical tool providing deep insights into three key crops:
 * Paddy (Rice)
 * Oil Palm (Palmoil / Palmolive)
 * Soybean
🎯 Key Objectives
 * Geographical & Historical Origin Mapping
   * Trace the historical origin, migration paths, and global/regional dissemination of each crop.
   * Provide geospatial visualization (interactive maps/timelines) showing how cultivation shifted over time across different agro-climatic zones.
 * Comparative Cultivation Framework
   * Traditional Cultivation Practices: Document indigenous knowledge systems, organic soil prep, seed saving, traditional water management, and seasonal crop cycles.
   * Scientific & Evidence-Based Agronomy: Detail optimized planting density, pest and disease management (IPM), soil nutrient dynamics, yield optimization, and post-harvest technology based on peer-reviewed scientific literature.
 * Risk Mitigation & Scientific Avoidance
   * Highlight critical "what NOT to do" guidelines (e.g., preventing chemical overuse, preventing soil salinization, avoiding bad crop rotation sequences, and pest resistance prevention).
   * Cross-reference traditional agricultural wisdom with modern scientific validation to highlight safe, sustainable practices.
💡 Key Features & Functionality
 * 🗺️ Interactive Crop Map & Timeline: Explore historical distribution and climatic adaptability for Paddy, Oil Palm, and Soybean.
 * ⚖️ Side-by-Side Module: Compare traditional vs. modern scientific methods for planting, irrigation, fertilization, and harvesting.
 * ⚠️ Scientific Avoidance & Risk Alerts: Actionable recommendations on pitfalls, soil health hazards, and ecological impacts to avoid.
 * 📚 Student Research Hub: Bibliographic references and data sets for academic research and thesis documentation.
🎓 Target Audience & Impact
 * Primary Users: Agricultural science students, thesis researchers, and extension workers.
 * Core Benefit: Bridges the gap between traditional agricultural practices and modern scientific evidence, empowering researchers to make data-backed, sustainable recommendations.


---

### Current build

A study app for agricultural students and researchers covering **Paddy (Rice)**, **Oil Palm**, and **Soybean**.

| Screen | What it shows |
|---|---|
| Map | Where each crop came from and how it spread, with a year slider |
| Compare | Traditional vs. scientific methods side by side |
| Avoid | "Don't do this" warnings with the reason and a better option |
| References | The sources behind everything, with a copy-citation button |

**Content status: draft.** The content was written from general knowledge of the literature. Every reference is marked unverified in the app. Check each source, and have a domain expert review the content, before using it in a thesis.

### Run it

```
npm install
npm run dev        # develop: open the address it prints
npm test           # run the tests
npm run build      # production build into dist/
npm run preview    # try the production build locally
```

### Documentation (`docs/`)

| Read this | For |
|---|---|
| `phases/PHASE_1_FOUNDATION.md` | Project setup, content data, app shell |
| `phases/PHASE_2_MAP.md` | The map and year slider |
| `phases/PHASE_3_COMPARE_AVOID_REFERENCES.md` | The other three screens |
| `TECHNOLOGY_GUIDE.md` | Every library, React and TypeScript idea, pattern, and principle used |
| `SIMPLE_PLAN.md` | The plan this build follows |
| `IMPLEMENTATION_PLAN.md`, `TECHNIQUE_OPTIONS_AND_DECISIONS.md`, `OPTIONS_GLOSSARY.md` | Earlier, larger plan and option analysis (background only) |

### Adding content

All content is in `src/data/*.json`. Add a record in the same shape as the existing ones. `npm test` checks that ids are unique and every cited source exists.
