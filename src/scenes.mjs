// Home-page scroll scenes. Each scene pins while you scroll; elements with data-at="p"
// switch on when the scene's scroll progress reaches p (0 to 1). scenes.js drives them,
// hands-on.js wires the controls. Figures come from src/content.mjs and the notes there.
import { frame, esc } from './visuals.mjs';

// Per-customer order counts from ecommerce-sql seed data, query 2.4 filter:
// [orders per customer, customers, spend]. The gate re-derives 33.3% and 54.4% from this.
export const orderDist = [[1, 36, 7619.1], [2, 53, 17490.86], [3, 37, 21338.6], [4, 25, 18476.17], [5, 17, 15155.47],
  [6, 12, 11805.77], [7, 6, 6117.86], [8, 2, 3050.78], [9, 1, 906.15]];

const beats = (list) => `<ol class="beats">${list.map(([at, t]) => `<li data-at="${at}">${t}</li>`).join('')}</ol>`;

function scene({ slug, kicker, title, len, story, win }) {
  return `<section class="scene" data-scene style="--len:${len}" aria-labelledby="s-${slug}">
  <div class="scene-pin">
    <div class="scene-text">
      <p class="kicker">${kicker}</p>
      <h3 id="s-${slug}"><a href="work/${slug}.html">${title}</a></h3>
      ${beats(story)}
      <a class="case-link" href="work/${slug}.html">Full case study</a>
    </div>
    <div class="scene-win">${win}</div>
  </div>
</section>`;
}

const logLine = (at, cls, text, status) => `<div class="ln ${cls}" data-at="${at}"><span>${text}</span><b>${status}</b></div>`;

const coke = scene({
  slug: 'coca-cola', kicker: 'The Coca-Cola Company, summer 2026', len: 3.2,
  title: 'Replacing a manual data pull at Coca-Cola',
  story: [[0, 'A recurring request took a four-person team about three days to pull by hand.'],
    [0.25, 'I built an internal tool so about 50 people can run it themselves.'],
    [0.5, 'Python computes every figure over 25 to 30 million rows, and more than 50 checks compare results across Excel, Power BI and Python.'],
    [0.75, 'If two systems disagree, the run stops. The checks caught nine mismatches.']],
  win: frame('run log  (illustration: the real tool is internal)', `<div class="log" data-log>
    <div class="ln cmd"><span>$ run brand-review</span></div>
    ${logLine(0.2, '', 'plan query, schema-checked', 'ok')}
    ${logLine(0.4, '', 'compute 25 to 30M rows', 'ok')}
    ${logLine(0.55, '', 'reconcile Excel vs Python', 'ok')}
    ${logLine(0.75, 'last', 'reconcile across systems', '<i class="halt">HALT</i><i class="pass">ok</i>')}
    <div class="ln note" data-at="0.8"><span class="halt">&gt; two systems disagree on one figure. run stopped.</span><span class="pass">&gt; all systems agree. report published.</span></div>
  </div>
  <div class="try" role="group" aria-labelledby="lbl-log"><span id="lbl-log">Show a run where the systems</span><button type="button" data-log-mode="halt" aria-pressed="true">disagree</button><button type="button" data-log-mode="pass" aria-pressed="false">agree</button></div>`),
});

const dots = Array.from({ length: 100 }, (_, i) => `<i class="${i < 70 ? 'crash' : ''}${i >= 10 && i < 70 ? ' gone' : ''}"></i>`).join('');
const quad = scene({
  slug: 'quadcore', kicker: 'Quadcore Innovations, Oct 2025 to May 2026', len: 3,
  title: 'Cutting support tickets at Quadcore',
  story: [[0, 'The payments platform was getting about 100 support tickets.'],
    [0.3, 'I traced about 70% of them to one crash path.'],
    [0.6, 'The product lead accepted the fixes I proposed, and tickets dropped to about 40.'],
    [0.85, 'Resolution time went from 2 to 4 days to 24 hours.']],
  win: frame('support tickets, one dot each', `<div class="tickets" data-tickets>
    <p class="count"><b data-count>~100</b> tickets</p>
    <div class="dots" role="img" aria-label="About 100 tickets, about 70 from one crash path, 40 after the fixes">${dots}</div>
    <p class="key"><span><i class="crash"></i>one crash path</span><span><i></i>everything else</span></p>
  </div>
  <div class="try" role="group" aria-labelledby="lbl-fix"><span id="lbl-fix">Show tickets</span><button type="button" data-fix="off" aria-pressed="true">before the fixes</button><button type="button" data-fix="on" aria-pressed="false">after the fixes</button></div>`),
});

const kalshi = scene({
  slug: 'kalshi', kicker: 'Independent project, 2026', len: 3.2,
  title: 'Forecasting weather prediction markets',
  story: [[0, 'My model turns day-ahead temperature forecasts for 7 U.S. cities into probabilities and compares them with Kalshi prices.'],
    [0.3, 'The first paper backtest returned 7.7%.'],
    [0.55, 'On the 1,216 contested markets, the market was better calibrated than my model (Brier 0.2114 vs 0.3047).'],
    [0.85, 'I have not traded real money. My rule needs a better Brier score than the market on 200+ contested markets and a positive paper return, and neither is true yet.']],
  win: frame('kalshi-weather-engine / notebook', `<div class="nbk">
    <p class="cell" data-at="0.2"><span>In [1]:</span> backtest(paper=True)</p>
    <p class="out big pos" data-at="0.3">+7.7%</p>
    <p class="cell" data-at="0.5"><span>In [2]:</span> brier(contested)  <em># lower is better</em></p>
    <div class="brier" data-at="0.55">
      <div class="scale"><i class="mk" data-mk="market" style="left:21.14%"><b>market 0.2114</b></i><i class="mk alt" style="left:30.47%"><b>my model 0.3047</b></i><i class="mk you" data-you style="left:9%"><b data-you-label>you 0.0900</b></i></div>
      <p class="ends"><span>0 perfect</span><span>1 always wrong</span></p>
      <p class="cap">Brier = (forecast &minus; outcome)&sup2;, averaged over markets.</p>
    </div>
  </div>
  <div class="try col"><span>Your forecast: <output data-p>70</output>% chance of 60&deg;F or warmer</span>
    <input type="range" min="0" max="100" value="70" data-p-in aria-label="Your forecast probability">
    <span class="row" role="group" aria-labelledby="lbl-y" aria-live="polite"><span id="lbl-y">Outcome:</span> <button type="button" data-y="1" aria-pressed="true">it did</button><button type="button" data-y="0" aria-pressed="false">it didn&rsquo;t</button> Your Brier score: <b data-you-score>0.0900</b></span></div>`),
});

// The real CASE from query 2.4. The template ships in data-tpl so hands-on.js fills the same
// text when the loyal slider moves ({r} = last repeat count, {k} = loyal threshold).
const sqlTemplate = `CASE
  WHEN order_count = 1 THEN 'One-time buyer'
  WHEN order_count BETWEEN 2 AND {r} THEN 'Repeat buyer'
  ELSE 'Loyal customer ({k}+)'
END AS segment`;
export const sqlFor = (k) => sqlTemplate.replace('{r}', k - 1).replace('{k}', k);
const retail = scene({
  slug: 'retail-sql', kicker: 'SQL project, 2026', len: 3.6,
  title: 'Segmenting online store customers in SQL',
  story: [[0, 'A retail database with 620 orders from January 2024 to June 2025.'],
    [0.25, 'I grouped the 189 buyers by how many orders they placed.'],
    [0.6, 'Customers with four or more orders are a third of buyers.'],
    [0.8, 'They account for 54.4% of revenue.']],
  win: frame('ecommerce-sql / query 2.4 (excerpt)', `<pre class="sql" data-type="0.1-0.5" data-sql data-tpl="${esc(sqlTemplate)}">${esc(sqlFor(4))}</pre>
    <table class="res" data-at="0.55" data-seg aria-live="polite"><thead><tr><th>segment</th><th>buyers</th><th>revenue</th></tr></thead>
      <tbody><tr><td>One-time</td><td data-c="b0">19.0%</td><td data-c="r0">7.5%</td></tr>
      <tr><td>Repeat</td><td data-c="b1">47.6%</td><td data-c="r1">38.1%</td></tr>
      <tr class="hi" data-at="0.6"><td data-c="name">Loyal (4+)</td><td data-c="b2">33.3%</td><td data-c="r2">54.4%</td></tr></tbody></table>
    <div class="try"><span>Count as loyal at</span><input type="range" min="3" max="7" value="4" data-loyal aria-label="Orders needed to count as loyal" aria-valuetext="4 or more orders"><b data-loyal-out>4+</b><span>orders</span></div>
    <p class="cap">Buyers with at least one order that was not cancelled or refunded: 189 buyers, 577 orders.</p>
    <script type="application/json" id="order-dist">${JSON.stringify(orderDist)}</script>`),
});

export const scenes = [coke, quad, kalshi, retail].join('\n');
