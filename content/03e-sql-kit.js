/* Shared building blocks for the SQL pages that use the wide "sectioned" layout
   (Advanced SQL, Indexing & Performance, Transactions & Design). Registers no module; exposes Learn.sqlKit. */
(() => {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const NULLC = '<span class="tv-null">NULL</span>';

  /* Table. A row is an array of cells, or {r: [cells], cls: 'hl' | 'ok'} to tint it (amber / green). */
  const tv = (name, cols, rows) =>
    `<div class="tv"><div class="tv-head">${name}<small>${rows.length} row${rows.length === 1 ? '' : 's'}</small></div><div class="tv-scroll"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>` +
    rows.map((r) => (Array.isArray(r) ? `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>` : `<tr class="${r.cls}">${r.r.map((c) => `<td>${c}</td>`).join('')}</tr>`)).join('') +
    `</tbody></table></div></div>`;
  const hl = (...r) => ({ r, cls: 'hl' });
  const ok = (...r) => ({ r, cls: 'ok' });
  const res = (cols, rows) => tv('result', cols, rows);
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  const card = (title, sub, body, cls = '') => `<div class="jcard ${cls}"><h4>${title}</h4>${sub ? `<p class="jsub">${sub}</p>` : ''}${body}</div>`;
  const cols = (n, ...items) => `<div class="jgrid j${n}">${items.join('')}</div>`;
  const sec = (id, n, title, sub, body) =>
    `<section class="jsec" id="${id}"><div class="jhead"><span class="jnum">${n}</span><div><h3>${title}</h3><p>${sub}</p></div></div>${body}</section>`;
  const callout = (title, t, tone = 'amber') => `<div class="callout ${tone}"><div class="callout-title">${title}</div>${p(t)}</div>`;
  const note = (t) => `<p class="jnote">${t}</p>`;

  const nav = (items) => `<nav class="jnav" aria-label="On this page">${items.map(([id, t]) => `<button class="jchip" data-act="scroll" data-target="${id}">${t}</button>`).join('')}</nav>`;
  const hero = ({ level, title, intro, items }) =>
    `<div class="jhero"><div><span class="jbadge">${level}</span><h2>${title}</h2>${p(intro)}</div><ul class="jlist">${items.map((t) => `<li>${t}</li>`).join('')}</ul></div>`;
  const band = (title, sub, html) =>
    `<div class="jband"><div class="jband-t"><strong>${title}</strong><span>${sub}</span></div><div class="tv-grid">${html}</div></div>`;
  const page = (...parts) => `<div class="doc jwide">${parts.join('')}</div>`;

  /* Two-transaction timeline: rows are [a, b, note]. Empty a/b means that transaction is idle. */
  const timeline = (rows) =>
    `<table class="jtime"><thead><tr><th>#</th><th>Transaction A</th><th>Transaction B</th><th>What happens</th></tr></thead><tbody>` +
    rows.map(([a, b, n, cls], i) => `<tr${cls ? ` class="${cls}"` : ''}><td>${i + 1}</td><td>${a ? `<code>${esc(a)}</code>` : ''}</td><td>${b ? `<code>${esc(b)}</code>` : ''}</td><td>${n}</td></tr>`).join('') +
    `</tbody></table>`;

  /* Add a section to the SQL module. */
  const add = (section) => {
    const mod = Learn.modules.find((m) => m.id === 'sql');
    if (mod) mod.sections.push({ qna: [], notes: [], quiz: [], ...section });
  };

  window.Learn.sqlKit = { esc, p, code, NULLC, tv, hl, ok, res, table, card, cols, sec, callout, note, nav, hero, band, page, timeline, add };
})();
