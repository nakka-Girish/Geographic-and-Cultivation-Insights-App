# Simple Plan

## What we are building
A website (works on phones too) about **Paddy, Oil Palm, and Soybean** with 4 screens:

1. **Map:** where each crop came from and how it spread, with a year slider.
2. **Compare:** traditional method vs. scientific method, side by side.
3. **Avoid:** a list of "don't do this" warnings, each with the reason.
4. **References:** a list of sources that students can copy into their thesis.

## What we use
| Need | Choice |
|---|---|
| Website | React (with Vite) |
| Map | Leaflet (the simplest map library) |
| Content | Plain JSON files in the project (no database, no server) |
| Hosting | Free static hosting (GitHub Pages or Netlify) |

No logins, no database, no paid services. Nothing secret to protect.

## How each piece of content looks
One simple record per fact:

```json
{
  "crop": "paddy",
  "topic": "irrigation",
  "type": "traditional",
  "text": "...",
  "supportedByScience": "yes | partly | no",
  "source": "Author, Year, link"
}
```

## Steps
1. **Collect:** gather the sources and facts for each crop (spreadsheet is fine).
2. **Build the shell:** website with 4 empty screens and the 3 crops.
3. **Map screen:** origin points and spread routes with a year slider.
4. **Compare and Avoid screens:** read the JSON files and display them.
5. **References screen:** list sources, with a "copy citation" button.
6. **Test:** ask 5-10 students to use it, and fix what confuses them.

## Later (only if needed)
Search box, regional languages, user accounts, climate-suitability layers, a database.
