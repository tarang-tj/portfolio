# TJ Jammalamadaka, analyst portfolio

Live: https://tarang-tj.github.io/portfolio/

A static, no-build portfolio for data, business and product analyst roles. Plain HTML, CSS and a small script, served by GitHub Pages.

## Gate

```
node scripts/check-site.mjs --online
```

The gate fails on any of these:
- a banned or retired claim, or an em dash
- a missing "Major GPA: 3.7"
- a chart bar whose drawn width doesn't match its stated value
- a dead in-page anchor
- a chart with no text alternative
- an external link that doesn't load

Every number on the page comes from a linked public source or from TJ's work records.
