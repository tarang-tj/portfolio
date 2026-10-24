// Controls inside the scenes. Everything is computed from data on the page: the Coca-Cola
// toggle swaps the illustrated run ending, the ticket toggle flips before/after, Brier is
// (p - outcome)^2, and the loyal slider re-segments the real per-customer order counts.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const press = (group, btn) => group.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

  // 01: run log ending
  const log = $('[data-log]');
  const logBtns = $$('[data-log-mode]');
  if (log) logBtns.forEach((b) => b.addEventListener('click', () => {
    press(logBtns, b);
    log.classList.toggle('passing', b.dataset.logMode === 'pass');
  }));

  // 02: tickets before and after the fix
  const tickets = $('[data-tickets]');
  const fixBtns = $$('[data-fix]');
  const setFix = (on) => {
    tickets.classList.toggle('fixed', on);
    $('[data-count]', tickets).textContent = on ? '40' : '~100';
  };
  if (tickets) fixBtns.forEach((b) => b.addEventListener('click', () => { press(fixBtns, b); setFix(b.dataset.fix === 'on'); }));
  // Scrolling past the "fell to 40" beat shows the after state unless the visitor chose one.
  const fellBeat = tickets?.closest('[data-scene]')?.querySelector('.beats li[data-at="0.6"]');
  let chosen = false;
  fixBtns.forEach((b) => b.addEventListener('click', () => { chosen = true; }));
  if (fellBeat) new MutationObserver(() => {
    if (chosen) return;
    const on = fellBeat.classList.contains('on');
    setFix(on); press(fixBtns, fixBtns.find((b) => b.dataset.fix === (on ? 'on' : 'off')));
  }).observe(fellBeat, { attributes: true, attributeFilter: ['class'] });

  // 03: Brier score of the visitor's own forecast
  const pIn = $('[data-p-in]');
  const yBtns = $$('[data-y]');
  let y = 1;
  const brier = () => {
    const p = Number(pIn.value) / 100;
    const score = (p - y) ** 2;
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

  // 04: re-segment buyers with a different loyalty threshold
  const dist = JSON.parse(($('#order-dist') || {}).textContent || '[]');
  const slider = $('[data-loyal]');
  const pre = $('[data-sql]');
  const pct = (x, total) => `${((x / total) * 100).toFixed(1)}%`;
  const seg = (k) => {
    const sum = (f) => dist.filter(([n]) => f(n)).reduce((a, [, c, s]) => [a[0] + c, a[1] + s], [0, 0]);
    const all = sum(() => true);
    return [sum((n) => n === 1), sum((n) => n >= 2 && n < k), sum((n) => n >= k)].map(([c, s]) => [pct(c, all[0]), pct(s, all[1])]);
  };
  if (slider) slider.addEventListener('input', () => {
    const k = Number(slider.value);
    $('[data-loyal-out]').textContent = `${k}+`;
    seg(k).forEach(([b, r], i) => { $(`[data-c="b${i}"]`).textContent = b; $(`[data-c="r${i}"]`).textContent = r; });
    $('[data-c="name"]').textContent = `Loyal (${k}+)`;
    pre.dataset.locked = '1';
    pre.classList.remove('typing');
    pre.textContent = pre.dataset.tpl.replace('{r}', k - 1).replace('{k}', k);
    slider.setAttribute('aria-valuetext', `${k} or more orders`);
    // Once the visitor drives the slider, keep the table visible regardless of scroll position.
    [$('[data-seg]'), $('[data-seg] .hi')].forEach((el) => { if (el) { el.dataset.at = '0'; el.classList.add('on'); } });
  });
})();
