// Home-page story chapters. Each step names a dot layout (dots-layouts.js) and carries the text
// that states every count the dots show. Figures come from src/content.mjs and its notes.
import { frame, esc } from './visuals.mjs';

// Per-customer order counts from ecommerce-sql seed data, query 2.4 filter:
// [orders per customer, customers, spend]. The gate re-derives 33.3% and 54.4% from this.
export const orderDist = [[1, 36, 7619.1], [2, 53, 17490.86], [3, 37, 21338.6], [4, 25, 18476.17], [5, 17, 15155.47],
  [6, 12, 11805.77], [7, 6, 6117.86], [8, 2, 3050.78], [9, 1, 906.15]];

// Every count the dots draw, with the layout that draws it. The gate checks each count is printed
// in the text of a step that uses that layout.
export const dotCounts = { team: [4, 'coke-team'], users: [50, 'coke-users'], mismatches: [9, 'coke-checks'],
  tickets: [100, 'quad-100'], crash: [70, 'quad-70'], after: [40, 'quad-40'], markets: [4433, 'kal-all'],
  contested: [1216, 'kal-contested'], brierMarket: [0.2114, 'kal-brier'], brierModel: [0.3047, 'kal-brier'],
  buyers: [189, 'ret-buyers'], oneTime: [36, 'ret-groups'], repeat: [90, 'ret-groups'], loyal: [63, 'ret-groups'] };

const step = (layout, cap, html) => `<div class="step" data-layout="${layout}" data-cap="${cap}">${html}</div>`;

function chapter({ slug, hue, org, title, steps }) {
  return `<section class="chapter" data-scene style="--hue:var(--${hue})" aria-labelledby="c-${slug}">
  <header class="ch-head"><p class="ch-org">${org}</p><h2 id="c-${slug}"><a href="work/${slug}.html">${title}</a></h2></header>
  ${steps.join('\n  ')}
  <p class="ch-more"><a href="work/${slug}.html">Read the full case study</a></p>
</section>`;
}

const logLine = (cls, text, status) => `<div class="ln ${cls}"><span>${text}</span><b>${status}</b></div>`;
const coke = chapter({
  slug: 'coca-cola', hue: 'red', org: 'The Coca-Cola Company, summer 2026',
  title: 'Replacing a three-day manual pull',
  steps: [
    step('coke-team', 'Each dot is one person.', `<p><b class="num">4</b> people spent about <b>3 days</b> pulling the same recurring request by hand.</p>`),
    step('coke-users', 'Each dot is one person.', `<p>I interviewed 10 of the people who relied on it and built an internal tool. About <b class="num">50</b> people could then run it themselves.</p>`),
    step('coke-users', 'Each dot is one person.', `<p>Azure OpenAI plans each query. Plain Python computes every figure over <b>25 to 30 million</b> rows.</p>`),
    step('coke-checks', 'Each dot is one person or one caught mismatch.', `<p>More than 50 checks compare results across Excel, Power BI and Python. If two systems disagree, the run stops. The checks caught <b class="num">9</b> mismatches.</p>
    ${frame('run log (illustration: the real tool is internal)', `<div class="log" data-log>
      <div class="ln cmd"><span>$ run brand-review</span></div>
      ${logLine('', 'plan query, schema-checked', 'ok')}
      ${logLine('', 'compute 25 to 30M rows', 'ok')}
      ${logLine('', 'reconcile Excel vs Python', 'ok')}
      ${logLine('last', 'reconcile across systems', '<i class="halt">HALT</i><i class="pass">ok</i>')}
      <div class="ln note"><span class="halt">&gt; two systems disagree on one figure. run stopped.</span><span class="pass">&gt; all systems agree. report published.</span></div>
    </div>
    <div class="try" role="group" aria-labelledby="lbl-log"><span id="lbl-log">Show a run where the systems</span><button type="button" data-log-mode="halt" aria-pressed="true">disagree</button><button type="button" data-log-mode="pass" aria-pressed="false">agree</button></div>`)}`),
  ],
});

const quad = chapter({
  slug: 'quadcore', hue: 'blue', org: 'Quadcore Innovations, Oct 2025 to May 2026',
  title: 'Cutting support tickets on a payments platform',
  steps: [
    step('quad-100', 'Each dot is one support ticket.', `<p>The platform was getting about <b class="num">100</b> support tickets.</p>`),
    step('quad-70', 'Each dot is one support ticket.', `<p>I mapped the platform with the people who run it and traced about <b class="num">70%</b> of the tickets to one crash path.</p>`),
    step('quad-40', 'Each dot is one support ticket.', `<p>The product lead accepted the fixes I proposed. Tickets dropped to about <b class="num">40</b>, and resolution time went from 2 to 4 days to 24 hours.</p>
    <div class="try" role="group" aria-labelledby="lbl-fix"><span id="lbl-fix">Show tickets</span><button type="button" data-fix="off" aria-pressed="false">before the fixes</button><button type="button" data-fix="on" aria-pressed="true">after the fixes</button></div>`),
  ],
});

const kalshi = chapter({
  slug: 'kalshi', hue: 'gold', org: 'Independent research, 2026',
  title: 'Testing a forecasting model against prediction markets',
  steps: [
    step('kal-all', 'Each dot is one settled market.', `<p>My model turns day-ahead temperature forecasts for 7 U.S. cities into probabilities and compares them with Kalshi prices. It has scored <b class="num">4,433</b> settled markets.</p>`),
    step('kal-all', 'Each dot is one settled market.', `<p>The first paper backtest returned <b class="num">+7.7%</b>. The calibration check further down is why I did not rely on it.</p>`),
    step('kal-contested', 'Each dot is one settled market.', `<p><b class="num">1,216</b> of them were contested, where the market itself was unsure.</p>`),
    step('kal-brier', 'Each dot is 0.001 of Brier score.', `<p>On those, the market&rsquo;s Brier score is <b>0.2114</b> and mine is <b>0.3047</b>. Lower is better, so the market wins.</p>`),
    step('kal-brier', 'Each dot is 0.001 of Brier score.', `<p>I have not traded real money. My rule needs a better Brier score than the market on 200+ contested markets and a positive paper return. Neither is true yet: paper return is -3.37% on 212 picks.</p>
    ${frame('brier score calculator', `<div class="brier">
      <div class="scale"><i class="mk" style="left:21.14%"><b>market 0.2114</b></i><i class="mk alt" style="left:30.47%"><b>my model 0.3047</b></i><i class="mk you" data-you style="left:9%"><b data-you-label>you 0.0900</b></i></div>
      <p class="ends"><span>0 perfect</span><span>1 always wrong</span></p>
    </div>
    <div class="try col"><span>Your forecast: <output data-p>70</output>% chance of 60&deg;F or warmer</span>
      <input type="range" min="0" max="100" value="70" data-p-in aria-label="Your forecast probability">
      <span class="row" role="group" aria-labelledby="lbl-y"><span id="lbl-y">Outcome:</span> <button type="button" data-y="1" aria-pressed="true">it did</button><button type="button" data-y="0" aria-pressed="false">it didn&rsquo;t</button> Your score: <b data-you-score aria-live="polite">0.0900</b></span></div>`)}`),
  ],
});

// The real CASE from query 2.4. The template ships in data-tpl so hands-on.js fills the same
// text when the loyal slider moves ({r} = last repeat count, {k} = loyal threshold).
const sqlTemplate = `CASE
  WHEN order_count = 1 THEN 'One-time buyer'
  WHEN order_count BETWEEN 2 AND {r} THEN 'Repeat buyer'
  ELSE 'Loyal customer ({k}+)'
END AS segment`;
export const sqlFor = (k) => sqlTemplate.replace('{r}', k - 1).replace('{k}', k);
const retail = chapter({
  slug: 'retail-sql', hue: 'green', org: 'SQL project, 2026',
  title: 'Finding who pays the bills in an online store',
  steps: [
    step('ret-buyers', 'Each dot is one buyer.', `<p>A retail database with 620 orders from January 2024 to June 2025. <b class="num">189</b> buyers placed at least one order that was not cancelled or refunded.</p>`),
    step('ret-groups', 'Each dot is one buyer.', `<p>I grouped them by how many orders they placed: 36 bought once, 90 came back two or three times, and 63 placed four or more. That last group is a third of buyers.</p>
    ${frame('ecommerce-sql / query 2.4 (excerpt)', `<pre class="sql" data-sql data-tpl="${esc(sqlTemplate)}">${esc(sqlFor(4))}</pre>`)}`),
    step('ret-revenue', 'Each square is 1% of revenue, rounded.', `<p>They bring in <b class="num">54.4%</b> of revenue.</p>`),
    step('ret-live', 'Each dot is one buyer.', `<p>Move the line for who counts as loyal. The dots regroup from the real order counts.</p>
    ${frame('segments', `<table class="res" data-seg><thead><tr><th>segment</th><th>buyers</th><th>revenue</th></tr></thead>
      <tbody><tr><td>One-time</td><td data-c="b0">19.0%</td><td data-c="r0">7.5%</td></tr>
      <tr><td>Repeat</td><td data-c="b1">47.6%</td><td data-c="r1">38.1%</td></tr>
      <tr class="hi"><td data-c="name">Loyal (4+)</td><td data-c="b2">33.3%</td><td data-c="r2">54.4%</td></tr></tbody></table>
    <div class="try"><label for="loyal">Count as loyal at</label><input id="loyal" type="range" min="3" max="7" value="4" data-loyal aria-valuetext="4 or more orders"><b data-loyal-out>4+</b><span>orders</span></div>`)}`),
  ],
});

export const scenes = [coke, quad, kalshi, retail].join('\n')
  + `\n<script type="application/json" id="order-dist">${JSON.stringify(orderDist)}</script>`
  + `\n<script type="application/json" id="dot-counts">${JSON.stringify(dotCounts)}</script>`;
