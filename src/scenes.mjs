// Home-page scroll scenes. Each scene pins while you scroll; elements with data-at="p"
// switch on when the scene's scroll progress reaches p (0 to 1). scenes.js drives them,
// hands-on.js wires the controls. Figures come from src/content.mjs and the notes there.
import { frame, esc } from './visuals.mjs';

// Per-customer order counts from ecommerce-sql seed data, query 2.4 filter:
// [orders per customer, customers, spend]. The gate re-derives 33.3% and 54.4% from this.
export const orderDist = [[1, 36, 7619.1], [2, 53, 17490.86], [3, 37, 21338.6], [4, 25, 18476.17], [5, 17, 15155.47],
  [6, 12, 11805.77], [7, 6, 6117.86], [8, 2, 3050.78], [9, 1, 906.15]];

const beats = (list) => `<ol class="beats">${list.map(([at, t]) => `<li data-at="${at}">${t}</li>`).join('')}</ol>`;

function scene({ n, slug, kicker, title, len, story, win }) {
  return `<section class="scene" data-scene style="--len:${len}" aria-labelledby="s-${slug}">
  <div class="scene-pin">
    <div class="scene-text">
      <p class="label">${n} &middot; ${kicker}</p>
      <h3 id="s-${slug}"><a href="work/${slug}.html">${title}</a></h3>
      ${beats(story)}
      <a class="case-link" href="work/${slug}.html">Read the case &rarr;</a>
    </div>
    <div class="scene-win">${win}</div>
  </div>
</section>`;
}

const logLine = (at, cls, text, status) => `<div class="ln ${cls}" data-at="${at}"><span>${text}</span><b>${status}</b></div>`;

const coke = scene({
  n: '01', slug: 'coca-cola', kicker: 'The Coca-Cola Company, Summer 2026', len: 3.2,
  title: 'A three-day request, made self-serve',
  story: [[0, 'A recurring request took four people about three days to pull by hand.'],
    [0.25, 'I built a tool that about 50 people now run themselves.'],
    [0.5, 'Every figure is computed in plain Python over 25 to 30 million rows.'],
    [0.75, 'When two systems disagree, it stops. Those checks caught nine mismatches.']],
  win: frame('run log  (illustration: the real tool is internal)', `<div class="log" data-log>
    <div class="ln cmd"><span>$ run brand-review</span></div>
    ${logLine(0.2, '', 'plan query, schema-checked', 'ok')}
    ${logLine(0.4, '', 'compute 25 to 30M rows', 'ok')}
    ${logLine(0.55, '', 'reconcile Excel vs Python', 'ok')}
    ${logLine(0.75, 'last', 'reconcile across systems', '<i class="halt">HALT</i><i class="pass">ok</i>')}
    <div class="ln note" data-at="0.8"><span class="halt">&gt; two systems disagree on one figure. run stopped.</span><span class="pass">&gt; all systems agree. report published.</span></div>
  </div>
  <div class="try"><span>Try it:</span><button type="button" data-log-mode="halt" aria-pressed="true">One system disagrees</button><button type="button" data-log-mode="pass" aria-pressed="false">All agree</button></div>`, 'dark'),
});

const dots = Array.from({ length: 100 }, (_, i) => `<i class="${i < 70 ? 'crash' : ''}${i >= 10 && i < 70 ? ' gone' : ''}"></i>`).join('');
const quad = scene({
  n: '02', slug: 'quadcore', kicker: 'Quadcore Innovations, 2025 to 2026', len: 3,
  title: 'Finding the one bug behind 70% of tickets',
  story: [[0, 'About 100 support tickets kept arriving on a fintech payments platform.'],
    [0.3, 'I traced about 70% of them to a single crash path.'],
    [0.6, 'The product lead accepted the fixes. Tickets fell to 40.'],
    [0.85, 'Resolution time went from 2 to 4 days to 24 hours.']],
  win: frame('support tickets, one dot each', `<div class="tickets" data-tickets>
    <p class="count"><b data-count>~100</b> tickets</p>
    <div class="dots" role="img" aria-label="About 100 tickets, about 70 from one crash path, 40 after the fixes">${dots}</div>
    <p class="key"><span><i class="crash"></i>one crash path</span><span><i></i>everything else</span></p>
  </div>
  <div class="try"><span>Try it:</span><button type="button" data-fix="off" aria-pressed="true">Before the fix</button><button type="button" data-fix="on" aria-pressed="false">After the fix</button></div>`),
});

const kalshi = scene({
  n: '03', slug: 'kalshi', kicker: 'Independent research, 2026', len: 3.2,
  title: 'My backtest made 7.7%. I called it luck.',
  story: [[0, 'I built a model that prices weather markets from day-ahead forecasts.'],
    [0.3, 'The first paper backtest made 7.7%.'],
    [0.55, 'Then I scored calibration on 1,216 contested markets. The market won.'],
    [0.85, 'No real money has been traded. The rule for that has not been met.']],
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
  <div class="try col"><span>Try Brier: you say it hits 60&deg;F tomorrow, <output data-p>70</output>% likely.</span>
    <input type="range" min="0" max="100" value="70" data-p-in aria-label="Your forecast probability">
    <span class="row" aria-live="polite">It <button type="button" data-y="1" aria-pressed="true">did</button><button type="button" data-y="0" aria-pressed="false">didn&rsquo;t</button> &rarr; your score is <b data-you-score>0.0900</b></span></div>`),
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
  n: '04', slug: 'retail-sql', kicker: 'SQL study, 620 orders', len: 3.6,
  title: 'Who actually pays the bills in an online store',
  story: [[0, '620 orders over 18 months. Who actually pays the bills?'],
    [0.25, 'Split the 189 buyers by how often they come back.'],
    [0.6, 'Loyal customers, four or more orders, are a third of buyers.'],
    [0.8, 'They bring in 54.4% of the revenue.']],
  win: frame('ecommerce-sql / query 2.4 (excerpt)', `<pre class="sql" data-type="0.1-0.5" data-sql data-tpl="${esc(sqlTemplate)}">${esc(sqlFor(4))}</pre>
    <table class="res" data-at="0.55" data-seg aria-live="polite"><thead><tr><th>segment</th><th>buyers</th><th>revenue</th></tr></thead>
      <tbody><tr><td>One-time</td><td data-c="b0">19.0%</td><td data-c="r0">7.5%</td></tr>
      <tr><td>Repeat</td><td data-c="b1">47.6%</td><td data-c="r1">38.1%</td></tr>
      <tr class="hi" data-at="0.6"><td data-c="name">Loyal (4+)</td><td data-c="b2">33.3%</td><td data-c="r2">54.4%</td></tr></tbody></table>
    <div class="try"><span>Try it: loyal means</span><input type="range" min="3" max="7" value="4" data-loyal aria-label="Orders needed to count as loyal" aria-valuetext="4 or more orders"><b data-loyal-out>4+</b><span>orders</span></div>
    <p class="cap">Buyers with at least one order that was not cancelled or refunded: 189 buyers, 577 orders.</p>
    <script type="application/json" id="order-dist">${JSON.stringify(orderDist)}</script>`),
});

export const scenes = [coke, quad, kalshi, retail].join('\n');
