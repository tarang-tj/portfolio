// Scroll engine for the home-page scenes. Each [data-scene] is taller than the screen and its
// .scene-pin sticks; progress p (0 to 1) switches on [data-at] elements, types [data-type] text and
// marks the newest reached beat as .cur. Work only happens on scroll/resize, coalesced into one frame.
(function () {
  const scenes = [...document.querySelectorAll('[data-scene]')];
  window.scenesReady = true;
  if (!scenes.length) return;
  const still = document.documentElement.classList.contains('still') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const typers = [...document.querySelectorAll('[data-type]')].map((el) => {
    const [a, b] = el.dataset.type.split('-').map(Number);
    return { el, a, b, full: el.textContent };
  });

  // Reduced motion: no pinning, everything in its final state.
  if (still) {
    document.documentElement.classList.add('still');
    document.querySelectorAll('[data-at]').forEach((el) => el.classList.add('on'));
    return;
  }

  const clamp = (x) => Math.min(1, Math.max(0, x));
  const parts = new Map(scenes.map((s) => [s, { ats: [...s.querySelectorAll('[data-at]')], lis: [...s.querySelectorAll('.beats li')], p: 0 }]));
  function update() {
    const vh = window.innerHeight;
    const rects = scenes.map((s) => s.getBoundingClientRect()); // all reads first, then writes
    scenes.forEach((s, i) => {
      const r = rects[i];
      if (r.bottom < -vh || r.top > 2 * vh) return; // off screen: leave as is
      const part = parts.get(s);
      const p = part.p = clamp(-r.top / Math.max(1, r.height - vh));
      let cur = null;
      part.ats.forEach((el) => {
        const on = p >= Number(el.dataset.at) - 0.001;
        el.classList.toggle('on', on);
        if (on && el.parentElement.classList.contains('beats')) cur = el;
      });
      part.lis.forEach((li) => li.classList.toggle('cur', li === cur));
    });
    for (const t of typers) {
      if (t.el.dataset.locked) { t.el.classList.remove('typing'); continue; } // a control rewrote the text; keep it
      const p = parts.get(t.el.closest('[data-scene]')).p;
      const n = Math.round(clamp((p - t.a) / (t.b - t.a)) * t.full.length);
      if (t.el.textContent.length !== n) t.el.textContent = t.full.slice(0, n);
      t.el.classList.toggle('typing', n > 0 && n < t.full.length);
    }
  }

  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
