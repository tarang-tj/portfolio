// Each case is shown inside the kind of window the work was done in.
// Bars are drawn at value / max * PLOT px; scripts/check-site.mjs re-derives every width.
const PLOT = 220;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export { esc };

export function frame(title, body, cls = '') {
  return `<div class="win ${cls}"><div class="win-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div><div class="win-body">${body}</div></div>`;
}

// rows: [label, value, max, shown, alt?]; one bar per row, label left, value right.
function bars(label, rows, { gap = 34, top = 8 } = {}) {
  const h = top + rows.length * gap;
  const g = rows.map(([lab, v, max, shown, alt], i) => {
    const y = top + i * gap;
    const w = Math.round((v / max) * PLOT);
    return `<text class="t" x="0" y="${y + 15}">${esc(lab)}</text>`
      + `<rect class="bar${alt ? ' alt' : ''}" x="120" y="${y + 3}" data-value="${v}" data-max="${max}" data-shown="${esc(shown)}" height="16" width="${w}"/>`
      + `<text class="v" x="${120 + w + 8}" y="${y + 15}">${esc(shown)}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 400 ${h}" role="img" aria-label="${esc(label)}">${g}</svg>`;
}

// First label pairs with the grey (alt) bars, second with the accent bars.
const legend = (alt, accent) => `<p class="legend"><span><i class="alt"></i>${alt}</span><span><i></i>${accent}</span></p>`;

const visuals = {
  runlog: () => frame('run log  (illustration)', `<pre class="log">
<b>$</b> run brand-review
  plan query, schema-checked   <em>ok</em>
  compute 25 to 30M rows       <em>ok</em>
  reconcile Excel, BI, Python  <em>ok</em>
  reconcile one figure       <strong>HALT</strong>
  <strong>&gt;</strong> two systems disagree
  <strong>&gt;</strong> run stopped, mismatch reported
<b>$</b> _</pre>`, 'dark'),

  tickets: () => frame('support tickets, before and after', bars('Support tickets fell from about 100 to 40', [
    ['Before the fixes', 100, 100, '~100', true], ['After the fixes', 40, 100, '40'],
  ]) + `<p class="cap">Resolution time: 2 to 4 days before, 24 hours after.</p>`),

  brier: () => frame('kalshi-weather-engine / scoreboard', `<p class="nb"><span>In [12]:</span> brier(contested)</p>`
    + bars('Brier score on 1,216 contested markets: market 0.2114, my model 0.3047', [
      ['Market', 0.2114, 0.35, '0.2114'], ['My model', 0.3047, 0.35, '0.3047', true],
    ]) + `<p class="cap">Lower is better. n = 1,216 contested of 4,433 settled markets.</p>`),

  segments: () => frame('ecommerce-sql / query 2.4', `<pre class="sql"><b>CASE</b>
  <b>WHEN</b> order_count = 1 <b>THEN</b> 'One-time buyer'
  <b>WHEN</b> order_count <b>BETWEEN</b> 2 <b>AND</b> 3 <b>THEN</b> 'Repeat buyer'
  <b>ELSE</b> 'Loyal customer (4+)'
<b>END AS</b> segment</pre>` + legend('Share of buyers', 'Share of revenue')
    + bars('Share of buyers vs share of revenue. One-time: 19.0% vs 7.5%. Repeat: 47.6% vs 38.1%. Loyal: 33.3% vs 54.4%.', [
      ['One-time', 19.0, 100, '19.0%', true], ['', 7.5, 100, '7.5%'],
      ['Repeat (2 to 3)', 47.6, 100, '47.6%', true], ['', 38.1, 100, '38.1%'],
      ['Loyal (4+)', 33.3, 100, '33.3%', true], ['', 54.4, 100, '54.4%'],
    ], { gap: 24 })),

  ndcg: () => frame('ragproof / BEIR SciFact', bars('Retrieval quality NDCG@10: dense 0.720, keyword 0.560', [
    ['Dense retrieval', 0.72, 1, '0.720'], ['Keyword search', 0.56, 1, '0.560', true],
  ]) + `<p class="cap">NDCG@10, higher is better.</p>`),
};

export const visual = (name) => visuals[name]();
export const shot = (src, url, alt) => frame(url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  `<img src="${src}" alt="${esc(alt)}" loading="lazy" width="1440" height="${src.includes('autoappli') ? 620 : 690}">`, 'shot');
