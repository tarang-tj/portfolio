// Draws the story dots on one fixed canvas and tweens them between layouts (dots-layouts.js).
// Frames run only while a tween is in progress; a settled picture costs nothing per frame.
(function () {
  const canvas = document.getElementById('dots');
  const D = window.Dots;
  if (!canvas || !D || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const COUNT = 4433;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Seeded scatter so the hero field looks the same on every load.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const all = { seed: Array.from({ length: COUNT }, () => [rnd(), rnd()]), W: 0, H: 0 };
  const P = all.seed.map(([x, y]) => ({ x, y, r: 1.6, c: '#b9b2a4', a: 0, sq: false }));
  let current = 'scatter', labels = [], cap = '', t0 = 0, raf = 0, dpr = 1;

  // Where the picture sits: right column on wide screens, upper band on phones.
  function box() {
    const W = all.W, H = all.H, nav = 56;
    if (W >= 900) return { x: W * 0.53, y: H * 0.2, w: W * 0.41, h: H * 0.56 };
    return { x: W * 0.07, y: nav + H * 0.07, w: W * 0.86, h: H * 0.3 };
  }

  function resize() {
    // clientWidth leaves out the scrollbar. Phones fire height-only resizes as the URL bar
    // slides; relaying out on those would make the dots jump, so small ones are ignored.
    const W = document.documentElement.clientWidth, H = window.innerHeight;
    if (P[0].placed && W === all.W && Math.abs(H - all.H) < 120) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    all.W = W; all.H = H;
    canvas.width = Math.round(all.W * dpr); canvas.height = Math.round(all.H * dpr);
    canvas.style.width = `${all.W}px`; canvas.style.height = `${all.H}px`;
    if (!P[0].placed) P.forEach((p) => { p.x *= all.W; p.y *= all.H; p.placed = true; });
    go(current, true);
  }

  // `note` is the one-line key ("Each dot is one buyer."), drawn under the lowest point of the picture.
  function go(name, instant, note) {
    const layout = D.layouts[name];
    if (!layout) return;
    current = name;
    if (note !== undefined) cap = note;
    const res = layout(box(), all);
    labels = (res.labels || []).slice();
    if (cap && name !== 'scatter' && name !== 'none') {
      const ys = res.out.filter(Boolean).map((t) => t.y + t.r).concat(labels.map((l) => l.y));
      labels.push({ x: box().x, y: Math.max(...ys) + 30, text: cap, c: '#5a564e', small: true });
    }
    P.forEach((p, i) => {
      const t = res.out[i];
      p.f = { x: p.x, y: p.y, r: p.r, a: p.a };
      p.t = t ? { x: t.x, y: t.y, r: t.r, a: t.a } : { x: p.x, y: p.y, r: p.r, a: 0 };
      if (t) { p.c = t.c; p.sq = !!t.sq; }
    });
    t0 = performance.now() - (instant || still ? 1e6 : 0);
    if (!raf) raf = requestAnimationFrame(frame);
  }

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function frame(now) {
    raf = 0;
    let busy = false;
    const span = 900;
    P.forEach((p, i) => {
      const delay = (i % 101) * 2.5; // a light stagger so the field moves like a crowd, not a block
      const k = Math.min(1, Math.max(0, (now - t0 - delay) / span));
      if (k < 1) busy = true;
      const e = ease(k);
      p.x = p.f.x + (p.t.x - p.f.x) * e; p.y = p.f.y + (p.t.y - p.f.y) * e;
      p.r = p.f.r + (p.t.r - p.f.r) * e; p.a = p.f.a + (p.t.a - p.f.a) * e;
    });
    draw(Math.min(1, (now - t0) / span));
    if (busy) raf = requestAnimationFrame(frame);
  }

  function draw(labelAlpha) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, all.W, all.H);
    for (const p of P) {
      if (p.a < 0.01) continue;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      if (p.sq || p.r < 2) ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = labelAlpha;
    for (const l of labels) {
      ctx.font = `${l.bold ? 700 : 500} ${l.small ? 14 : 15}px "Schibsted Grotesk", system-ui, sans-serif`;
      ctx.fillStyle = l.c;
      // Keep every label inside the screen, whatever the layout asked for.
      const x = Math.max(8, Math.min(l.x, all.W - ctx.measureText(l.text).width - 8));
      ctx.fillText(l.text, x, l.y);
    }
    ctx.globalAlpha = 1;
    if (!live) { live = true; document.documentElement.classList.add('dots-live'); }
  }
  let live = false;

  D.go = go;
  D.particles = P; // read by the test probe
  D.relayout = () => go(current);
  D.current = () => current;
  window.addEventListener('resize', resize);
  resize();
  // Labels use the web font; redraw once it has loaded.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => go(current, true));
})();
