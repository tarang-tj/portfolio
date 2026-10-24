// Site gate: claim rules, chart integrity, anchors, accessibility, and (with --online) live links.
// Run: node scripts/check-site.mjs [--online]. Exits 1 on any failure.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const text = html.replace(/<[^>]+>/g, ' ');
const failures = [];
const fail = (msg) => failures.push(msg);

// Claim rules from TJ's resume print rules and the public-site ledger audit.
const banned = [
  [/\b\d{3}[-. )]{1,2}\d{3}[-. ]\d{4}\b/, 'phone number (any; the site lists email only)'],
  [/—/, 'em dash'],
  [/500\+ active users/i, 'retracted SyllabusAI user count'],
  [/(?<!Major )GPA: 3\.7/, 'unlabeled GPA (must be "Major GPA: 3.7")'],
  [/SyllabusAI[^<]{0,200}\bpresent\b/i, 'SyllabusAI dated "present" (it ran Mar to Aug 2026)'],
  [/ASUWB|\$4M/, 'retired Treasurer framing'],
  [/ARIMA/, 'ARIMA (not in the Economic Pulse repo)'],
  [/ragvet/i, 'old project name'],
  [/\b(delve|tapestry|seamless|boasts)\b/i, 'AI-writing tell'],
];
for (const [re, why] of banned) if (re.test(text)) fail(`banned: ${why}`);
for (const must of ['Major GPA: 3.7', 'June 2027', 'tarangjammalamadaka9@gmail.com']) {
  if (!text.includes(must)) fail(`missing required text: ${must}`);
}

// Chart integrity: a bar's drawn width must equal value / max * 220 (the plot width), within 1px.
const bars = [...html.matchAll(/<rect data-value="([\d.]+)" data-max="([\d.]+)"[^>]*width="(\d+)"/g)];
if (bars.length < 6) fail(`expected 6 data bars, found ${bars.length}`);
for (const [, v, max, w] of bars) {
  const expected = (Number(v) / Number(max)) * 220;
  if (Math.abs(expected - Number(w)) > 1) fail(`bar for ${v} is ${w}px, expected ${expected.toFixed(1)}px`);
}

// Every in-page anchor resolves, every chart has a text alternative.
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(id)) fail(`dead anchor #${id}`);
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
console.log(`PASS: claims, ${bars.length} chart bars, anchors, accessibility${process.argv.includes('--online') ? ', live links' : ''}`);
