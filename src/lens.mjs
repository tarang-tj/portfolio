// Renders the recruiter lens section: lane tabs, one card per project, and the project map.
// Without JavaScript every card shows and the tabs are hidden; lens.js filters by lane.
import { lanes, projects } from './lanes.mjs';

const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
const laneOf = (id) => lanes.find((l) => l.id === id);

const card = (p) => `<article class="pcard" id="p-${p.id}" data-lanes="${p.lanes.join(' ')}" data-hue="var(--${laneOf(p.lanes[0]).hue})" style="--hue:var(--${laneOf(p.lanes[0]).hue})">
  ${p.img ? `<img src="${p.img}" alt="Screenshot of ${p.title}" loading="lazy">` : ''}
  <p class="p-org">${p.org}</p>
  <h3>${p.case ? `<a href="work/${p.case}.html">${p.title}</a>` : p.title}</h3>
  <p class="p-metric"><b>${p.metric[0]}</b><span>${p.metric[1]}</span></p>
  <p class="p-line">${p.line}</p>
  <ul class="p-tags">${p.lanes.map((l) => `<li class="lane-tag" style="--hue:var(--${laneOf(l).hue})">${laneOf(l).name}</li>`).join('')}${p.tools.map((t) => `<li>${t}</li>`).join('')}</ul>
  <p class="links">${p.case ? `<a href="work/${p.case}.html">Case study</a>` : ''}${(p.links || []).map(([t, h]) => ext(h, t)).join('')}</p>
</article>`;

const intro = (l) => `<div class="lane-intro" data-lane-intro="${l.id}" hidden>
  <p class="lane-pitch">${l.pitch}</p>
  <ul class="lane-skills">${l.skills.map((s) => `<li>${s}</li>`).join('')}</ul>
</div>`;

const mapRow = (p) => `<tr data-lanes="${p.lanes.join(' ')}"><th scope="row"><a href="#p-${p.id}">${p.title}</a></th>${lanes.map((l) =>
  `<td data-col="${l.id}">${p.lanes.includes(l.id) ? `<span class="dot" style="--hue:var(--${l.hue})" role="img" aria-label="${l.name}"></span>` : ''}</td>`).join('')}</tr>`;

export const lensLinks = lanes.map((l) => `<a href="#lens" data-jump="${l.id}" style="--hue:var(--${l.hue})">${l.name}</a>`).join('');

export const lens = `<section id="lens" class="lens" data-section="work" data-layout="none" data-cap="">
  <h2 class="sec-title">Pick the role you are hiring for</h2>
  <p class="sec-sub">Each tab shows the projects that prove that kind of work. Some projects sit in more than one lane. Every tab has its own link you can share.</p>
  <div class="tabs" role="tablist" aria-label="Work by role">
    <button type="button" role="tab" id="all" aria-selected="true" aria-controls="lens-panel" data-lane="all">All work <small>${projects.length}</small></button>
    ${lanes.map((l) => `<button type="button" role="tab" id="${l.id}" aria-selected="false" aria-controls="lens-panel" tabindex="-1" data-lane="${l.id}" data-hue="${l.hue}" style="--hue:var(--${l.hue})">${l.name} <small>${projects.filter((p) => p.lanes.includes(l.id)).length}</small></button>`).join('')}
  </div>
  <p class="sr-only" aria-live="polite" data-lens-status></p>
  <div id="lens-panel" role="tabpanel" aria-labelledby="all">
    ${lanes.map(intro).join('')}
    <div class="pgrid">${projects.map(card).join('')}</div>
  </div>
  <details class="pmap" open>
    <summary>Where each project sits</summary>
    <div class="pmap-wrap"><table>
      <thead><tr><th scope="col">Project</th>${lanes.map((l) => `<th scope="col" data-col="${l.id}">${l.name}</th>`).join('')}</tr></thead>
      <tbody>${projects.map(mapRow).join('')}</tbody>
    </table></div>
  </details>
</section>`;
