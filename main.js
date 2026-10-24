// Cards fade up and their bars draw once in view; the Work/About pill follows the section on screen.
(function () {
  const targets = document.querySelectorAll('.reveal, .stage');
  const show = (el) => el.classList.add('in');
  window.revealReady = true;
  if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }

  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { show(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  targets.forEach((el) => reveal.observe(el));

  const links = document.querySelectorAll('[data-nav]');
  const mark = (name) => links.forEach((a) => a.classList.toggle('on', a.dataset.nav === name));
  const sections = document.querySelectorAll('[data-section]');
  if (!sections.length) { mark('work'); return; } // case pages live under Work
  mark('work');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) mark(e.target.dataset.section); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
})();
