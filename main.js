// Running header shows the section in view; exhibit bars draw in once; "Save as PDF" prints the report.
(function () {
  const where = document.getElementById('where');
  const sections = [...document.querySelectorAll('section[data-title]')];
  document.getElementById('print-btn').addEventListener('click', () => window.print());

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.exhibit').forEach((e) => e.classList.add('in'));
    return;
  }
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) where.textContent = 'Annual Report 2026 · ' + entry.target.dataset.title;
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.exhibit').forEach((e) => barObserver.observe(e));

  // Printing must show full bars even for exhibits never scrolled into view.
  window.addEventListener('beforeprint', () => document.querySelectorAll('.exhibit').forEach((e) => e.classList.add('in')));
})();
