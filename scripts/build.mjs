// Renders index.html and work/<slug>.html from src/content.mjs. Run: node scripts/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { person as P, proof, cases, builds, experience } from '../src/content.mjs';
import { visual, esc } from '../src/visuals.mjs';
import { scenes } from '../src/scenes.mjs';

const root = new URL('../', import.meta.url);
const FONT = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;700;800;900&display=swap';
const ext = (href, text, cls = '') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

function page({ title, desc, base = '', body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="light">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT}">
<link rel="stylesheet" href="${base}styles.css">
<script>document.documentElement.classList.add('js');setTimeout(()=>{if(!window.revealReady)document.querySelectorAll('.reveal,.stage').forEach((e)=>e.classList.add('in'))},3000)</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <a class="me" href="${base}index.html">TJ<span class="sur"> Jammalamadaka</span></a>
  <nav aria-label="Main"><a href="${base}index.html#work" data-nav="work">Work</a><a href="${base}index.html#about" data-nav="about">About</a>${ext(P.linkedin, 'LinkedIn')}${ext(P.github, 'GitHub')}<a href="mailto:${P.email}">Email</a></nav>
</header>
${base ? '' : '<canvas id="dots" aria-hidden="true"></canvas>\n'}<main id="main">
${body}
</main>
<footer class="foot">
  <p>${P.name}, Bothell, Washington. <a href="mailto:${P.email}">${P.email}</a>, ${ext(P.linkedin, 'LinkedIn')}, ${ext(P.github, 'GitHub')}.</p>
  <p>A ${ext('https://github.com/tarang-tj/portfolio/blob/main/scripts/check-site.mjs', 'script')} in the repo checks the numbers on this site against their sources.</p>
</footer>
<script src="${base}main.js" defer></script>${base ? '' : ['dots-layouts', 'dots-engine', 'story', 'hands-on'].map((n) => `\n<script src="${n}.js" defer></script>`).join('')}
</body>
</html>
`;
}

const tile = (b) => `<article class="tile reveal">
  ${b.visual ? visual(b.visual) : ''}
  <h3>${ext(b.url, b.name)}</h3><p>${b.text}</p>${b.code ? `<p class="links">${ext(b.code, 'Code')}</p>` : ''}
</article>`;

const home = page({
  title: `${P.short} | Data analyst`,
  desc: 'Data and business analyst. Case studies from Coca-Cola, Quadcore and independent research. Graduating June 2027.',
  body: `<section class="hero" data-layout="scatter" data-cap="">
  <p class="hero-role">Data and business analyst</p>
  <h1>Tarang (TJ)<br>Jammalamadaka</h1>
  <p class="intro">I&rsquo;m a data and business analyst finishing a degree in Management Information Systems at the University of Washington Bothell. This summer I was an AI MarTech Intern at The Coca-Cola Company. I graduate in June 2027 and I&rsquo;m looking for a full-time analyst role.</p>
  <ul class="stats">${proof.map(([n, w]) => `<li><b>${n}</b><span>${w}</span></li>`).join('')}</ul>
</section>
<section id="work" class="work" data-section="work">
  <h2 class="sec-title">Four projects, told with their own data</h2>
  <p class="sec-sub">Most dots here stand for one real person, ticket, market or buyer from the work. The note under each picture says what one dot is.</p>
  <div class="story">${scenes}</div>
</section>
<section class="others" data-layout="none" data-cap="">
  <h2 class="sec-title">Other projects</h2>
  <div class="tiles">${builds.map(tile).join('')}</div>
</section>
<section id="about" class="about" data-section="about" data-layout="none" data-cap="">
  <h2>About</h2>
  <div class="about-grid">
    <div class="bio"><p>I study Management Information Systems at the University of Washington Bothell, with minors in Data Analytics and Economics. Major GPA: 3.7, Dean&rsquo;s List 2024, 2025 and 2026. I graduate in June 2027.</p>
    <p>U.S. citizen. I prefer the Pacific Northwest or the Bay Area and will relocate anywhere in the U.S. for the right team.</p>
    <p>The best way to reach me is email: <a href="mailto:${P.email}">${P.email}</a>.</p></div>
    <div>
      <h3>Experience</h3>
      <ol class="xp">${experience.map(([when, role, org, note]) => `<li><span class="when">${when}</span><div><b>${role}</b>, ${org}${note ? `<small>${note}</small>` : ''}</div></li>`).join('')}</ol>
      <h3>Tools</h3>
      <p class="tools">SQL (PostgreSQL, SQL Server), Python (pandas, Streamlit), R, Excel, Power BI and DAX, Tableau, Azure OpenAI, Claude API.</p>
      <h3>Certifications and awards</h3>
      <ul class="tools"><li>Microsoft Certified: Power BI Data Analyst</li><li>Anthropic: AI Fluency</li><li>First place, CED Finance Case Competition</li><li>14th of 1,983, HackerRank Orchestrate</li></ul>
    </div>
  </div>
</section>`,
});

// Each case keeps the color its chapter uses on the home page.
const HUE = { 'coca-cola': 'red', quadcore: 'blue', kalshi: 'gold', 'retail-sql': 'green' };
const casePage = (c, i) => {
  const next = cases[(i + 1) % cases.length];
  return page({
    title: `${c.title} | ${P.short}`, desc: c.line, base: '../',
    body: `<article class="cs" style="--hue:var(--${HUE[c.slug]})">
  <a class="back" href="../index.html#work">Back to all work</a>
  <header class="cs-head"><p class="kicker">${c.org}, ${c.year}</p><h1>${c.title}</h1><p class="dim">${c.line}</p></header>
  <div class="stage">${visual(c.visual)}</div>
  <div class="cs-grid">
    <dl class="meta"><dt>My role</dt><dd>${c.role}</dd><dt>Context</dt><dd>${c.team}</dd><dt>Timeline</dt><dd>${c.when}</dd><dt>Tools</dt><dd>${c.tools}</dd></dl>
    <div class="cs-body">${c.overview.map((p) => `<p>${p}</p>`).join('')}
      <h2 class="h-find">What I found</h2><p>${c.finding}</p>
      <table class="figs"><tbody>${c.figures.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      <p class="dim small">${c.note}</p>
      ${c.links.length ? `<p class="links">${c.links.map(([t, h]) => ext(h, t)).join('')}</p>` : ''}
    </div>
  </div>
  <p class="next">Next case study: <a href="${next.slug}.html">${next.title}</a></p>
</article>`,
  });
};

writeFileSync(new URL('index.html', root), home);
mkdirSync(new URL('work/', root), { recursive: true });
cases.forEach((c, i) => writeFileSync(new URL(`work/${c.slug}.html`, root), casePage(c, i)));
console.log(`built index.html + ${cases.length} case pages`);
