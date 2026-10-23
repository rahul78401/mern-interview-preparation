/* SQL Quiz engine. Builds question pages (cards with a hint panel on the right) and wires the buttons.
   Exposes Learn.quizKit. The two question pages (04a, 04b) only supply data. */
(() => {
  const K = Learn.sqlKit;
  if (!K) return;
  const { esc, tv, p, code, sec, nav, hero } = K;

  const COMPILER = 'https://www.programiz.com/sql/online-compiler';
  const STORE = 'sekher.sqlquiz.v1';

  /* ---------- reference data (same tables as the Programiz editor) ---------- */
  const customers = [['1', 'John', 'Doe', '31', 'USA'], ['2', 'Robert', 'Luna', '22', 'USA'], ['3', 'David', 'Robinson', '22', 'UK'], ['4', 'John', 'Reinhardt', '25', 'UK'], ['5', 'Betty', 'Doe', '28', 'UAE']];
  const orders = [['1', 'Keyboard', '400', '4'], ['2', 'Mouse', '300', '4'], ['3', 'Monitor', '12000', '3'], ['4', 'Keyboard', '400', '1'], ['5', 'Mousepad', '250', '2']];
  const shippings = [['1', 'Pending', '2'], ['2', 'Pending', '4'], ['3', 'Delivered', '3'], ['4', 'Pending', '5'], ['5', 'Delivered', '1']];
  const CUST_COLS = ['customer_id', 'first_name', 'last_name', 'age', 'country'];

  const SETUP = `DROP TABLE IF EXISTS Shippings;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Customers;

CREATE TABLE Customers (
  customer_id INT PRIMARY KEY,
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  age         INT,
  country     VARCHAR(100)
);
CREATE TABLE Orders (
  order_id    INT PRIMARY KEY,
  item        VARCHAR(100),
  amount      INT,
  customer_id INT
);
CREATE TABLE Shippings (
  shipping_id INT PRIMARY KEY,
  status      VARCHAR(100),
  customer    INT
);

INSERT INTO Customers VALUES
  (1, 'John',   'Doe',       31, 'USA'),
  (2, 'Robert', 'Luna',      22, 'USA'),
  (3, 'David',  'Robinson',  22, 'UK'),
  (4, 'John',   'Reinhardt', 25, 'UK'),
  (5, 'Betty',  'Doe',       28, 'UAE');
INSERT INTO Orders VALUES
  (1, 'Keyboard', 400,   4),
  (2, 'Mouse',    300,   4),
  (3, 'Monitor',  12000, 3),
  (4, 'Keyboard', 400,   1),
  (5, 'Mousepad', 250,   2);
INSERT INTO Shippings VALUES
  (1, 'Pending',   2),
  (2, 'Pending',   4),
  (3, 'Delivered', 3),
  (4, 'Pending',   5),
  (5, 'Delivered', 1);`;

  const refTables = () =>
    tv('Customers', CUST_COLS, customers) + tv('Orders', ['order_id', 'item', 'amount', 'customer_id'], orders) + tv('Shippings', ['shipping_id', 'status', 'customer'], shippings);

  const lab = (kind) =>
    `<div class="qz-lab"><div class="qz-lab-main"><h4>Practice in a real SQL editor</h4>` +
    p('Open the free Programiz online compiler in a new tab. It already has the three tables below, so you can run any query from this page.') +
    `<a class="btn btn-dark" href="${COMPILER}" target="_blank" rel="noopener">Open SQL compiler &nearr;</a>` +
    `<p class="jnote">Opens programiz.com/sql/online-compiler in a new tab.</p></div>` +
    `<ol class="tv-steps qz-lab-steps">` +
    (kind === 'read'
      ? `<li><strong>Read</strong> the query on this page and think about what it actually does, in plain English.</li><li>Press <strong>Show options</strong> and pick the description that fits. Stuck? Open the <strong>hint</strong> on the right.</li><li><strong>Check yourself:</strong> copy the query into the editor, press <strong>Run SQL</strong> and see if the output matches your idea.</li>`
      : `<li><strong>Read</strong> the task. Look at the reference tables to see what data you have.</li><li><strong>Write</strong> your query in the editor and press <strong>Run SQL</strong>.</li><li>Press <strong>Show expected output</strong> to compare, then <strong>Show solution</strong> if you are stuck.</li>`) +
    `</ol></div>`;

  const refBand = (kind) =>
    K.band('Reference tables', 'These are the sample tables in the editor. Every question on this page uses them.', refTables()) +
    `<details class="qz-setup"><summary>The editor shows different data? Paste this setup SQL and run it first</summary>${code(SETUP)}` +
    `<p class="jnote">${kind === 'read'
      ? 'Questions that run INSERT, UPDATE or DELETE assume the original data each time.'
      : 'Tasks 21 to 24 change the data. Run this setup again to get the original tables back.'}</p></details>`;

  /* ---------- cards ---------- */
  const letters = 'ABCD';
  const rot = (opts, shift) => opts.map((_, k) => opts[(k - shift + opts.length) % opts.length]);   // correct option is first in the data

  const hints = (list) =>
    `<aside class="qz-hint"><div class="qz-hint-title">Hints</div><ol class="qz-hints">${list.map((h) => `<li hidden>${h}</li>`).join('')}</ol>` +
    `<button type="button" class="btn btn-light btn-xs" data-qz="hint">Show hint</button></aside>`;

  const head = (n, tag) => `<header class="qz-head"><span class="qz-num">Q${n}</span><span class="qz-tag">${esc(tag)}</span><span class="qz-state" aria-live="polite"></span></header>`;

  const readCard = (n, q) => {
    const shift = n % 4;
    const opts = rot(q.options, shift);
    return `<article class="qz-card" data-page="read" data-id="r${n}" data-answer="${shift}">` + head(n, q.tag) +
      `<div class="qz-body"><div class="qz-main">` +
      `<p class="qz-ask">What does this query actually do?</p>${code(q.sql)}` +
      `<button type="button" class="btn btn-dark btn-xs" data-qz="show-opts">Show options</button>` +
      `<div class="qz-opts" hidden>${opts.map((o, k) => `<button type="button" class="qz-opt" data-qz="pick" data-i="${k}"><span class="qz-key">${letters[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>` +
      `<div class="qz-expl" hidden><p class="qz-verdict"></p><p>${q.explain}</p><p class="qz-ref">For reference, it returns:</p>${tv('output', q.result[0], q.result[1])}</div>` +
      `</div>${hints(q.hints)}</div></article>`;
  };

  const writeCard = (n, q) =>
    `<article class="qz-card" data-page="write" data-id="w${n}">` + head(n, q.tag) +
    `<div class="qz-body"><div class="qz-main">` +
    `<p class="qz-task">${q.task}</p>` +
    `<div class="qz-actions"><button type="button" class="btn btn-dark btn-xs" data-qz="toggle" data-for="out" data-show="Show expected output" data-hide="Hide expected output">Show expected output</button>` +
    `<button type="button" class="btn btn-light btn-xs" data-qz="toggle" data-for="sol" data-show="Show solution" data-hide="Hide solution">Show solution</button>` +
    `<button type="button" class="btn btn-light btn-xs qz-solved" data-qz="solved">Mark as solved</button></div>` +
    `<div class="qz-reveal" data-r="out" hidden>${tv('expected output', q.result[0], q.result[1])}</div>` +
    `<div class="qz-reveal" data-r="sol" hidden>${code(q.sql)}</div>` +
    `</div>${hints(q.hints)}</div></article>`;

  /* ---------- page ---------- */
  const buildPage = ({ kind, level, title, intro, items, groups }) => {
    const total = groups.reduce((a, g) => a + g.qs.length, 0);
    let n = 0;
    const secs = groups.map((g, gi) => {
      const first = n + 1;
      const cards = g.qs.map((q) => { n++; return kind === 'read' ? readCard(n, q) : writeCard(n, q); }).join('');
      return sec(`qz-${kind}-${gi}`, gi + 1, g.title, `${g.sub} <span class="qz-range">Q${first} to Q${n}</span>`, `<div class="qz-list">${cards}</div>`);
    });
    const chips = groups.map((g, gi) => `<button class="jchip" data-act="scroll" data-target="qz-${kind}-${gi}">${g.chip}</button>`).join('');
    const bar = `<nav class="jnav qz-bar" aria-label="On this page">${chips}` +
      `<div class="qz-prog"><span class="qz-pt"></span><span class="qz-pbar"><i style="width:0%"></i></span><button type="button" class="qz-reset" data-qz="reset">Reset</button></div></nav>`;
    return `<div class="doc jwide qz-root" data-page="${kind}" data-total="${total}">` +
      hero({ level, title, intro, items }) + lab(kind) + bar + refBand(kind) + secs.join('') + `</div>`;
  };

  const addQuiz = (section) => {
    const mod = Learn.modules.find((m) => m.id === 'sql-quiz');
    if (!mod) return;
    mod.unlocked = true;
    mod.sections.push({ qna: [], notes: [], quiz: [], ...section });
  };

  /* ---------- behaviour (event delegation, so it survives the app re-rendering) ---------- */
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
  const save = (s) => { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* storage blocked */ } };
  const remember = (page, id, val) => { const s = load(); s[page] = s[page] || {}; if (val === null) delete s[page][id]; else s[page][id] = val; save(s); };

  const progress = (root) => {
    const page = root.dataset.page, total = +root.dataset.total;
    const cards = [...root.querySelectorAll('.qz-card')];
    const done = cards.filter((c) => c.dataset.state).length;
    const good = cards.filter((c) => c.dataset.state === 'ok').length;
    const pt = root.querySelector('.qz-pt'), bar = root.querySelector('.qz-pbar i');
    if (pt) pt.textContent = page === 'read' ? `${done} / ${total} answered · ${good} correct` : `${good} / ${total} solved`;
    if (bar) bar.style.width = `${Math.round(((page === 'read' ? done : good) / total) * 100)}%`;
  };

  const pick = (card, i, persist) => {
    if (card.dataset.state) return;
    const ans = +card.dataset.answer;
    card.querySelectorAll('.qz-opt').forEach((o, k) => {
      o.disabled = true;
      o.classList.toggle('is-right', k === ans);
      o.classList.toggle('is-wrong', k === i && i !== ans);
    });
    card.dataset.state = i === ans ? 'ok' : 'bad';
    card.querySelector('.qz-opts').hidden = false;
    const b = card.querySelector('[data-qz="show-opts"]'); if (b) b.hidden = true;
    card.querySelector('.qz-expl').hidden = false;
    card.querySelector('.qz-verdict').innerHTML = i === ans ? '<strong class="qz-good">Correct.</strong>' : `<strong class="qz-miss">Not quite.</strong> The right answer is <strong>${letters[ans]}</strong>.`;
    card.querySelector('.qz-state').textContent = i === ans ? '✓ Correct' : 'Review';
    if (persist) remember('read', card.dataset.id, i);
  };

  const setSolved = (card, on, persist) => {
    if (on) card.dataset.state = 'ok'; else delete card.dataset.state;
    const b = card.querySelector('.qz-solved'); if (b) b.textContent = on ? 'Solved ✓' : 'Mark as solved';
    card.querySelector('.qz-state').textContent = on ? '✓ Solved' : '';
    if (persist) remember('write', card.dataset.id, on ? true : null);
  };

  const resetCard = (card) => {
    delete card.dataset.state;
    card.querySelectorAll('.qz-opt').forEach((o) => { o.disabled = false; o.classList.remove('is-right', 'is-wrong'); });
    const opts = card.querySelector('.qz-opts'); if (opts) opts.hidden = true;
    const so = card.querySelector('[data-qz="show-opts"]'); if (so) so.hidden = false;
    const ex = card.querySelector('.qz-expl'); if (ex) ex.hidden = true;
    card.querySelectorAll('.qz-reveal').forEach((r) => { r.hidden = true; });
    card.querySelectorAll('[data-qz="toggle"]').forEach((b) => { b.textContent = b.dataset.show; });
    const sv = card.querySelector('.qz-solved'); if (sv) sv.textContent = 'Mark as solved';
    card.querySelectorAll('.qz-hints li').forEach((li) => { li.hidden = true; });
    const hb = card.querySelector('[data-qz="hint"]'); if (hb) { hb.hidden = false; hb.textContent = 'Show hint'; }
    card.querySelector('.qz-state').textContent = '';
  };

  const init = (root) => {
    root.dataset.ready = '1';
    const saved = load()[root.dataset.page] || {};
    root.querySelectorAll('.qz-card').forEach((card) => {
      const v = saved[card.dataset.id];
      if (v === undefined) return;
      if (root.dataset.page === 'read') pick(card, v, false); else setSolved(card, true, false);
    });
    progress(root);
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-qz]');
    if (!el) return;
    const root = el.closest('.qz-root'), card = el.closest('.qz-card');
    if (!root) return;
    switch (el.dataset.qz) {
      case 'show-opts': card.querySelector('.qz-opts').hidden = false; el.hidden = true; break;
      case 'pick': pick(card, +el.dataset.i, true); break;
      case 'hint': {
        const next = [...card.querySelectorAll('.qz-hints li')].find((li) => li.hidden);
        if (next) next.hidden = false;
        if (![...card.querySelectorAll('.qz-hints li')].some((li) => li.hidden)) el.hidden = true; else el.textContent = 'Show another hint';
        break;
      }
      case 'toggle': {
        const r = card.querySelector(`.qz-reveal[data-r="${el.dataset.for}"]`);
        r.hidden = !r.hidden;
        el.textContent = r.hidden ? el.dataset.show : el.dataset.hide;
        break;
      }
      case 'solved': setSolved(card, card.dataset.state !== 'ok', true); break;
      case 'reset': {
        if (!el.dataset.armed) { el.dataset.armed = '1'; el.textContent = 'Click again to confirm'; setTimeout(() => { delete el.dataset.armed; el.textContent = 'Reset'; }, 3500); return; }
        delete el.dataset.armed; el.textContent = 'Reset';
        root.querySelectorAll('.qz-card').forEach(resetCard);
        const s = load(); delete s[root.dataset.page]; save(s);
        break;
      }
      default: return;
    }
    progress(root);
  });

  const scan = () => document.querySelectorAll('.qz-root:not([data-ready])').forEach(init);
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();

  const t = (cols, ...rows) => [cols, rows];   // result helper for the data files
  window.Learn.quizKit = { buildPage, addQuiz, t, customers, orders, shippings, CUST_COLS };
})();
