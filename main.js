// Theme toggle (remembered per browser) and nav highlighting for the section in view.
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-btn');
  const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = () => root.dataset.theme || (systemDark() ? 'dark' : 'light');

  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode: theme just won't persist */ }
  });

  const links = [...document.querySelectorAll('.nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + entry.target.id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => observer.observe(s));
})();
