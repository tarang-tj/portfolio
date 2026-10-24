// Finds which story element spans the middle of the screen and moves the dots to its layout.
// Any element with data-layout takes part: the hero (scatter), each step, and the sections after
// the story (none). The active step is marked .on so its text can come forward, and a
// "story:step" event lets controls resync. Runs once per frame at most, on scroll and resize.
(function () {
  const els = [...document.querySelectorAll('[data-layout]')];
  if (!els.length || !window.Dots || !window.Dots.go) return;
  let active = null, queued = false;
  function check() {
    queued = false;
    const mid = window.innerHeight / 2;
    // Steps sit inside chapters and come after them in document order, so the last match is innermost.
    let hit = null;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) hit = el;
    }
    if (!hit || hit === active) return;
    if (active) active.classList.remove('on');
    active = hit;
    hit.classList.add('on');
    window.Dots.go(hit.dataset.layout, false, hit.dataset.cap || '');
    window.dispatchEvent(new CustomEvent('story:step', { detail: hit.dataset.layout }));
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  check();
})();
