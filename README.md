# TJ Jammalamadaka, analyst portfolio

Live: https://tarang-tj.github.io/portfolio/

A static portfolio for data, business and product analyst roles. Each case study is shown inside the kind of window the work was done in: a SQL editor, a notebook, a run log. Plain HTML, CSS and a small script, served by GitHub Pages.

## Build

```
node scripts/build.mjs
```

Every figure and line of copy lives once in `src/content.mjs`. `src/visuals.mjs` draws the windows and charts. `src/scenes.mjs` writes the home page's scroll scenes, which `scenes.js` plays as you scroll (pinned window, story beats, typing) and `hands-on.js` makes interactive: the run-log toggle, the ticket before/after, a Brier score calculator, and a loyalty slider that re-segments the real per-customer order counts. With reduced motion on, the scenes render as static, fully visible sections. The build writes `index.html` and `work/<slug>.html`; commit the output, Pages serves it as is.

## Gate

```
node scripts/build.mjs && node scripts/check-site.mjs --online
```

The gate checks every page and fails on any of these:
- a banned or retired claim, or an em dash
- a missing "Major GPA: 3.7"
- a chart bar whose drawn width doesn't match its stated value
- a missing internal file, image or anchor
- an image or chart with no text alternative
- an external link that doesn't load

Screenshots in `img/` are of TJ's own live products. Every number comes from a linked public source or from TJ's work records.
