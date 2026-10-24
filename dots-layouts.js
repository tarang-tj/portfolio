// Where the story dots go for each step. Counts come from the #dot-counts and #order-dist blocks
// on the page (written by the build from src/content.mjs), and the gate checks that every count
// is also printed in the step text, so the picture never shows a number the page does not state.
(function () {
  const read = (id) => JSON.parse((document.getElementById(id) || {}).textContent || 'null');
  // #dot-counts maps each count to [value, the layout that draws it]; the gate uses the layout name.
  const N = Object.fromEntries(Object.entries(read('dot-counts') || {}).map(([k, [v]]) => [k, v]));
  const dist = read('order-dist') || [];
  const COL = { ink: '#161616', base: '#b9b2a4', red: '#d7263d', blue: '#1f6f99', gold: '#d98e04', green: '#2f7d4f', mint: '#93c4a2' };
  // Label text needs more contrast than the dots it names (4.5:1 or better on the paper).
  const TXT = { [COL.base]: '#161616', [COL.red]: '#b3001f', [COL.mint]: '#2a6b43', [COL.green]: '#2a6b43', [COL.gold]: '#8a5800' };
  const txt = (c) => TXT[c] || c;
  const state = { k: 4 };

  // Cell size that fits n cells in a w x h box. Prefers a full rectangle (10 x 10, not 11 columns
  // with one dot left over) when it costs less than 15% of the largest possible size.
  function fit(n, w, h) {
    const opts = [];
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      opts.push({ s: Math.min(w / cols, h / rows), cols, full: n % cols === 0 });
      if (rows === 1) break;
    }
    const max = Math.max(...opts.map((o) => o.s));
    const full = opts.filter((o) => o.full && o.s >= max * 0.85).sort((a, b) => b.s - a.s)[0];
    return full || opts.find((o) => o.s === max);
  }
  // Lay n dots in a centered grid; `fill` is a color or (k) => color.
  function grid(out, from, n, box, fill, s, size = 0.72) {
    const f = s ? { s, cols: Math.max(1, Math.floor(box.w / s + 1e-6)) } : fit(n, box.w, box.h);
    s = f.s;
    const cols = f.cols;
    const rows = Math.ceil(n / cols);
    const ox = box.x + (box.w - Math.min(n, cols) * s) / 2;
    const oy = box.y + (box.h - rows * s) / 2;
    for (let k = 0; k < n; k++) {
      out[from + k] = { x: ox + (k % cols) * s + s / 2, y: oy + Math.floor(k / cols) * s + s / 2,
        r: Math.max(0.9, (s * size) / 2), c: typeof fill === 'function' ? fill(k) : fill, a: 1 };
    }
    return { x: ox, y: oy, w: Math.min(n, cols) * s, h: rows * s };
  }
  // Unit columns: groups side by side, same dot size, bottom-aligned, labelled underneath.
  function columns(out, groups, box) {
    const gap = box.w * 0.06, cw = (box.w - gap * (groups.length - 1)) / groups.length, lh = 34;
    const s = Math.min(...groups.map((g) => fit(Math.max(g.n, 1), cw, box.h - lh).s));
    const labels = [];
    let from = 0;
    groups.forEach((g, i) => {
      const cols = Math.max(1, Math.floor(cw / s)), rows = Math.ceil(g.n / cols);
      const x0 = box.x + i * (cw + gap), yb = box.y + box.h - lh;
      for (let k = 0; k < g.n; k++) {
        out[from + k] = { x: x0 + (k % cols) * s + s / 2, y: yb - Math.floor(k / cols) * s - s / 2, r: Math.max(0.9, s * 0.36), c: g.c, a: 1 };
      }
      labels.push({ x: x0, y: yb - rows * s - 10, text: g.top, c: txt(g.c), bold: true });
      labels.push({ x: x0, y: yb + 20, text: g.label, c: COL.ink });
      from += g.n;
    });
    return labels;
  }
  // Buyers grouped by orders placed, for the current loyalty threshold k.
  function segments(k) {
    const sum = (f) => dist.filter(([n]) => f(n)).reduce((a, [, c, s]) => [a[0] + c, a[1] + s], [0, 0]);
    return [['One-time', sum((n) => n === 1)], [`Repeat (2 to ${k - 1})`, sum((n) => n >= 2 && n < k)], [`Loyal (${k}+)`, sum((n) => n >= k)]];
  }
  // Round shares to whole squares that still add up to 100 (largest remainder).
  function hundred(parts) {
    const total = parts.reduce((a, b) => a + b, 0);
    const raw = parts.map((p) => (p / total) * 100), out = raw.map(Math.floor);
    raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).slice(0, 100 - out.reduce((a, b) => a + b, 0)).forEach(([, i]) => { out[i] += 1; });
    return out;
  }
  const fmt = (n) => n.toLocaleString('en-US');
  function groupsAt(k, box) {
    const out = [], cs = [COL.base, COL.mint, COL.green];
    const labels = columns(out, segments(k).map(([name, [c]], i) => ({ n: c, c: cs[i], label: name, top: String(c) })), box);
    return { out, labels };
  }

  const L = {
    scatter(box, all) {
      const out = [];
      for (let i = 0; i < 4433; i++) out[i] = { x: all.seed[i][0] * all.W, y: all.seed[i][1] * all.H, r: 1.6, c: COL.base, a: 0.55 };
      return { out };
    },
    none: () => ({ out: [] }),
    'coke-team'(box) {
      const out = [], g = grid(out, 0, N.team, { x: box.x + box.w * 0.2, y: box.y, w: box.w * 0.6, h: box.h * 0.5 }, COL.ink, undefined, 0.6);
      return { out, labels: [{ x: g.x, y: g.y + g.h + 34, text: `${N.team} people, about 3 days per pull`, c: COL.ink, bold: true }] };
    },
    'coke-users'(box) {
      const out = [], g = grid(out, 0, N.users, { x: box.x, y: box.y, w: box.w, h: box.h * 0.8 }, COL.red);
      return { out, labels: [{ x: g.x, y: g.y + g.h + 30, text: `about ${N.users} people running it themselves`, c: txt(COL.red), bold: true }] };
    },
    'coke-checks'(box) {
      // Side by side on wide screens; on phones the mismatches sit under the users so labels fit.
      const narrow = box.w < 520, out = [];
      const a = grid(out, 0, N.users, narrow ? { x: box.x, y: box.y, w: box.w * 0.62, h: box.h * 0.62 } : { x: box.x, y: box.y, w: box.w * 0.58, h: box.h * 0.8 }, COL.base);
      const unit = a.w / 10;
      const b = grid(out, N.users, N.mismatches, narrow ? { x: box.x + box.w * 0.68, y: box.y, w: box.w * 0.32, h: box.h * 0.62 } : { x: box.x + box.w * 0.66, y: box.y + box.h * 0.2, w: box.w * 0.34, h: box.h * 0.4 }, COL.red, unit);
      return { out, labels: [{ x: a.x, y: a.y + a.h + 26, text: `about ${N.users} users`, c: COL.ink },
        { x: b.x, y: b.y + b.h + 26, text: `${N.mismatches} mismatches caught`, c: txt(COL.red), bold: true }] };
    },
    'quad-100'(box) { const out = []; const g = grid(out, 0, N.tickets, box, COL.base); return { out, labels: [{ x: g.x, y: g.y - 14, text: `about ${N.tickets} tickets`, c: COL.ink, bold: true }] }; },
    'quad-70'(box) {
      const out = []; const g = grid(out, 0, N.tickets, box, (k) => (k < N.crash ? COL.blue : COL.base));
      return { out, labels: [{ x: g.x, y: g.y - 14, text: `about ${N.crash} from one crash path`, c: txt(COL.blue), bold: true }] };
    },
    'quad-40'(box) {
      // Same columns and dot size as the 100-ticket grid, so the drop reads as dots leaving.
      const out = []; const f = fit(N.tickets, box.w, box.h);
      // Neutral color: the record gives the total after the fixes, not what kind of tickets remain.
      const g = grid(out, 0, N.after, { x: box.x + (box.w - f.cols * f.s) / 2, y: box.y, w: f.cols * f.s, h: box.h }, COL.base, f.s);
      return { out, labels: [{ x: g.x, y: g.y - 14, text: `about ${N.after} after the fixes`, c: COL.ink, bold: true }] };
    },
    'kal-all'(box) { const out = []; const g = grid(out, 0, N.markets, box, COL.base, undefined, 0.8); return { out, labels: [{ x: g.x, y: g.y - 14, text: `${fmt(N.markets)} settled markets`, c: COL.ink, bold: true }] }; },
    'kal-contested'(box) {
      const out = []; const g = grid(out, 0, N.markets, box, (k) => (k < N.contested ? COL.gold : COL.base), undefined, 0.8);
      out.forEach((p, i) => { if (i >= N.contested) p.a = 0.35; });
      return { out, labels: [{ x: g.x, y: g.y - 14, text: `${fmt(N.contested)} contested`, c: txt(COL.gold), bold: true }] };
    },
    'kal-brier'(box) {
      // One dot per 0.001 of Brier score, in bars five dots tall.
      const m = Math.round(N.brierMarket * 1000), y = Math.round(N.brierModel * 1000), rows = 5;
      const s = Math.min(box.w / Math.ceil(y / rows), box.h / 5 / rows), out = [];
      const bar = (from, n, top, c) => { for (let k = 0; k < n; k++) out[from + k] = { x: box.x + Math.floor(k / rows) * s + s / 2, y: top + (k % rows) * s + s / 2, r: Math.max(0.9, s * 0.36), c, a: 1 }; };
      const t1 = box.y + box.h * 0.22, t2 = box.y + box.h * 0.58;
      bar(0, m, t1, COL.ink); bar(m, y, t2, COL.gold);
      return { out, labels: [{ x: box.x, y: t1 - 12, text: `Market ${N.brierMarket}`, c: COL.ink, bold: true },
        { x: box.x, y: t2 - 12, text: `My model ${N.brierModel}`, c: txt(COL.gold), bold: true },
        { x: box.x, y: t2 + rows * s + 30, text: 'Lower is better', c: COL.ink }] };
    },
    'ret-buyers'(box) { const out = []; const total = dist.reduce((a, [, c]) => a + c, 0); const g = grid(out, 0, total, box, COL.base); return { out, labels: [{ x: g.x, y: g.y - 14, text: `${total} buyers`, c: COL.ink, bold: true }] }; },
    // The narrative steps stay at the 4+ threshold their text describes; only the slider step follows it.
    'ret-groups': (box) => groupsAt(4, box),
    'ret-live': (box) => groupsAt(state.k, box),
    'ret-revenue'(box) {
      const segs = segments(4), sq = hundred(segs.map(([, [, s]]) => s)), cs = [COL.base, COL.mint, COL.green], out = [];
      let from = 0;
      const s = fit(100, box.w, box.h * 0.8).s;
      const g0 = { x: box.x + (box.w - 10 * s) / 2, y: box.y, w: 10 * s, h: 10 * s };
      sq.forEach((n, i) => { for (let k = 0; k < n; k++) { const j = from + k; out[j] = { x: g0.x + (j % 10) * s + s / 2, y: g0.y + Math.floor(j / 10) * s + s / 2, r: s * 0.42, c: cs[i], a: 1, sq: true }; } from += n; });
      const tot = segs.reduce((a, [, [, v]]) => a + v, 0);
      return { out, labels: segs.map(([name, [, v]], i) => ({ x: g0.x, y: g0.y + g0.h + 28 + i * 22, text: `${name}: ${((v / tot) * 100).toFixed(1)}% of revenue`, c: txt(cs[i]), bold: i === 2 })) };
    },
  };

  window.Dots = Object.assign(window.Dots || {}, { layouts: L, state, segments });
})();
