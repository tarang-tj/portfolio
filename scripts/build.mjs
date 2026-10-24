// Renders index.html and work/<slug>.html from src/content.mjs. Run: node scripts/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { person as P, proof, cases, builds, experience } from '../src/content.mjs';
import { visual, shot, esc } from '../src/visuals.mjs';

const root = new URL('../', import.meta.url);
const ext = (href, text, cls = '') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;600&display=swap';

function page({ title, desc, base = '', body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="dark">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${base}styles.css">
<script>document.documentElement.classList.add('js');setTimeout(()=>{if(!window.revealReady)document.querySelectorAll('.reveal,.stage').forEach((e)=>e.classList.add('in'))},3000)</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <a class="me" href="${base}index.html"><b>${P.short}</b><span>${P.role}</span></a>
  <nav class="pill" aria-label="Sections"><a href="${base}index.html#work" data-nav="work">Work</a><a href="${base}index.html#about" data-nav="about">About</a></nav>
  <div class="out">${ext(P.linkedin, 'LinkedIn')}${ext(P.github, 'GitHub')}<a href="mailto:${P.email}">Email</a></div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <p>${P.name} &middot; Bothell, Washington &middot; <a href="mailto:${P.email}">${P.email}</a> &middot; ${ext(P.linkedin, 'LinkedIn')} &middot; ${ext(P.github, 'GitHub')}</p>
  <p>A script checks this site&rsquo;s claims, chart bars and links before it ships: ${ext('https://github.com/tarang-tj/portfolio/blob/main/scripts/check-site.mjs', 'read it')}.</p>
</footer>
<script src="${base}main.js" defer></script>
</body>
</html>
`;
}

const card = (c) => `<article class="case reveal">
  <div class="case-head"><div><h3><a class="stretch" href="work/${c.slug}.html">${c.title}</a></h3><p>${c.org}, ${c.year} &middot; ${c.line}</p></div><span class="go" aria-hidden="true">&rarr;</span></div>
  <div class="stage">${visual(c.visual)}</div>
</article>`;

const tile = (b) => `<article class="tile reveal">
  ${b.img ? `<a href="${b.url}" target="_blank" rel="noopener noreferrer" tabindex="-1">${shot(b.img, b.url, `${b.name} home page`)}</a>` : b.visual ? visual(b.visual) : ''}
  <h3>${ext(b.url, b.name)}</h3><p>${b.text}</p>${b.code ? `<p class="links">${ext(b.code, 'Code')}</p>` : ''}
</article>`;

const home = page({
  title: `${P.short} | Data analyst`,
  desc: 'Data and business analyst. Case studies from Coca-Cola, Quadcore and independent research. Graduating June 2027.',
  body: `<section class="hero">
  <h1>I turn messy data<br>into <em>decisions.</em></h1>
  <div class="hero-sub"><p>Data and business analyst. AI MarTech Intern at Coca-Cola this past summer.</p>
  <p class="dim">Graduating from UW Bothell in June 2027. Open to full-time analyst roles anywhere in the U.S.</p></div>
  <ul class="proof">${proof.map(([n, u, w]) => `<li><b>${n}</b><span>${u}</span><small>${w}</small></li>`).join('')}</ul>
</section>
<section id="work" class="work" data-section="work">
  <h2 class="label">Selected work</h2>
  ${cases.map(card).join('\n  ')}
  <h2 class="label">Also built</h2>
  <div class="tiles">${builds.map(tile).join('')}</div>
</section>
<section id="about" class="about" data-section="about">
  <h2 class="label">About</h2>
  <div class="about-grid">
    <div class="bio"><p class="lede">I like the part of analysis most people skip: checking whether the number is right before anyone acts on it.</p>
    <p>I study Management Information Systems at the University of Washington Bothell, with minors in Data Analytics and Economics. Major GPA: 3.7, Dean&rsquo;s List 2024, 2025 and 2026. I graduate in June 2027.</p>
    <p>U.S. citizen. I prefer the Pacific Northwest or the Bay Area and will relocate anywhere in the U.S. for the right team.</p>
    <p class="cta"><a class="btn" href="mailto:${P.email}">${P.email}</a></p></div>
    <div>
      <h3 class="label">Experience</h3>
      <ol class="xp">${experience.map(([when, role, org, note]) => `<li><span class="when">${when}</span><div><b>${role}</b>, ${org}${note ? `<small>${note}</small>` : ''}</div></li>`).join('')}</ol>
      <h3 class="label">Tools</h3>
      <p class="tools">SQL (PostgreSQL, SQL Server) &middot; Python (pandas, Streamlit) &middot; R &middot; Excel &middot; Power BI and DAX &middot; Tableau &middot; Azure OpenAI &middot; Claude API</p>
      <h3 class="label">Certifications and awards</h3>
      <p class="tools">Microsoft Certified: Power BI Data Analyst &middot; Anthropic: AI Fluency &middot; First place, CED Finance Case Competition &middot; 14th of 1,983, HackerRank Orchestrate</p>
    </div>
  </div>
</section>`,
});

const casePage = (c, i) => {
  const next = cases[(i + 1) % cases.length];
  return page({
    title: `${c.title} | ${P.short}`, desc: c.line, base: '../',
    body: `<article class="cs">
  <a class="back" href="../index.html#work">&larr; All work</a>
  <header class="cs-head"><p class="label">${c.org} &middot; ${c.year}</p><h1>${c.title}</h1><p class="dim">${c.line}</p></header>
  <div class="stage">${visual(c.visual)}</div>
  <div class="cs-grid">
    <dl class="meta"><dt>My role</dt><dd>${c.role}</dd><dt>Context</dt><dd>${c.team}</dd><dt>Timeline</dt><dd>${c.when}</dd><dt>Tools</dt><dd>${c.tools}</dd></dl>
    <div class="cs-body">${c.overview.map((p) => `<p>${p}</p>`).join('')}
      <div class="finding"><p class="label">What I found</p><p>${c.finding}</p></div>
      <table class="figs"><tbody>${c.figures.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      <p class="dim small">${c.note}</p>
      ${c.links.length ? `<p class="links">${c.links.map(([t, h]) => ext(h, t)).join('')}</p>` : ''}
    </div>
  </div>
  <a class="next" href="${next.slug}.html"><span class="label">Next</span>${next.title} &rarr;</a>
</article>`,
  });
};

writeFileSync(new URL('index.html', root), home);
mkdirSync(new URL('work/', root), { recursive: true });
cases.forEach((c, i) => writeFileSync(new URL(`work/${c.slug}.html`, root), casePage(c, i)));
console.log(`built index.html + ${cases.length} case pages`);
