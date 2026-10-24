// Controls inside the story. Everything is computed from data on the page: the run-log toggle swaps
// the illustrated ending, the ticket toggle moves the dots between before and after, Brier is
// (p - outcome)^2, and the loyal slider re-segments the real per-customer order counts.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const press = (group, btn) => group.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  const dots = window.Dots || {};

  // Coca-Cola: run log ending
  const log = $('[data-log]');
  const logBtns = $$('[data-log-mode]');
  if (log) logBtns.forEach((b) => b.addEventListener('click', () => {
    press(logBtns, b);
    log.classList.toggle('passing', b.dataset.logMode === 'pass');
  }));

  // Quadcore: tickets before and after the fixes
  const fixBtns = $$('[data-fix]');
  fixBtns.forEach((b) => b.addEventListener('click', () => {
    press(fixBtns, b);
    if (dots.go) dots.go(b.dataset.fix === 'on' ? 'quad-40' : 'quad-70');
  }));
  // Scrolling back onto the after-the-fixes step shows "after" again, so the buttons must say so too.
  window.addEventListener('story:step', (e) => {
    if (e.detail === 'quad-40') press(fixBtns, fixBtns.find((b) => b.dataset.fix === 'on'));
  });

  // Kalshi: Brier score of the visitor's own forecast
  const pIn = $('[data-p-in]');
  const yBtns = $$('[data-y]');
  let y = 1;
  const brier = () => {
    const score = (Number(pIn.value) / 100 - y) ** 2;
    $('[data-p]').textContent = pIn.value;
    $('[data-you-score]').textContent = score.toFixed(4);
    $('[data-you-label]').textContent = `you ${score.toFixed(4)}`;
    $('[data-you]').style.left = `${score * 100}%`;
  };
  if (pIn) {
    pIn.addEventListener('input', brier);
    yBtns.forEach((b) => b.addEventListener('click', () => { y = Number(b.dataset.y); press(yBtns, b); brier(); }));
    brier();
  }

  // Retail: re-segment buyers with a different loyalty threshold
  const slider = $('[data-loyal]');
  const pre = $('[data-sql]');
  const dist = JSON.parse(($('#order-dist') || {}).textContent || '[]');
  const pct = (x, total) => `${((x / total) * 100).toFixed(1)}%`;
  if (slider) slider.addEventListener('input', () => {
    const k = Number(slider.value);
    const sum = (f) => dist.filter(([n]) => f(n)).reduce((a, [, c, s]) => [a[0] + c, a[1] + s], [0, 0]);
    const all = sum(() => true);
    [sum((n) => n === 1), sum((n) => n >= 2 && n < k), sum((n) => n >= k)].forEach(([c, s], i) => {
      $(`[data-c="b${i}"]`).textContent = pct(c, all[0]);
      $(`[data-c="r${i}"]`).textContent = pct(s, all[1]);
    });
    $('[data-c="name"]').textContent = `Loyal (${k}+)`;
    $('[data-loyal-out]').textContent = `${k}+`;
    slider.setAttribute('aria-valuetext', `${k} or more orders`);
    if (pre) pre.textContent = pre.dataset.tpl.replace('{r}', k - 1).replace('{k}', k);
    if (dots.state) {
      dots.state.k = k;
      if (dots.current && dots.current() === 'ret-live') dots.relayout();
    }
  });
})();
