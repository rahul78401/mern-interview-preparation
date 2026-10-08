/* Small SVG illustration helpers. Transparent background, theme colours.
   Used from content files as Learn.fig.flow([...]) etc. Each returns an HTML string. */
(() => {
  let uid = 0;
  const COLORS = { '': ['#ffffff', '#0d0d0d'], green: ['#e7f3ec', '#1e7a4c'], amber: ['#fbf0db', '#b8741a'], gray: ['#f3f3f1', '#b9b9b5'] };
  const X = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const FONT = 'font-family="Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif"';
  const nd = (n) => (typeof n === 'string' ? { t: n } : n);

  const svg = (W, H, inner, label) =>
    `<svg class="illus" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;height:auto" role="img" aria-label="${X(label || 'Diagram')}" ${FONT}>${inner}</svg>`;

  const marker = (id) =>
    `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M2 1.5 L8.5 5 L2 8.5" fill="none" stroke="#0d0d0d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;

  const box = (x, y, w, h, n) => {
    const [f, s] = COLORS[n.c || ''];
    const cx = x + w / 2, cy = y + h / 2;
    let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
    if (n.s) {
      o += `<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="13.5" font-weight="600" fill="#0d0d0d">${X(n.t)}</text>`;
      o += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="11" fill="#6b6b6b">${X(n.s)}</text>`;
    } else {
      o += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13.5" font-weight="600" fill="#0d0d0d">${X(n.t)}</text>`;
    }
    return o;
  };

  const line = (x1, y1, x2, y2, id, o = {}) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.blocked ? '#b8741a' : '#0d0d0d'}" stroke-width="1.6" ${o.blocked ? 'stroke-dasharray="4 4"' : ''} marker-end="url(#${id})" ${o.bidir ? `marker-start="url(#${id})"` : ''}/>`;

  const cross = (x, y) =>
    `<circle cx="${x}" cy="${y}" r="9" fill="#fbf0db" stroke="#b8741a" stroke-width="1.5"/><path d="M${x - 3.5} ${y - 3.5} l7 7 M${x + 3.5} ${y - 3.5} l-7 7" stroke="#b8741a" stroke-width="1.8" stroke-linecap="round"/>`;

  /* A row (or column) of boxes joined by arrows.
     opts: dir 'v' for vertical, bidir for two-way arrows, blocked [edge indexes] for a "not allowed" link. */
  function flow(items, o = {}) {
    const id = 'ar' + ++uid;
    const nodes = items.map(nd);
    const v = o.dir === 'v';
    const hasSub = nodes.some((n) => n.s);
    const w = o.w || (v ? 230 : 112), h = hasSub ? 60 : 46, gap = o.gap || (v ? 34 : 40), pad = 8, n = nodes.length;
    const W = v ? w + pad * 2 : n * w + (n - 1) * gap + pad * 2;
    const H = v ? n * h + (n - 1) * gap + pad * 2 : h + pad * 2;
    let out = marker(id);
    nodes.forEach((node, i) => {
      const x = v ? pad : pad + i * (w + gap), y = v ? pad + i * (h + gap) : pad;
      out += box(x, y, w, h, node);
      if (i < n - 1) {
        const blocked = (o.blocked || []).includes(i);
        const e = { blocked, bidir: o.bidir && !blocked };
        if (v) {
          const cx = x + w / 2;
          out += line(cx, y + h + 3, cx, y + h + gap - 3, id, e);
          if (blocked) out += cross(cx, y + h + gap / 2);
        } else {
          const cy = y + h / 2;
          out += line(x + w + 3, cy, x + w + gap - 3, cy, id, e);
          if (blocked) out += cross(x + w + gap / 2, cy);
        }
      }
    });
    return svg(W, H, out, o.label || nodes.map((x) => x.t).join(' to '));
  }

  /* Two boxes with a request arrow going right and a response arrow coming back. */
  function duplex(left, right, req, res) {
    const id = 'ar' + ++uid;
    const L = nd(left), R = nd(right);
    let out = marker(id);
    out += box(8, 12, 120, 96, L) + box(392, 12, 120, 96, R);
    out += `<text x="260" y="40" text-anchor="middle" font-size="12" font-weight="500" fill="#0d0d0d">${X(req)}</text>`;
    out += line(136, 48, 384, 48, id);
    out += `<text x="260" y="82" text-anchor="middle" font-size="12" font-weight="500" fill="#1e7a4c">${X(res)}</text>`;
    out += `<line x1="384" y1="90" x2="136" y2="90" stroke="#1e7a4c" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#${id})"/>`;
    return svg(520, 120, out, `${req} and ${res}`);
  }

  /* Several clients feeding one API. */
  function fanIn() {
    const id = 'ar' + ++uid;
    let out = marker(id);
    const clients = ['Web app', 'Mobile app', 'Admin panel'];
    clients.forEach((c, i) => {
      out += box(8, 8 + i * 56, 116, 42, { t: c });
      out += line(128, 29 + i * 56, 196, 78 + 0, id);
    });
    out += box(200, 56, 92, 44, { t: 'API', c: 'green' });
    out += line(296, 78, 340, 78, id);
    out += box(344, 56, 108, 44, { t: 'Backend', c: 'amber' });
    out += line(456, 78, 500, 78, id);
    out += box(504, 56, 108, 44, { t: 'Database', c: 'gray' });
    return svg(620, 164, out, 'Web app, mobile app and admin panel all use one API');
  }

  /* IP address as a building, ports as doors. */
  function ports() {
    let out = `<rect x="10" y="8" width="400" height="152" rx="16" fill="#f3f3f1" stroke="#0d0d0d" stroke-width="1.5"/>`;
    out += `<text x="210" y="38" text-anchor="middle" font-size="14" font-weight="600" fill="#0d0d0d">One machine (one IP address)</text>`;
    out += `<text x="210" y="56" text-anchor="middle" font-size="11" fill="#6b6b6b">IP address = which building?</text>`;
    [['80', 'HTTP', 50], ['443', 'HTTPS', 165], ['22', 'SSH', 280]].forEach(([p, l, x], i) => {
      const [f, s] = COLORS[['green', 'green', 'amber'][i]];
      out += `<rect x="${x}" y="78" width="90" height="70" rx="10" fill="${f}" stroke="${s}" stroke-width="1.5"/>`;
      out += `<text x="${x + 45}" y="108" text-anchor="middle" font-size="18" font-weight="600" fill="#0d0d0d">${p}</text>`;
      out += `<text x="${x + 45}" y="128" text-anchor="middle" font-size="11" fill="#6b6b6b">${l}</text>`;
    });
    return svg(420, 168, out, 'An IP address is a building, ports are doors to different services');
  }

  /* Big O growth curves */
  function growth() {
    const x0 = 44, x1 = 400, y0 = 214, top = 24, ph = y0 - top;
    const path = (f) => { let d = ''; for (let i = 0; i <= 40; i++) { const t = i / 40; d += (i ? 'L' : 'M') + (x0 + (x1 - x0) * t).toFixed(1) + ' ' + (y0 - ph * f(t)).toFixed(1); } return d; };
    const curves = [
      ['O(n²)', (t) => t * t, '#0d0d0d'],
      ['O(n)', (t) => 0.62 * t, '#b8741a'],
      ['O(log n)', (t) => (Math.log(1 + 9 * t) / Math.log(10)) * 0.4, '#6b6b6b'],
      ['O(1)', () => 0.06, '#1e7a4c'],
    ];
    let out = `<path d="M${x0} ${top - 8} V${y0} H${x1 + 14}" fill="none" stroke="#9b9b9b" stroke-width="1.5" stroke-linecap="round"/>`;
    out += `<text x="${x0 + 8}" y="14" font-size="11" fill="#6b6b6b">Time</text><text x="${x1}" y="${y0 + 22}" text-anchor="end" font-size="11" fill="#6b6b6b">Input size</text>`;
    curves.forEach(([label, f, c]) => {
      out += `<path d="${path(f)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
      out += `<text x="${x1 + 10}" y="${(y0 - ph * f(1) + 4).toFixed(1)}" font-size="12" font-weight="600" fill="${c}">${label}</text>`;
    });
    return svg(500, 240, out, 'Growth of O(1), O(log n), O(n) and O(n squared)');
  }

  /* Vertical "one final mental picture" of a whole system. */
  function architecture() {
    const id = 'ar' + ++uid;
    let o = marker(id);
    const down = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#0d0d0d" stroke-width="1.6" marker-end="url(#${id})"/>`;
    const N = (x, y, w, h, t, s, c) => box(x, y, w, h, { t, s, c });
    // main spine
    o += N(205, 8, 230, 52, 'USER', 'Opens a website or app', 'green');
    o += down(320, 62, 86);
    o += N(205, 88, 230, 52, 'BROWSER', 'Sends requests, shows the page', 'green');
    o += down(320, 142, 166);
    o += N(205, 168, 230, 52, 'DNS + INTERNET', "Finds the server's address");
    o += down(320, 222, 246);
    o += N(205, 248, 230, 52, 'CDN / LOAD BALANCER', 'Fast static files, spreads traffic');
    o += down(320, 302, 326);
    // backend
    o += `<rect x="140" y="328" width="360" height="150" rx="14" fill="#fbf0db" stroke="#b8741a" stroke-width="1.5"/>`;
    o += `<text x="320" y="354" text-anchor="middle" font-size="14" font-weight="600" fill="#0d0d0d">BACKEND</text>`;
    o += `<text x="320" y="371" text-anchor="middle" font-size="11" fill="#6b6b6b">Where the application logic lives</text>`;
    [['API', 152, 384], ['Auth', 332, 384], ['Business Logic', 152, 428], ['Validation', 332, 428]].forEach(([t, x, y]) => {
      o += `<rect x="${x}" y="${y}" width="156" height="34" rx="9" fill="#fff" stroke="#b8741a" stroke-width="1.2"/><text x="${x + 78}" y="${y + 21}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0d0d0d">${t}</text>`;
    });
    // branch to three
    o += `<path d="M320 478 V504 M120 504 H520" fill="none" stroke="#0d0d0d" stroke-width="1.6"/>`;
    [120, 320, 520].forEach((x) => { o += down(x, 504, 530); });
    o += N(35, 532, 170, 54, 'DATABASE', 'Permanent data', 'gray') + N(235, 532, 170, 54, 'CACHE', 'Fast temporary data', 'gray') + N(435, 532, 170, 54, 'QUEUE', 'Jobs waiting in line', 'gray');
    [120, 320, 520].forEach((x) => { o += down(x, 588, 612); });
    o += N(35, 614, 170, 54, 'STORAGE', 'Files and disks', 'gray') + N(235, 614, 170, 54, 'REDIS', 'In-memory store', 'gray') + N(435, 614, 170, 54, 'WORKER', 'Runs background jobs', 'amber');
    // external services
    o += down(520, 670, 698);
    o += N(310, 700, 320, 54, 'EXTERNAL SERVICES', "Other companies' APIs", 'green');
    o += down(470, 756, 780);
    o += `<rect x="310" y="782" width="320" height="86" rx="12" fill="#fff" stroke="#0d0d0d" stroke-width="1.5"/>`;
    [['AI', 320, 794], ['Payments', 422, 794], ['Email', 524, 794], ['SMS', 320, 832], ['Other APIs', 422, 832]].forEach(([t, x, y]) => {
      o += `<rect x="${x}" y="${y}" width="96" height="30" rx="8" fill="#f3f3f1" stroke="#c9c9c6"/><text x="${x + 48}" y="${y + 19}" text-anchor="middle" font-size="12" font-weight="500" fill="#0d0d0d">${t}</text>`;
    });
    // response path
    o += `<path d="M140 404 H44 V34 H199" fill="none" stroke="#1e7a4c" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#${id})"/>`;
    o += `<text transform="translate(60 220) rotate(-90)" text-anchor="middle" font-size="11.5" font-weight="500" fill="#1e7a4c">Response travels back up</text>`;
    return svg(640, 880, o, 'Mental map of a web system: user, browser, DNS, CDN, backend, database, cache, queue, worker and external services');
  }

  const wrap = (inner, caption) => `<figure class="figure">${inner}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  const group = (rows) => `<div class="figure">${rows.map(([label, s]) => `<div class="fig-item"><div class="fig-label">${label}</div>${s}</div>`).join('')}</div>`;

  window.Learn.fig = { flow, duplex, fanIn, ports, growth, architecture, wrap, group };
})();
