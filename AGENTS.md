---
name: "life"
description: "A minimal single-page site about arriving, drifting, and noticing, with restrained colour accents on the quotes. It is laid out like a file open in an editor — title bar, line numbers, status bar. Hand-written HTML, CSS, and JavaScript; no frameworks, no build step, no dependencies, no tracking."
category: "Static Site"
author: "Subrat Ojha"
authorUrl: "https://github.com/Subrat-ojha"
tags: ["minimal", "single-page", "no-dependencies"]
lastUpdated: "2026-10-23"
---

# life

## Project Overview

`life` is one page. It opens like `life.md` in an editor and contains a short essay
in four movements — begin, drift, notice, end — followed by a `## quotes` section.
The point is text; the essay keeps a strict black-and-white palette, while the quotes carry restrained colour accents and highlighter marks.

It exists because a page about ordinary life should not need a framework, a font
CDN, or an analytics script. The whole site is three files and behaves correctly with
JavaScript disabled.

The repository is named `GOALS`; the site it hosts is `life`. That mismatch is
intentional and explained in `README.md`.

## Tech Stack

- **Frontend**: hand-written HTML5, CSS (custom properties, grid, `clamp()`), and
  vanilla ES2020 JavaScript. No framework, no bundler, no transpiler.
- **Backend**: none.
- **Database**: none.
- **Deployment**: static hosting; Netlify (`netlify.toml`, publish `.`, no build) or
  GitHub Pages from `main`, folder `/ (root)`.
- **Other Tools**: `python3 -m http.server` for local preview. Nothing else.

## Project Structure

```
.
├── index.html        # markup, essay, chrome, meta, noscript art
├── arguments.html    # second page: arguments about God, with replies
├── style.css         # tokens, chrome, typography, print, reduced motion
├── main.js           # palette, keyboard nav, invert, progress
├── docs/
│   └── copy.md       # essay draft — edit prose here first
├── netlify.toml      # publish ".", security headers, asset caching
├── robots.txt
├── README.md
├── LICENSE           # MIT
└── AGENTS.md
```

There is no `src/`, no `public/`, and no build output. Do not introduce them for a
single page.

## Development Guidelines

### Code Style

- Two-space indentation; LF line endings; UTF-8; trailing newline.
- Semicolons; single quotes; `const` by default, `let` when reassigned.
- Prefer small pure functions and early returns over nesting.
- No inline `<style>` or `<script>` blocks, except the three-line pre-paint
  `localStorage` read in `<head>` that prevents an invert flash.
- CSS: custom properties at `:root`, one declaration per line, no nesting, no
  preprocessor. Mobile/print/reduced-motion queries live at the file bottom in that
  order.

### Naming Conventions

- **Files**: lowercase, no prefixes (`main.js`, `style.css`).
- **CSS classes**: `kebab-case`, semantic (`.titlebar`, `.statusbar`, `.hero-text`);
  state via attributes (`[data-inverted]`), not class soup.
- **JavaScript**: `camelCase` for functions and variables.
- **IDs**: `kebab-case`, matching the element's role (`palette-input`, `open-palette`).
- **Data attributes**: `data-line` for gutter numbers, `data-inverted` for theme.

### Git Workflow

- Branch from `main`; name branches `feat/…`, `fix/…`, `docs/…`.
- Commit messages: short imperative summary, conventional prefix — `feat: add
  quotes section`, `fix: correct deploy path`, `docs: update changelog`.
- One logical change per commit. Squash before merging.
- Never commit generated assets, secrets, or `node_modules`.

## Environment Setup

### Development Requirements

- A browser with `dialog` and CSS custom properties
  (any current Chrome, Firefox, Safari, or Edge).
- Python 3 for the local server, or any static file server.
- Node.js is **not** required to build or run. It is only useful for `node --check`.

### Installation Steps

```bash
# 1. Clone
git clone https://github.com/Subrat-ojha/GOALS.git

# 2. No install step — there are no dependencies

# 3. Serve
cd GOALS
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Core Implementation

### Page chrome

`index.html` carries the title bar, the article, and the status bar. The article is
`.doc`; `main.js` walks its direct children once and stamps `data-line` on each
prose block. The gutter numbers are CSS `::before` content, so they are decorative
and disappear under 900px.

### Interaction (`main.js`)

The command palette is a native `<dialog>` opened with `showModal()`, which supplies
the focus trap, `Esc` handling, and top-layer stacking for free. `j`/`k` jump between
sections, `g g` returns to the top, `:theme` inverts the palette. Invert state is
persisted in `localStorage` and applied before first paint by the inline head script.

## Content Voice

The essay lives in `index.html`; the draft lives in `docs/copy.md`. Edit the draft
first, then move the change across in the same commit.

- Second person, plain, concrete. Short sentences. One idea per paragraph.
- 450–600 words of body copy total.
- No advice, no imperatives, no greeting-card phrasing, no stacked em dashes.
- Exactly one pull-quote, and it stays in `notice`.
- Section headings keep the `##` prefix — it is part of the editor conceit.

## Dependency Policy

Zero runtime dependencies is a feature, not an accident.

- No CDN links, no web fonts, no analytics, no cookie banners.
- If a dependency is ever proposed, it needs: a pinned local copy, a measured weight,
  a stated reason the ~100 lines it replaces are worse, and an entry in Tech Stack.
- The page must keep working with JavaScript disabled: full essay, static art frame
  per slot, no empty boxes.

## Testing Strategy

No test runner. Verification is a manual matrix, run before every commit that touches
markup, CSS, or the renderer.

### Manual checks

- Serve with `python3 -m http.server 8000`; console must be free of errors/warnings.
- Widths: 320, 480, 768, 1024, 1440px. No horizontal scroll. Gutter hidden
  under 900px.
- Keyboard only: skip link, `⌘K` palette, arrow keys, `Enter`, `Esc`, `j`/`k`, `g g`.
  Focus must never escape an open dialog.
- Reduced motion (devtools → Rendering): steady cursor, no smooth scrolling.
- JavaScript disabled: essay fully readable.
- `:theme` invert persists across reload with no flash of the wrong palette.
- Print preview: white page, black text, chrome and art suppressed.

### Performance targets

- ≤ 32KB uncompressed per page (that page's HTML plus the shared css and js).
- Four requests; no third-party origins.
- LCP < 1s on throttled mobile; CLS 0.00.
- No long tasks over 50ms; at most one active rAF loop.

## Deployment Guide

### Build Process

None. The files in the repository root are the deployable artifact.

### Netlify

1. `netlify.toml` is the contract: `publish = "."`, no build command.
2. Deploy either by connecting the repo in the Netlify UI, or
   `npx netlify-cli deploy --prod --dir .`.
3. Headers (CSP, `nosniff`, frame denial, permissions policy) are applied from
   `netlify.toml`. If a new inline script is added, update the CSP in the same commit.
4. Assets are cached for one hour with revalidation; HTML is always revalidated.

### GitHub Pages

1. Commit to `main`.
2. Repository settings → Pages → Source: deploy from branch `main`, folder `/ (root)`.
3. Confirm `index.html` is at the repository root — Pages will 404 otherwise.
4. Wait for the Pages build, then hard-reload the URL to bypass cache.

### Environment Variables

None. There is no server, no API, and no secret.

## Security Considerations

Static page, no input submitted anywhere, no third-party requests.

- The palette input is local-only and never leaves the page.
- `localStorage` holds one key, `life:invert`. Nothing identifying.
- No `innerHTML` with user or fetched data; text is written with `textContent`.
- The only external surface is hosting. Keep GitHub Pages HTTPS-only.

## Performance Optimization

- No webfonts and no images, so there is nothing to preload or lay out for.
- The page never animates layout properties; the only motion is the blinking
  cursor, disabled under reduced motion.

## Common Issues

### Issue 1: GitHub Pages shows 404 at the project URL

**Solution**: Confirm `index.html` is at the repository root, not inside a subfolder,
and that Pages is set to `main` / `/ (root)`. Project pages serve from
`https://<user>.github.io/GOALS/`.

### Issue 2: Gutter numbers are misaligned on some machines

**Solution**: Numbers are positioned off the block's first line, not the baseline, so
small font differences are expected. If it looks wrong for body copy, adjust
`.doc [data-line]::before` `top` — do not change the line-height of the prose.

### Issue 3: Inverted theme flashes black then white on load

**Solution**: The pre-paint script in `<head>` reads `life:invert` before CSS paints.
If it was moved below the stylesheet or made `defer`, the flash returns.

### Issue 4: Netlify deploy returns 404 or lists the directory

**Solution**: The publish directory must be `.` (see `netlify.toml`), not `public`
or `dist`. There is no build step, so an empty build command is correct. If headers
are not applied, confirm the deploy used the committed `netlify.toml` and not cached
site settings from the UI.

### Issue 5: `93 new.jpg` shows as deleted in `git status`

**Solution**: That image is tracked in `HEAD` but removed in the working tree. Decide
deliberately: commit the deletion (`git rm "93 new.jpg"`) or restore it
(`git checkout -- "93 new.jpg"`). Do not leave it ambiguous across commits.

## Reference Resources

- MDN: `<dialog>`, `prefers-reduced-motion`
- CSS custom properties and `clamp()`
- GitHub Pages / Netlify static hosting documentation

## Changelog

### v0.8.0 (2026-10-28)

- feat: `arguments.html` (plain English; ends with ten quick replies and five Sanskrit verses on judging a fake godman), a second page per the owner's request: ten arguments
  about God, five for the believer against the atheist and five for the atheist
  against the believer, each with its strongest reply and a source link. Chosen
  for depth over count. Added a two-link nav (`life`, `arguments`) to both
  title bars, `:arguments` / `:life` palette commands, and a cache header for
  the new page. Both pages share `style.css` and `main.js`; the 32KB budget is
  now per page (index 31.3KB, arguments 26.8KB with the shared files).
  Bumped `?v=` to 0.8.0.

### v0.7.1 (2026-10-28)

- fix: owner saw only yellow highlights on the live site. Cause: stylesheet
  was cached for an hour (max-age=3600), so browsers kept the old
  style.css, where mark.hl falls back to the browser default yellow. Added
  ?v= cache-busting to the css/js links and set both to max-age=0,
  must-revalidate. Bump the ?v= value whenever style.css or main.js changes.

### v0.7.0 (2026-10-28)

- feat: quotes curated for depth per the owner's request that the set "feel
  selective". Trimmed 17 popular-but-light lines (Jobs, Keller, Lennon,
  Gandhi, Mother Teresa, both Roosevelts, Einstein, Anne Frank, Mandela,
  Goethe, Hugo, William James, one Angelou, one Epictetus, Dalai Lama) and
  the shakily attributed Rilke "only journey" line. Added eight deeper,
  solidly attributed quotes: Seneca on imagination, Marcus Aurelius on the
  obstacle, Pascal on sitting quietly, Nietzsche on the dancing star,
  Thoreau on quiet desperation, Rilke on loving the questions, Hesse on the
  inner sanctuary, Simone Weil on attention. Set is now 43 quotes, each
  with its highlighter phrase; payload drops to ~29.5KB.


### v0.6.0 (2026-10-28)

- feat: colour and highlighter marks in `## quotes` per the owner's request.
  One key phrase per quote sits behind a translucent marker swipe
  (`mark.hl`), cycling four muted accents (yellow, green, pink, blue) via
  `nth-of-type`; attribution lines pick up the same accent. Accents darken
  under `:theme` invert; marks degrade to an underline in print.
- The essay, hero and chrome stay monochrome. No JS changes; pure CSS.


### v0.5.0 (2026-10-28)

- feat: `## quotes` grows from 12 to 52 attributed lines per the owner's request
  for "many quotes". Attributions were chosen for solid sourcing; commonly
  misattributed lines (Twain's "two most important days", Churchill's "success
  is not final", Eliot's "never too late") were deliberately left out.
- Payload stays under budget: 28.7KB across the three files.


### v0.4.0 (2026-10-28)

- remove: all ASCII art (bamboo, monk, lotus, dividers, noscript fallbacks,
  `ascii.js`) per the owner's request; the page is prose, quotes and chrome only.
- `ascii.js` deleted; hero is a single text column; unused CSS (`--art-font`,
  `.art`, `.art-static`, `.divider`) removed; three files total.
- Earlier animation work was discarded; the `feat/ascii-loops` branch was deleted
  unmerged.


### v0.2.0 (2026-10-28)

- fix: ascii renderer init referenced removed `bamboo`/`monk`/`lotus` consts and
  threw on load, leaving all art slots empty; it now reads from the `ART` map.
- feat: `## quotes` section after `## end` with twelve attributed quotes, per the
  owner's request for the best quotes ever written. This section intentionally
  sits outside the one-pull-quote content rule, which still governs the essay.
- palette gains `:quotes`; word count and line numbering pick the section up
  automatically.

### v0.1.0 (2026-10-23)

- Initial release: single page, four sections, editor chrome.
- Hand-authored ASCII loops: bamboo, seated monk, lotus — no canvas, no libraries.
- Command palette (`⌘K`), `j`/`k` navigation, invert theme, scroll progress.
- Reduced-motion and no-JavaScript fallbacks; print stylesheet.
