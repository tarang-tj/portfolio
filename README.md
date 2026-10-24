# TJ Jammalamadaka, analyst portfolio

Live: https://tarang-tj.github.io/portfolio/

A static portfolio for data, business and product analyst roles, built as a data story. One field of dots runs down the home page: scattered behind the name in the hero, then rearranged into each project's real data as you scroll (people, support tickets, prediction markets, buyers). Plain HTML, CSS and a few small scripts, served by GitHub Pages.

## Build

```
node scripts/build.mjs
```

Every figure and line of copy lives once in `src/content.mjs`. `src/scenes.mjs` writes the four home-page chapters; each step names a dot layout and prints every count that layout draws. The scripts:

- `dots-layouts.js` computes where the dots go for each step, from the `#dot-counts` and `#order-dist` blocks the build writes into the page.
- `dots-engine.js` draws them on one fixed canvas and tweens between layouts. It only runs frames while a tween is in progress.
- `story.js` finds the step in the middle of the screen and tells the engine which layout to show.
- `hands-on.js` wires the controls: the run-log toggle, tickets before and after the fixes, a Brier score calculator, and a loyalty slider that regroups the dots from the real per-customer order counts.

With reduced motion on, the dots jump straight to each layout. Without JavaScript the canvas is hidden and every step still reads as text. The build writes `index.html` and `work/<slug>.html`; commit the output, and Pages serves it as is.

## Gate

```
node scripts/build.mjs && node scripts/check-site.mjs --online
```

The gate checks every page and fails on any of these:
- a banned or retired claim, an em dash, or one of the removed styling tics (arrows, middots, stock hooks, glow, uppercase labels, the old display fonts)
- a missing "Major GPA: 3.7"
- a count the dots draw that the page does not print, or a step naming a layout that does not exist
- a retail table cell that disagrees with the embedded order data
- a chart bar whose drawn width or label doesn't match its value
- a missing internal file, image or anchor, or one case page too many or too few
- an image or chart with no text alternative
- an external link that doesn't load

Every number comes from a linked public source or from TJ's work records.
