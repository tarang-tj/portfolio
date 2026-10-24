// Site gate: claim rules, chart integrity, anchors, accessibility, and (with --online) live links.
// Run: node scripts/check-site.mjs [--online]. Exits 1 on any failure.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

import { cases } from '../src/content.mjs';

const root = new URL('../', import.meta.url);
const workFiles = readdirSync(new URL('work/', root)).filter((f) => f.endsWith('.html')).sort();
const pages = ['index.html', ...workFiles.map((f) => `work/${f}`)];
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const html = pages.map(read).join('\n');
const failures = [];
const fail = (msg) => failures.push(msg);
// Visible text plus the attribute text screen readers and search engines see.
const attrs = [...html.matchAll(/\s(?:aria-label|alt|title|content)="([^"]*)"/g)].map((m) => m[1]).join(' ');
const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ') + ' ' + attrs;
// Exactly one page per case: no orphans from renamed slugs, none missing.
const expected = cases.map((c) => `${c.slug}.html`).sort();
if (expected.join() !== workFiles.join()) fail(`work/ has [${workFiles}] but content.mjs expects [${expected}]; run scripts/build.mjs`);

// Claim rules from TJ's resume print rules and the public-site ledger audit.
const banned = [
  [/\b\d{3}[-. )]{1,2}\d{3}[-. ]\d{4}\b/, 'phone number (any; the site lists email only)'],
  [/&mdash;|&#8212;|&#x2014;/i, 'em dash entity'],
  [new RegExp(String.fromCharCode(0x2014)), 'em dash'],
  [/500\+ active users/i, 'retracted SyllabusAI user count'],
  [/(?<!Major )GPA: 3\.7/, 'unlabeled GPA (must be "Major GPA: 3.7")'],
  [/SyllabusAI[^<]{0,200}\bpresent\b/i, 'SyllabusAI dated "present" (it ran Mar to Aug 2026)'],
  [/ASUWB|\$4M/, 'retired Treasurer framing'],
  [/ARIMA/, 'ARIMA (not in the Economic Pulse repo)'],
  [/ragvet/i, 'old project name'],
  [/\b22(\.0)?%|\b34(\.0)?% of|29\.5%|33,123/, 'ecommerce figure that did not reproduce on a rerun'],
  [/per week|weekly support/i, 'ticket time unit not in the record'],
  [/\b(delve|tapestry|seamless|boasts)\b/i, 'AI-writing tell'],
  // TJ asked for the "Claude formatting" to go: no arrow or middot tics, no stock hooks or display fonts.
  // Matched against `plain` (entities decoded) below, so &#8594; and &rarr; count the same as the character.
  [/[–—·•∙←-⇿➔-➿⟵-⟿]|->|=>/, 'arrow, dash or middot tic'],
  [/\bTry it\b|Read the case|I called it luck|messy data into/i, 'stock hook or label'],
];
const named = { rarr: '→', larr: '←', rArr: '⇒', harr: '↔', middot: '·', bull: '•', ndash: '–', mdash: '—' };
const plain = text
  .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);?/gi, (m, n) => named[n] ?? m);
const css = readFileSync(new URL('styles.css', root), 'utf8');
const js = ['main.js', 'scenes.js', 'hands-on.js'].map(read).join('\n');
for (const [re, why] of [
  [/@import|@font-face|fonts\.(googleapis|gstatic)/i, 'web font (the site uses the system font)'],
  [/text-shadow|drop-shadow|box-shadow\s*:[^;]*\b\d{2,}px/i, 'glow or heavy shadow'],
  [/text-transform\s*:\s*uppercase|small-caps/i, 'uppercase label style'],
  [/\\0*(2190|2192|2197|21d2|00b7|2022|2013|2014)\b/i, 'arrow, dash or middot escape in CSS'],
]) if (re.test(css + html)) fail(`banned: ${why}`);
// Text that scripts write into the page is held to the same rules.
for (const [re, why] of banned.filter(([, w]) => /tic|hook/.test(w))) if (re.test(js.replace(/=>|->/g, ''))) fail(`banned in scripts: ${why}`);
for (const [re, why] of banned) if (re.test(plain)) fail(`banned: ${why}`);
for (const must of ['Major GPA: 3.7', 'June 2027', 'tarangjammalamadaka9@gmail.com', '54.4%', '33.3%', '0.3047', '4,433']) {
  if (!text.includes(must)) fail(`missing required text: ${must}`);
}

// Chart integrity: a bar's drawn width must equal value / max * 220 (the plot width), within 1px.
const home = read('index.html');
const sceneCount = (home.match(/data-scene\b/g) || []).length;
if (sceneCount !== cases.length) fail(`expected ${cases.length} scroll scenes on the home page, found ${sceneCount}`);

// The retail scene's slider re-segments embedded per-customer data; the table printed before any
// interaction must equal what that data gives at the default 4+ threshold.
const distMatch = home.match(/<script type="application\/json" id="order-dist">([^<]+)<\/script>/);
if (!distMatch) fail('order distribution missing from the retail scene');
else {
  const dist = JSON.parse(distMatch[1]);
  const tot = dist.reduce((a, [, c, s]) => [a[0] + c, a[1] + s], [0, 0]);
  if (tot[0] !== 189) fail(`order distribution has ${tot[0]} buyers, expected 189`);
  const share = (f) => dist.filter(([n]) => f(n)).reduce((a, [, c, s]) => [a[0] + c, a[1] + s], [0, 0])
    .map((x, i) => `${((x / tot[i]) * 100).toFixed(1)}%`);
  const want = { b0: share((n) => n === 1)[0], r0: share((n) => n === 1)[1], b1: share((n) => n >= 2 && n < 4)[0],
    r1: share((n) => n >= 2 && n < 4)[1], b2: share((n) => n >= 4)[0], r2: share((n) => n >= 4)[1] };
  for (const [k, v] of Object.entries(want)) {
    const got = (home.match(new RegExp(`data-c="${k}">([^<]+)<`)) || [])[1];
    if (got !== v) fail(`retail table cell ${k} shows ${got}, the data gives ${v}`);
  }
}
// The printed label must state the same value the bar draws.
const bars = [...html.matchAll(/<rect[^>]*?data-value="([\d.]+)" data-max="([\d.]+)" data-shown="([^"]+)"[^>]*?\swidth="(\d+)"/g)];
for (const [, v, max, shown, w] of bars) {
  const px = (Number(v) / Number(max)) * 220;
  if (Math.abs(px - Number(w)) > 1) fail(`bar for ${v} is ${w}px, expected ${px.toFixed(1)}px`);
  if (Number(shown.replace(/[^\d.-]/g, '')) !== Number(v)) fail(`bar draws ${v} but its label says ${shown}`);
}
const allRects = (html.match(/<rect[^>]*data-value=/g) || []).length;
if (allRects !== bars.length) fail(`${allRects - bars.length} data bars lack data-shown or attribute order`);

// Every internal link and image resolves, every image and chart has a text alternative.
// Anchors are checked against the ids of the page they point at, not the whole site.
const idsOf = (url) => new Set([...readFileSync(url, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const page of pages) {
  const here = new URL(page, root);
  for (const [, ref] of read(page).matchAll(/(?:href|src)="(?!https?:|mailto:)([^"]*)"/g)) {
    const [file, id] = ref.split('#');
    const target = file ? new URL(file, here) : here;
    if (!existsSync(target)) { fail(`${page}: missing file ${file}`); continue; }
    if (id && !idsOf(target).has(id)) fail(`${page}: dead anchor ${ref}`);
  }
}
for (const img of html.match(/<img [^>]*>/g) || []) if (!/alt="[^"]+"/.test(img)) fail(`img without alt: ${img}`);
for (const svg of html.match(/<svg[^>]*>/g) || []) if (!/aria-label="[^"]+"/.test(svg)) fail('svg without aria-label');
for (const a of html.match(/<a [^>]*target="_blank"[^>]*>/g) || []) if (!/rel="noopener noreferrer"/.test(a)) fail(`_blank link without rel: ${a}`);

// Live links: every external href must answer 2xx/3xx.
if (process.argv.includes('--online')) {
  const urls = [...new Set([...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((m) => m[1]))]
    .filter((u) => !u.startsWith('https://fonts.'));
  await Promise.all(urls.map(async (u) => {
    try {
      const res = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
      if (res.status >= 400 && res.status !== 999) fail(`link ${u} -> ${res.status}`); // 999 = LinkedIn bot wall
    } catch (e) { fail(`link ${u} -> ${e.message}`); }
  }));
  console.log(`checked ${urls.length} external links`);
}

if (failures.length) { console.error('FAIL\n- ' + failures.join('\n- ')); process.exit(1); }
console.log(`PASS: ${pages.length} pages, claims, ${bars.length} chart bars, anchors, accessibility${process.argv.includes('--online') ? ', live links' : ''}`);
