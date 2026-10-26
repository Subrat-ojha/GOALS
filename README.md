# life

A minimal, monochrome, single-page site about arriving, drifting, and noticing.
It looks like a file open in an editor: title bar, line numbers, status bar, and
three ASCII organisms that grow, swim, and pulse.

No frameworks, no build step, no dependencies, no tracking. Four files.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup, essay, chrome, meta |
| `style.css` | Tokens, typography, layout, print, reduced motion |
| `ascii.js` | Frame player and the bamboo / monk / lotus art |
| `main.js` | Command palette, invert, keyboard nav, scroll progress |

## Controls

| Input | Action |
| --- | --- |
| `Ctrl/⌘ + K` or the status-bar button | Command palette |
| `j` / `k` | Next / previous section |
| `g` `g` | Back to top |
| `:theme` | Invert black and white |

## Deploy

### Netlify (recommended)

`netlify.toml` is committed, so there is nothing to configure in the UI:

```bash
# one-off, from the repo root
npx netlify-cli deploy --prod --dir .
```

Or connect the repository at <https://app.netlify.com/start> — Netlify reads
`netlify.toml`, which sets the publish directory to `.` and applies security headers.
Build command: none. Output directory: `.`.

### GitHub Pages

Settings → Pages → deploy from branch `main`, folder `/ (root)`. `index.html` must
stay at the repository root.

## Note on the repo name

The repository is `GOALS`; the page it hosts is `life`. The name lives in the essay,
not the URL.

## License

MIT — see `LICENSE`.
