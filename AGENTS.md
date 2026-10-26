---
name: "life"
description: "A minimal, monochrome single-page site about arriving, drifting, and noticing. It is laid out like a file open in an editor — title bar, line numbers, status bar — and animated with three ASCII organisms rendered from a canvas luminance ramp. Hand-written HTML, CSS, and JavaScript; no frameworks, no build step, no dependencies, no tracking."
category: "Static Site"
author: "Subrat Ojha"
authorUrl: "https://github.com/Subrat-ojha"
tags: ["minimal", "monochrome", "single-page", "ascii", "no-dependencies"]
lastUpdated: "2026-10-23"
---

# life

## Project Overview

`life` is one page. It opens like `life.md` in an editor and contains a short essay
in four movements — begin, drift, notice, end — with three hand-drawn ASCII pieces
between sections: a bamboo stand, a seated monk, and a lotus. The point is text,
quiet motion, and a strict black-and-white palette.

It exists because a page about ordinary life should not need a framework, a font
CDN, or an analytics script. The whole site is four files and behaves correctly with
JavaScript disabled.

The repository is named `GOALS`; the site it hosts is `life`. That mismatch is
intentional and explained in `README.md`.

## Tech Stack

- **Frontend**: hand-written HTML5, CSS (custom properties, grid, `clamp()`), and
  vanilla ES2020 JavaScript. No framework, no bundler, no transpiler.
- **Rendering**: hand-authored ASCII frame loops in `ascii.js` — no canvas, no
  libraries, no images.
- **Backend**: none.
- **Database**: none.
- **Deployment**: static hosting; Netlify (`netlify.toml`, publish `.`, no build) or
  GitHub Pages from `main`, folder `/ (root)`.
- **Other Tools**: `python3 -m http.server` for local preview. Nothing else.

## Project Structure

```
.
├── index.html        # markup, essay, chrome, meta, noscript art
├── style.css         # tokens, chrome, typography, print, reduced motion
├── ascii.js          # frame player + bamboo / monk / lotus art
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

- **Files**: lowercase, no prefixes (`ascii.js`, `style.css`).
- **CSS classes**: `kebab-case`, semantic (`.titlebar`, `.statusbar`, `.art-bamboo`);
  state via attributes (`[data-inverted]`), not class soup.
- **JavaScript**: `camelCase` for functions and variables; art data lives in
  `SCREAMING_SNAKE`-free consts named for the piece (`bamboo`, `monk`, `lotus`).
- **IDs**: `kebab-case`, matching the element's role (`art-bamboo`, `palette-input`).
- **Data attributes**: `data-line` for gutter numbers, `data-inverted` for theme.

### Git Workflow

- Branch from `main`; name branches `feat/…`, `fix/…`, `docs/…`.
- Commit messages: short imperative summary, conventional prefix — `feat: add monk
  divider`, `fix: pad lotus frames`, `docs: correct deploy path`.
- One logical change per commit. Squash before merging.
- Never commit generated assets, secrets, or `node_modules`.

## Environment Setup

### Development Requirements

- A browser with `dialog`, `IntersectionObserver`, and CSS custom properties
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

### ASCII renderer (`ascii.js`)

Each art slot is a `<pre>` filled with hand-authored frames — arrays of equal-width,
equal-height strings. The player swaps frames on an interval and pauses when the
element leaves the viewport. There is no canvas and no sampling, because dithered
vector shapes at this size are unreadable; the glyphs are the drawing.

```js
function paint() {
  el.textContent = frames[index].join('\n');
  index = (index + 1) % frames.length;
}
```

Frame data lives at the top of the file as `bamboo`, `monk`, and `lotus`. Loops are
palindromic (`0,1,2,1`) so motion reverses instead of snapping back to the first
frame.

### Interaction (`main.js`)

The command palette is a native `<dialog>` opened with `showModal()`, which supplies
the focus trap, `Esc` handling, and top-layer stacking for free. `j`/`k` jump between
sections, `g g` returns to the top, `:theme` inverts the palette. Invert state is
persisted in `localStorage` and applied before first paint by the inline head script.

## ASCII Rendering Rules

These are invariants. Breaking them produces visible bugs.

1. **Fixed dimensions per loop.** Every frame in an array must have the same number
   of lines and the same line width, including trailing spaces. A short line shrinks
   the `<pre>` box and shifts the layout mid-animation.
2. **Slow intervals.** 900–2000ms per frame is deliberate. These are natural motions
   (wind, breath, bloom), not sprites. Do not add a 60fps tween.
3. **Palindromic loops.** Order frames like `[a, b, c, b]` so the motion returns the
   way it came. A loop that jumps from open to closed reads as a glitch.
4. **Pause when not visible.** `IntersectionObserver` and `visibilitychange` stop the
   interval. At most one loop should run at a given scroll position.
5. **Reduced motion paints one frame.** Under `prefers-reduced-motion: reduce`,
   `create()` paints frame 0 and returns no-op controls.
6. **Decorative in the accessibility tree.** Every `<pre>` is `aria-hidden="true"`
   and paired with an `.sr-only` sentence. Never put meaning only in ASCII.
7. **Monochrome only.** Intensity comes from glyph density, never from color. The
   monk's saffron robe is rendered as a dense `#` block, not as hue.
8. **Art must be recognizable at rest.** If a piece needs the caption to be
   identified, redraw it. Detail beats abstraction at this scale.

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
- Widths: 320, 480, 768, 1024, 1440px. No horizontal scroll. Art hidden under 620px,
  gutter hidden under 900px.
- Keyboard only: skip link, `⌘K` palette, arrow keys, `Enter`, `Esc`, `j`/`k`, `g g`.
  Focus must never escape an open dialog.
- Reduced motion (devtools → Rendering): no timers, static art frame, steady cursor.
- JavaScript disabled: essay fully readable, one static frame per art slot.
- `:theme` invert persists across reload with no flash of the wrong palette.
- Print preview: white page, black text, chrome and art suppressed.
- Record 2 seconds of the hero and step through frames: no cell-level flicker.

### Performance targets

- ≤ 32KB uncompressed across the four files.
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

- Art frames are short strings swapped with `textContent` at 0.9–2s intervals; no
  canvas, no pixel work, no layout-triggering animation.
- Loops pause offscreen and in hidden tabs; scenes are gated by `IntersectionObserver`.
- No webfonts and no images, so there is nothing to preload or lay out for.
- Animation durations are short; the page never animates layout properties.

## Common Issues

### Issue 1: GitHub Pages shows 404 at the project URL

**Solution**: Confirm `index.html` is at the repository root, not inside a subfolder,
and that Pages is set to `main` / `/ (root)`. Project pages serve from
`https://<user>.github.io/GOALS/`.

### Issue 2: ASCII art shifts or wraps on a narrow screen

**Solution**: The `<pre>` must keep `white-space: pre`. If it wraps, a parent is
constraining the width — check the container, not the art. Do not shrink the art by
changing the font mid-loop; use the `--art-font` token.

### Issue 3: ASCII art jitters or the layout shifts while it animates

**Solution**: The frames are not the same size. Every line in every frame of a loop
must be padded to the same width (trailing spaces included) and every frame must have
the same line count. Check with `node -e` or the frame test before committing.

### Issue 4: Gutter numbers are misaligned on some machines

**Solution**: Numbers are positioned off the block's first line, not the baseline, so
small font differences are expected. If it looks wrong for body copy, adjust
`.doc [data-line]::before` `top` — do not change the line-height of the prose.

### Issue 5: Inverted theme flashes black then white on load

**Solution**: The pre-paint script in `<head>` reads `life:invert` before CSS paints.
If it was moved below the stylesheet or made `defer`, the flash returns.

### Issue 6: Netlify deploy returns 404 or lists the directory

**Solution**: The publish directory must be `.` (see `netlify.toml`), not `public`
or `dist`. There is no build step, so an empty build command is correct. If headers
are not applied, confirm the deploy used the committed `netlify.toml` and not cached
site settings from the UI.

### Issue 7: `93 new.jpg` shows as deleted in `git status`

**Solution**: That image is tracked in `HEAD` but removed in the working tree. Decide
deliberately: commit the deletion (`git rm "93 new.jpg"`) or restore it
(`git checkout -- "93 new.jpg"`). Do not leave it ambiguous across commits.

## Reference Resources

- MDN: `<dialog>`, `IntersectionObserver`, `prefers-reduced-motion`
- CSS custom properties and `clamp()`
- Monospace grid alignment and `white-space: pre`
- GitHub Pages / Netlify static hosting documentation

## Changelog

### v0.1.0 (2026-10-23)

- Initial release: single page, four sections, editor chrome.
- Hand-authored ASCII loops: bamboo, seated monk, lotus — no canvas, no libraries.
- Command palette (`⌘K`), `j`/`k` navigation, invert theme, scroll progress.
- Reduced-motion and no-JavaScript fallbacks; print stylesheet.
