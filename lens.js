// Lane tabs: filter project cards by role, highlight the matching map column, keep the choice in the URL.
// Arrow keys move between tabs. A link to #finance, #data, #supply-chain or #ai opens that tab.
(function () {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const cards = [...document.querySelectorAll('.pcard')];
  const intros = [...document.querySelectorAll('[data-lane-intro]')];
  const rows = [...document.querySelectorAll('.pmap tbody tr')];
  const cols = [...document.querySelectorAll('.pmap [data-col]')];
  const panel = document.getElementById('lens-panel');
  const status = document.querySelector('[data-lens-status]');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ids = tabs.map((t) => t.dataset.lane);
  const hueOf = Object.fromEntries(tabs.map((t) => [t.dataset.lane, t.dataset.hue]));

  function select(lane, { focus = false, scroll = false } = {}) {
    if (!ids.includes(lane)) return;
    tabs.forEach((t) => {
      const on = t.dataset.lane === lane;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    intros.forEach((i) => { i.hidden = i.dataset.laneIntro !== lane; });
    panel.setAttribute('aria-labelledby', lane);
    let n = 0;
    cards.forEach((c) => {
      const show = lane === 'all' || c.dataset.lanes.split(' ').includes(lane);
      c.hidden = !show;
      // In a lane view every card wears that lane's color; in All work each keeps its first lane's.
      c.style.setProperty('--hue', lane === 'all' ? c.dataset.hue : `var(--${hueOf[lane]})`);
      c.classList.remove('enter');
      if (show && !calm) {
        c.style.setProperty('--delay', `${Math.min(n++, 8) * 45}ms`);
        void c.offsetWidth; // restart the entry animation
        c.classList.add('enter');
      }
    });
    if (status) status.textContent = `${tabs.find((t) => t.dataset.lane === lane).firstChild.textContent.trim()}: ${n} projects`;
    rows.forEach((r) => r.classList.toggle('dim', lane !== 'all' && !r.dataset.lanes.split(' ').includes(lane)));
    cols.forEach((c) => c.classList.toggle('on', c.dataset.col === lane));
    history.replaceState(null, '', location.pathname + location.search + (lane === 'all' ? '' : `#${lane}`));
    if (scroll) document.getElementById('lens').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.lane));
    t.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length].dataset.lane, { focus: true }); }
      if (e.key === 'Home') { e.preventDefault(); select(ids[0], { focus: true }); }
      if (e.key === 'End') { e.preventDefault(); select(ids[ids.length - 1], { focus: true }); }
    });
  });

  // Hero shortcuts and shared links open a lane, then bring the section into view.
  document.querySelectorAll('[data-jump]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    select(a.dataset.jump, { scroll: true });
  }));
  // A map row whose card is filtered out switches back to all work before jumping to it.
  rows.forEach((r) => r.querySelector('a').addEventListener('click', () => {
    if (r.classList.contains('dim')) select('all');
  }));

  const fromHash = location.hash.slice(1);
  // Wait for fonts and layout so the jump lands on the tabs, not where they were before load.
  if (ids.includes(fromHash)) {
    select(fromHash);
    // Skip the jump if the visitor has already started scrolling.
    const y0 = window.scrollY;
    window.addEventListener('load', () => setTimeout(() => { if (Math.abs(window.scrollY - y0) < 40) select(fromHash, { scroll: true }); }, 50), { once: true });
  }
})();
