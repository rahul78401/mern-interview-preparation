/* Sekher learning guide: router, views, progress, quiz, search.
   No build step, no dependencies. Works from file:// or any static host. */
(() => {
  'use strict';

  const L = window.Learn;
  const site = Object.assign({ title: 'Sekher', tagline: 'Interview prep', heroTitle: 'Overview', heroText: '' }, L.site);

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const strip = (h) => { const d = document.createElement('div'); d.innerHTML = h || ''; return d.textContent || ''; };
  const pad = (n) => String(n).padStart(2, '0');
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const fmtDate = (d) => {
    if (!d) return '';
    const t = new Date(d + 'T00:00:00');
    return isNaN(t) ? d : t.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const readTime = (h) => Math.max(1, Math.round(strip(h).trim().split(/\s+/).length / 200));

  const ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    cross: '<path d="M6 6l12 12M18 6L6 18"/>',
    qna: '<path d="M4 5h16v11H9l-5 4z"/>',
    note: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.8-2.5 2-2.5 4M12 17h.01"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7M20 5v6h-6"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  };
  const ico = (n, s = 18, cls = '') =>
    `<svg class="ico ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  /* ---------- progress (localStorage, always optional) ---------- */
  const KEY = 'sekher-learning:v1';
  const blank = () => ({ qna: {}, quiz: {}, last: '' });
  const load = () => {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return blank(); }
  };
  let state = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked */ } };

  /* ---------- content model ---------- */
  const mods = L.modules.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const modById = {};
  mods.forEach((m, mi) => {
    m.num = mi + 1;
    modById[m.id] = m;
    m.sections = (m.sections || []).map((s, si) => {
      s.mod = m;
      s.num = si + 1;
      s.qna = (s.qna || []).map((q, qi) => Object.assign({}, q, {
        key: q.id || 'q' + (qi + 1),
        id: `${m.id}/${s.id}/${q.id || 'q' + (qi + 1)}`,
        level: ['basic', 'intermediate', 'advanced'].includes(q.level) ? q.level : 'basic',
        sec: s,
      }));
      s.notes = (s.notes || []).map((n, ni) => Object.assign({}, n, { id: n.id || 'n' + (ni + 1) }));
      s.quiz = s.quiz || [];
      return s;
    });
  });
  const flat = mods.flatMap((m) => m.sections);
  const secHref = (s, tab) => `#/m/${s.mod.id}/${s.id}${tab && tab !== 'overview' ? '/' + tab : ''}`;

  const secCounts = (s) => {
    let known = 0, rev = 0;
    s.qna.forEach((q) => { const v = state.qna[q.id]; if (v === 'known') known++; else if (v === 'revise') rev++; });
    return { total: s.qna.length, known, rev };
  };
  const modCounts = (m) => m.sections.reduce((a, s) => {
    const c = secCounts(s);
    a.total += c.total; a.known += c.known; a.rev += c.rev;
    return a;
  }, { total: 0, known: 0, rev: 0 });
  const totals = () => mods.reduce((a, m) => {
    const c = modCounts(m);
    a.total += c.total; a.known += c.known; a.rev += c.rev;
    return a;
  }, { total: 0, known: 0, rev: 0 });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /* ---------- routing ---------- */
  const view = $('#view');
  const navOpen = new Set();
  let current = null;   // { sec, tab } for the section being shown
  let quiz = null;      // live quiz state

  const parseRoute = () => {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    return { parts: path.split('/').filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(qs || '') };
  };

  function render() {
    const r = parseRoute();
    const p = r.parts;
    let html = '', title = '';
    current = null;
    document.body.classList.remove('nav-open');

    if (!p.length) {
      html = viewHome();
    } else if (p[0] === 'recap') {
      html = viewRecap(); title = 'Quick recap';
    } else if (p[0] === 'm' && modById[p[1]]) {
      const m = modById[p[1]];
      if (!p[2]) {
        html = viewModule(m); title = m.title;
      } else {
        const s = m.sections.find((x) => x.id === p[2]);
        if (s) { html = viewSection(s, p[3] || 'overview', p[4], r.q); title = `${s.title} · ${m.title}`; }
        else html = notFound();
      }
    } else {
      html = notFound();
    }

    view.innerHTML = html;
    document.title = title ? `${title} — ${site.title}` : `${site.title} · ${site.tagline}`;
    renderSidebar(p);
    renderTopProgress();
    if (current && current.tab === 'quiz') { quiz = { sec: current.sec, i: -1, picked: null, answers: [] }; renderQuiz(); }

    const open = r.q.get('open');
    const target = open && $$('.qa', view).find((el) => el.dataset.key === open);
    if (target) {
      target.classList.add('open');
      $('.qa-q', target).setAttribute('aria-expanded', 'true');
      target.scrollIntoView({ block: 'center' });
    } else {
      window.scrollTo(0, 0);
    }

    if (p.length) { state.last = location.hash; save(); }
  }

  const notFound = () => `
    <div class="page"><div class="empty"><h3>Page not found</h3><p>That link doesn't match anything in the guide.</p>
    <p style="margin-top:20px"><a class="btn btn-dark btn-sm" href="#/">Back to overview</a></p></div></div>`;

  /* ---------- sidebar & top bar ---------- */
  function renderSidebar(p) {
    const inMod = p[0] === 'm' ? p[1] : null;
    const inSec = p[0] === 'm' ? p[2] : null;
    if (inMod) navOpen.add(inMod);
    const rev = totals().rev;
    $('#nav').innerHTML = `
      <a class="nav-link ${!p.length ? 'is-active' : ''}" href="#/">${ico('home')}Overview</a>
      <a class="nav-link ${p[0] === 'recap' ? 'is-active' : ''}" href="#/recap">${ico('bookmark')}Quick recap${rev ? `<span class="count badge-amber">${rev}</span>` : ''}</a>
      <div class="nav-label">Modules</div>
      ${mods.map((m) => `
        <div class="nav-mod ${navOpen.has(m.id) ? 'is-open' : ''}">
          <div class="nav-mod-row ${inMod === m.id && !inSec ? 'is-active' : ''}">
            <a class="nav-mod-link" href="#/m/${esc(m.id)}"><span class="nav-num">${pad(m.num)}</span><span class="nav-mod-title">${esc(m.title)}</span></a>
            <button class="nav-chev" data-act="nav-mod" data-id="${esc(m.id)}" aria-label="Toggle ${esc(m.title)}">${ico('chevron', 16)}</button>
          </div>
          <div class="nav-subs">
            ${m.sections.map((s) => {
              const c = secCounts(s);
              const done = c.total > 0 && c.known === c.total;
              return `<a class="nav-sub ${inMod === m.id && inSec === s.id ? 'is-active' : ''}" href="${secHref(s)}"><span>${esc(s.title)}</span>${done ? `<span class="done">${ico('check', 14)}</span>` : c.total ? `<span class="count">${c.known}/${c.total}</span>` : ''}</a>`;
            }).join('')}
          </div>
        </div>`).join('') || '<p class="muted" style="padding:8px 12px;font-size:14px">No modules yet.</p>'}`;
  }

  function renderTopProgress() {
    const t = totals(), el = $('#top-progress');
    if (!t.total) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<span><b>${t.known}</b> / ${t.total} known</span><div class="bar"><i style="width:${pct(t.known, t.total)}%"></i></div>`;
  }

  /* ---------- views ---------- */
  function updatesList() {
    const items = [];
    mods.forEach((m) => { if (m.added) items.push({ date: m.added, title: `New module: ${m.title}`, text: m.summary, href: `#/m/${m.id}` }); });
    (L.updates || []).forEach((u) => items.push(u));
    return items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  const moduleCard = (m) => {
    const c = modCounts(m);
    const nq = m.sections.reduce((a, s) => a + s.quiz.length, 0);
    return `
      <a class="card" href="#/m/${esc(m.id)}">
        <div class="card-top"><span class="card-num">MODULE ${pad(m.num)}</span>${m.sample ? '<span class="tag sample">Sample</span>' : ''}</div>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.summary || '')}</p>
        <div class="card-foot">
          <div class="card-meta"><span>${ico('layers', 14)}${plural(m.sections.length, 'sub-module')}</span><span>${ico('qna', 14)}${c.total} Q&amp;A</span><span>${ico('quiz', 14)}${plural(nq, 'quiz question')}</span></div>
          <div class="card-prog"><div class="bar"><i style="width:${pct(c.known, c.total)}%"></i></div><span>${c.known}/${c.total}</span></div>
        </div>
      </a>`;
  };

  function viewHome() {
    const first = mods[0];
    const firstSec = flat[0];
    const cont = state.last && state.last !== '#/' ? state.last : '';
    const startHref = cont || (first ? `#/m/${first.id}` : '#/recap');
    const ups = updatesList();
    const shown = ups.slice(0, 4);

    const mockMods = mods.slice(0, 4).map((m, i) => `<div class="m-item ${i === 0 ? 'on' : ''}">${esc(m.title)}</div>`).join('') || '<div class="m-item">No modules yet</div>';
    const q = (tab) => (firstSec ? secHref(firstSec, tab) : '#/');

    return `
    <div class="page wide">
      <section class="hero">
        <div>
          <h1 class="display">${esc(site.heroTitle)}</h1>
          <p class="lead" style="margin-top:32px">${esc(site.heroText)}</p>
          <div class="btn-row">
            <a class="btn btn-dark" href="${esc(startHref)}">${cont ? 'Continue learning' : 'Start learning'} ${ico('arrow', 16)}</a>
            <button class="link-arrow" data-act="scroll" data-target="modules-sec">Browse modules ${ico('arrow', 16)}</button>
          </div>
        </div>
        <div class="hero-card" aria-label="Preview of the guide">
          <div class="mock">
            <div class="mock-bar"><i></i><i></i><i></i></div>
            <div class="mock-body">
              <div class="mock-side">
                <div class="m-title">${esc(site.title)}</div>
                <div class="m-item on">Overview</div>
                <div class="m-item">Quick recap</div>
                <div class="m-label">Modules</div>
                ${mockMods}
              </div>
              <div class="mock-main">
                <h3>What should we revise today?</h3>
                <div class="mock-cards">
                  <a class="mock-card" href="${q('qna')}"><span class="mc-ico mc-green">${ico('qna', 12)}</span>Practice Q&amp;A</a>
                  <a class="mock-card" href="${q('quiz')}"><span class="mc-ico mc-amber">${ico('quiz', 12)}</span>Take a quiz</a>
                  <a class="mock-card" href="${q('notes')}"><span class="mc-ico mc-gray">${ico('note', 12)}</span>Read notes</a>
                  <a class="mock-card" href="#/recap"><span class="mc-ico mc-green">${ico('bookmark', 12)}</span>Quick recap</a>
                </div>
                <button class="mock-input" data-act="search-open"><span>Search any topic…</span><span class="mock-send">${ico('up', 11)}</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-head" id="modules-sec"><h2 class="h2">Modules</h2></div>
      ${mods.length ? `<div class="cards">${mods.map(moduleCard).join('')}</div>` : `<div class="empty"><h3>No modules yet</h3><p>Add a file in the content folder and list it in index.html. See README.md.</p></div>`}

      ${ups.length ? `
      <div class="section-head"><h2 class="h2">What’s new</h2>${ups.length > shown.length ? '<button class="btn-text" data-act="all-updates">View all updates ' + ico('arrow', 16) + '</button>' : ''}</div>
      <div class="timeline" id="timeline">${ups.map((u, i) => `
        <a class="tl-item" href="${esc(u.href || '#/')}" ${i >= shown.length ? 'hidden data-extra' : ''}>
          <div class="tl-date">${esc(fmtDate(u.date))}</div>
          <div class="tl-body"><div><h3>${esc(u.title)}</h3>${u.text ? `<p>${esc(u.text)}</p>` : ''}</div>${ico('arrow', 18)}</div>
        </a>`).join('')}</div>` : ''}
    </div>`;
  }

  function viewModule(m) {
    const c = modCounts(m);
    return `
    <div class="page">
      <div class="eyebrow"><a href="#/">Overview</a><span class="sep">/</span><span>Module ${pad(m.num)}</span>${m.sample ? '<span class="tag sample">Sample</span>' : ''}</div>
      <h1 class="display md">${esc(m.title)}</h1>
      <p class="lead" style="margin-top:20px">${esc(m.summary || '')}</p>
      ${c.total ? `<div class="card-prog" style="margin-top:28px;max-width:360px"><div class="bar"><i style="width:${pct(c.known, c.total)}%"></i></div><span>${c.known} of ${c.total} questions known</span></div>` : ''}
      <div class="section-head" style="margin:56px 0 24px"><h2 class="h2" style="font-size:28px">Sub-modules</h2></div>
      <div class="cards">${m.sections.map((s) => {
        const sc = secCounts(s);
        const best = state.quiz[`${m.id}/${s.id}`];
        return `
        <a class="card" href="${secHref(s)}">
          <div class="card-top"><span class="card-num">${pad(m.num)}.${pad(s.num)}</span></div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.description || '')}</p>
          <div class="card-foot">
            <div class="card-meta">${s.qna.length ? `<span>${ico('qna', 14)}${s.qna.length} Q&amp;A</span>` : ''}${s.notes.length ? `<span>${ico('note', 14)}${plural(s.notes.length, 'note')}</span>` : ''}${s.quiz.length ? `<span>${ico('quiz', 14)}Quiz${best ? ` · best ${best.best}/${best.total}` : ''}</span>` : ''}</div>
            ${sc.total ? `<div class="card-prog"><div class="bar"><i style="width:${pct(sc.known, sc.total)}%"></i></div><span>${sc.known}/${sc.total}</span></div>` : ''}
          </div>
        </a>`;
      }).join('') || '<div class="empty"><h3>No sub-modules yet</h3></div>'}</div>
    </div>`;
  }

  function viewSection(s, tab, noteId, q) {
    const m = s.mod;
    const tabs = [
      { k: 'overview', label: 'Overview' },
      { k: 'qna', label: 'Q&A', n: s.qna.length },
      { k: 'notes', label: 'Notes', n: s.notes.length },
      { k: 'quiz', label: 'Quiz', n: s.quiz.length },
    ].filter((t) => t.k === 'overview' || t.n);
    if (!tabs.some((t) => t.k === tab)) tab = 'overview';
    current = { sec: s, tab };

    let body = '';
    if (tab === 'overview') body = tabOverview(s);
    else if (tab === 'qna') body = tabQna(s);
    else if (tab === 'notes') body = tabNotes(s, noteId);
    else body = '<div class="quiz" id="quiz-root"></div>';

    const i = flat.indexOf(s);
    const prev = flat[i - 1], next = flat[i + 1];

    return `
    <div class="page">
      <div class="eyebrow"><a href="#/m/${esc(m.id)}">${esc(m.title)}</a><span class="sep">/</span><span>${pad(m.num)}.${pad(s.num)}</span></div>
      <h1 class="display md">${esc(s.title)}</h1>
      ${s.description ? `<p class="lead" style="margin-top:20px">${esc(s.description)}</p>` : ''}
      <nav class="tabs" aria-label="Sections">${tabs.map((t) => `<a class="tab ${t.k === tab ? 'is-active' : ''}" href="${secHref(s, t.k)}">${t.label}${t.n ? `<span class="n">${t.n}</span>` : ''}</a>`).join('')}</nav>
      ${body}
      <div class="pager">
        ${prev ? `<a href="${secHref(prev)}"><small>Previous</small><span>${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="next" href="${secHref(next)}"><small>Next</small><span>${esc(next.title)}</span></a>` : ''}
      </div>
    </div>`;
  }

  function tabOverview(s) {
    const hasAny = s.intro || (s.keyPoints && s.keyPoints.length) || s.tip;
    if (!hasAny) return '<div class="empty"><h3>Nothing here yet</h3><p>Content for this sub-module is on its way.</p></div>';
    return `
      ${s.intro ? `<div class="prose">${s.intro}</div>` : ''}
      <div class="stack">
        ${s.keyPoints && s.keyPoints.length ? `<div class="callout green"><div class="callout-title">${ico('check', 16)}Key points</div><ul>${s.keyPoints.map((k) => `<li>${k}</li>`).join('')}</ul></div>` : ''}
        ${s.tip ? `<div class="callout amber"><div class="callout-title">Tip</div>${s.tip}</div>` : ''}
      </div>`;
  }

  function qaItem(q, i, ctx) {
    const st = state.qna[q.id] || '';
    return `
    <article class="qa" data-id="${esc(q.id)}" data-key="${esc(q.key)}" data-level="${q.level}" data-state="${st}">
      <button class="qa-q" data-act="toggle" aria-expanded="false">
        <span class="qa-num">${pad(i + 1)}</span>
        <span class="qa-text">${q.q}</span>
        <span class="qa-meta"><span class="tag ${q.level}">${cap(q.level)}</span><span class="state-dot" title="Progress"></span></span>
        ${ico('chevron', 16, 'qa-chev')}
      </button>
      <div class="qa-a"><div class="qa-a-in">
        ${ctx ? `<a class="ctx" href="${secHref(q.sec, 'qna')}?open=${encodeURIComponent(q.key)}">${esc(ctx)}</a>` : ''}
        <div class="prose">${q.a}</div>
        <div class="qa-actions">
          <button class="chip chip-green" data-act="mark" data-v="known">${ico('check', 15)}Got it</button>
          <button class="chip chip-amber" data-act="mark" data-v="revise">${ico('refresh', 15)}Revise later</button>
        </div>
      </div></div>
    </article>`;
  }

  const summaryLine = (c) =>
    `<span><b>${c.total}</b> questions</span><span class="g"><b>${c.known}</b> known</span><span class="a"><b>${c.rev}</b> to revise</span>`;

  function tabQna(s) {
    const levels = ['basic', 'intermediate', 'advanced'].filter((l) => s.qna.some((q) => q.level === l));
    return `
      <div class="toolbar">
        <div class="pills" role="group" aria-label="Filter">
          <button class="pill is-active" data-act="filter" data-f="all">All</button>
          ${levels.map((l) => `<button class="pill" data-act="filter" data-f="${l}">${cap(l)}</button>`).join('')}
          <button class="pill" data-act="filter" data-f="revise">To revise</button>
        </div>
        <button class="linkish" data-act="expand-all">Expand all</button>
      </div>
      <div class="summary-line" id="qna-summary" style="margin-bottom:20px">${summaryLine(secCounts(s))}</div>
      <div class="qa-list" id="qa-list">${s.qna.map((q, i) => qaItem(q, i)).join('')}</div>
      <div class="empty" id="qa-empty" hidden style="margin-top:20px"><h3>Nothing to show</h3><p>No questions match this filter.</p></div>`;
  }

  function tabNotes(s, noteId) {
    if (noteId) {
      const n = s.notes.find((x) => x.id === noteId);
      if (n) {
        return `
        <div class="article">
          <a class="back" href="${secHref(s, 'notes')}">${ico('arrow', 16)}All notes</a>
          <h2>${esc(n.title)}</h2>
          <div class="note-meta">${n.date ? `<span>${esc(fmtDate(n.date))}</span><span>·</span>` : ''}<span>${readTime(n.body)} min read</span>${(n.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <div class="prose">${n.body}</div>
        </div>`;
      }
    }
    return `<div class="notes">${s.notes.map((n) => `
      <a class="note-row" href="${secHref(s, 'notes')}/${encodeURIComponent(n.id)}">
        <h3>${esc(n.title)}</h3>
        <div class="note-meta">${n.date ? `<span>${esc(fmtDate(n.date))}</span><span>·</span>` : ''}<span>${readTime(n.body)} min read</span>${(n.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      </a>`).join('')}</div>`;
  }

  function viewRecap() {
    const t = totals();
    const revise = flat.flatMap((s) => s.qna.filter((q) => state.qna[q.id] === 'revise'));
    const taken = flat.filter((s) => state.quiz[`${s.mod.id}/${s.id}`]);
    const groups = {};
    revise.forEach((q) => { (groups[`${q.sec.mod.title} › ${q.sec.title}`] = groups[`${q.sec.mod.title} › ${q.sec.title}`] || []).push(q); });

    return `
    <div class="page">
      <div class="eyebrow"><a href="#/">Overview</a><span class="sep">/</span><span>Recap</span></div>
      <h1 class="display md">Quick recap</h1>
      <p class="lead" style="margin-top:20px">Everything you flagged for another look, plus your quiz scores. Use it the night before an interview.</p>
      <div class="stats">
        <div class="stat g"><b>${t.known}</b><span>Questions known</span></div>
        <div class="stat a"><b>${t.rev}</b><span>To revise</span></div>
        <div class="stat"><b>${taken.length}</b><span>${taken.length === 1 ? 'Quiz' : 'Quizzes'} taken</span></div>
      </div>

      <div class="section-head" style="margin:56px 0 8px"><h2 class="h2" style="font-size:28px">To revise</h2></div>
      ${revise.length ? Object.keys(groups).map((g) => `
        <div class="group-title">${esc(g)}</div>
        <div class="qa-list">${groups[g].map((q, i) => qaItem(q, i, 'Open in context')).join('')}</div>`).join('')
        : `<div class="empty"><h3>Nothing flagged</h3><p>Tap “Revise later” on any question and it will collect here.</p></div>`}

      ${taken.length ? `
      <div class="section-head" style="margin:56px 0 8px"><h2 class="h2" style="font-size:28px">Quiz scores</h2></div>
      <table class="score-table"><tbody>${taken.map((s) => {
        const r = state.quiz[`${s.mod.id}/${s.id}`];
        return `<tr><td><a href="${secHref(s, 'quiz')}">${esc(s.title)}</a><span class="sub">${esc(s.mod.title)}</span></td><td>Best ${r.best}/${r.total}</td></tr>`;
      }).join('')}</tbody></table>` : ''}

      <div class="danger-zone"><span>Progress is stored in this browser only.</span><button class="btn btn-light btn-sm" data-act="reset">Reset progress</button></div>
    </div>`;
  }

  /* ---------- quiz ---------- */
  const qKey = (s) => `${s.mod.id}/${s.id}`;

  function renderQuiz() {
    const root = $('#quiz-root');
    if (!root || !quiz) return;
    const s = quiz.sec, qs = s.quiz, rec = state.quiz[qKey(s)];

    if (quiz.i < 0) {
      root.innerHTML = `
        <div class="quiz-start">
          <h3>${plural(qs.length, 'question')}</h3>
          <p>One at a time, with an explanation after each answer.${rec ? ` Your best so far: <b>${rec.best}/${rec.total}</b>.` : ''}</p>
          <button class="btn btn-dark" data-act="quiz-start">${rec ? 'Try again' : 'Start quiz'} ${ico('arrow', 16)}</button>
        </div>`;
      return;
    }

    if (quiz.i >= qs.length) {
      const score = quiz.answers.filter((a, i) => a === qs[i].answer).length;
      const p = pct(score, qs.length);
      const msg = p === 100 ? 'Perfect. You have this down.' : p >= 70 ? 'Strong recall. Review the ones you missed.' : p >= 40 ? 'Getting there. Revisit the Q&A and try again.' : 'Worth another pass through the Q&A first.';
      root.innerHTML = `
        <div class="score"><span class="score-num">${score}</span><span class="score-of">/ ${qs.length}</span></div>
        <p class="score-msg">${msg}</p>
        <div class="review">${qs.map((q, i) => {
          const ok = quiz.answers[i] === q.answer;
          return `<div class="review-row"><span class="review-mark ${ok ? 'ok' : 'no'}">${ico(ok ? 'check' : 'cross', 14)}</span><div><div class="r-q">${q.q}</div><div class="r-a">${ok ? 'Correct: ' : 'Answer: '}${q.options[q.answer]}</div></div></div>`;
        }).join('')}</div>
        <div class="quiz-actions">
          <button class="btn btn-dark" data-act="quiz-start">${ico('refresh', 16)} Retry</button>
          ${s.qna.length ? `<a class="btn btn-light" href="${secHref(s, 'qna')}">Back to Q&amp;A</a>` : ''}
        </div>`;
      return;
    }

    const q = qs[quiz.i];
    const answered = quiz.picked !== null;
    const last = quiz.i === qs.length - 1;
    root.innerHTML = `
      <div class="quiz-head"><span>Question <b>${quiz.i + 1}</b> of ${qs.length}</span><span>${rec ? `Best ${rec.best}/${rec.total}` : ''}</span></div>
      <div class="bar"><i style="width:${pct(quiz.i + (answered ? 1 : 0), qs.length)}%"></i></div>
      <h2 class="quiz-q">${q.q}</h2>
      <div class="opts">${q.options.map((o, i) => {
        let cls = '';
        if (answered) cls = i === q.answer ? 'is-correct' : i === quiz.picked ? 'is-wrong' : 'is-dim';
        return `<button class="opt ${cls}" data-act="quiz-pick" data-i="${i}" ${answered ? 'disabled' : ''}><span class="opt-key">${String.fromCharCode(65 + i)}</span><span>${o}</span></button>`;
      }).join('')}</div>
      ${answered ? `
        <div class="callout ${quiz.picked === q.answer ? 'green' : 'amber'} explain"><div class="callout-title">${quiz.picked === q.answer ? 'Correct' : 'Not quite'}</div>${q.explain || ''}</div>
        <div class="quiz-actions"><button class="btn btn-dark" data-act="quiz-next">${last ? 'See result' : 'Next question'} ${ico('arrow', 16)}</button></div>` : ''}`;
  }

  function finishQuiz() {
    const s = quiz.sec, qs = s.quiz;
    const score = quiz.answers.filter((a, i) => a === qs[i].answer).length;
    const prev = state.quiz[qKey(s)];
    state.quiz[qKey(s)] = { best: Math.max(score, prev ? prev.best : 0), last: score, total: qs.length, at: Date.now() };
    save();
    renderSidebar(parseRoute().parts);
  }

  /* ---------- actions ---------- */
  let resetArmed = false;
  const actions = {
    toggle(el) {
      const qa = el.closest('.qa');
      const open = qa.classList.toggle('open');
      el.setAttribute('aria-expanded', String(open));
    },
    mark(el) {
      const qa = el.closest('.qa');
      const id = qa.dataset.id, v = el.dataset.v;
      if (state.qna[id] === v) delete state.qna[id]; else state.qna[id] = v;
      save();
      qa.dataset.state = state.qna[id] || '';
      if (current && current.tab === 'qna') $('#qna-summary').innerHTML = summaryLine(secCounts(current.sec));
      renderSidebar(parseRoute().parts);
      renderTopProgress();
    },
    filter(el) {
      const f = el.dataset.f;
      $$('.pill').forEach((p) => p.classList.toggle('is-active', p === el));
      let shown = 0;
      $$('#qa-list .qa').forEach((qa) => {
        const ok = f === 'all' || qa.dataset.level === f || (f === 'revise' && qa.dataset.state === 'revise');
        qa.hidden = !ok;
        if (ok) shown++;
      });
      $('#qa-empty').hidden = shown > 0;
    },
    'expand-all'(el) {
      const open = el.textContent.trim() === 'Expand all';
      $$('#qa-list .qa:not([hidden])').forEach((qa) => {
        qa.classList.toggle('open', open);
        $('.qa-q', qa).setAttribute('aria-expanded', String(open));
      });
      el.textContent = open ? 'Collapse all' : 'Expand all';
    },
    'nav-mod'(el) {
      const id = el.dataset.id;
      navOpen.has(id) ? navOpen.delete(id) : navOpen.add(id);
      el.closest('.nav-mod').classList.toggle('is-open');
    },
    'nav-toggle': () => document.body.classList.toggle('nav-open'),
    'nav-close': () => document.body.classList.remove('nav-open'),
    scroll(el) { const t = document.getElementById(el.dataset.target); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    'all-updates'(el) { $$('#timeline [data-extra]').forEach((a) => { a.hidden = false; }); el.hidden = true; },
    'quiz-start'() { quiz.i = 0; quiz.picked = null; quiz.answers = []; renderQuiz(); },
    'quiz-pick'(el) {
      if (quiz.picked !== null) return;
      quiz.picked = Number(el.dataset.i);
      quiz.answers[quiz.i] = quiz.picked;
      renderQuiz();
    },
    'quiz-next'() {
      quiz.i++; quiz.picked = null;
      if (quiz.i >= quiz.sec.quiz.length) finishQuiz();
      renderQuiz();
      $('#quiz-root').scrollIntoView({ block: 'nearest' });
    },
    reset(el) {
      if (!resetArmed) { resetArmed = true; el.textContent = 'Click again to confirm'; setTimeout(() => { resetArmed = false; if (el.isConnected) el.textContent = 'Reset progress'; }, 4000); return; }
      resetArmed = false; state = blank(); save(); render();
    },
    'search-open': openSearch,
    'search-close': closeSearch,
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = actions[el.dataset.act];
    if (fn) fn(el, e);
  });

  /* ---------- search ---------- */
  let sidx = null, sel = 0, hits = [];
  const searchEl = $('#search'), sInput = $('#search-input'), sOut = $('#search-results');

  function buildIndex() {
    sidx = [];
    mods.forEach((m) => {
      sidx.push({ type: 'Module', title: m.title, sub: m.summary || '', hay: `${m.title} ${m.summary || ''}`.toLowerCase(), href: `#/m/${m.id}` });
      m.sections.forEach((s) => {
        sidx.push({ type: 'Sub-module', title: s.title, sub: m.title, hay: `${s.title} ${s.description || ''} ${strip(s.intro)}`.toLowerCase(), href: secHref(s) });
        s.qna.forEach((q) => sidx.push({
          type: 'Q&A', title: strip(q.q), sub: `${m.title} › ${s.title}`,
          hay: `${strip(q.q)} ${strip(q.a)} ${(q.tags || []).join(' ')}`.toLowerCase(),
          href: `${secHref(s, 'qna')}?open=${encodeURIComponent(q.key)}`,
        }));
        s.notes.forEach((n) => sidx.push({
          type: 'Note', title: n.title, sub: `${m.title} › ${s.title}`,
          hay: `${n.title} ${strip(n.body)} ${(n.tags || []).join(' ')}`.toLowerCase(),
          href: `${secHref(s, 'notes')}/${encodeURIComponent(n.id)}`,
        }));
      });
    });
  }

  function runSearch() {
    if (!sidx) buildIndex();
    const terms = sInput.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { hits = sidx.filter((x) => x.type === 'Sub-module' || x.type === 'Module').slice(0, 8); }
    else {
      hits = sidx
        .filter((x) => terms.every((t) => x.hay.includes(t)))
        .map((x) => ({ x, score: terms.reduce((a, t) => a + (x.title.toLowerCase().includes(t) ? 3 : 0), 0) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 30)
        .map((o) => o.x);
    }
    sel = 0;
    sOut.innerHTML = hits.length
      ? hits.map((h, i) => `<a class="sr ${i === 0 ? 'is-sel' : ''}" href="${h.href}" data-act="search-close"><span class="sr-type">${h.type}</span><span class="sr-main"><div class="sr-title">${esc(h.title)}</div><div class="sr-sub">${esc(h.sub)}</div></span></a>`).join('')
      : `<div class="search-empty">No results for “${esc(sInput.value)}”.</div>`;
  }

  function openSearch() {
    searchEl.hidden = false;
    sInput.value = '';
    runSearch();
    sInput.focus();
  }
  function closeSearch() { searchEl.hidden = true; }
  const moveSel = (d) => {
    const rows = $$('.sr', sOut);
    if (!rows.length) return;
    rows[sel].classList.remove('is-sel');
    sel = (sel + d + rows.length) % rows.length;
    rows[sel].classList.add('is-sel');
    rows[sel].scrollIntoView({ block: 'nearest' });
  };

  sInput.addEventListener('input', runSearch);
  sInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'Enter') { const row = $$('.sr', sOut)[sel]; if (row) { closeSearch(); location.hash = row.getAttribute('href'); } }
  });
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === 'Escape') { if (!searchEl.hidden) closeSearch(); else document.body.classList.remove('nav-open'); }
    else if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openSearch(); }
  });

  /* ---------- boot ---------- */
  $('#nav-btn').innerHTML = ico('menu', 20);
  $('#search-ico').innerHTML = ico('search', 16);
  $('#search-box-ico').innerHTML = ico('search', 20);
  window.addEventListener('hashchange', render);
  render();
})();
