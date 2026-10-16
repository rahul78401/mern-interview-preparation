/* SQL module, sub-module 2: Tables.
   One big ER diagram of a mini Instagram (tables, PK/FK, crow's-foot relationships). Nothing else. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'sql');
  if (!mod) return;

  const W = 230, HEAD = 40, ROW = 34, KEYW = 46;
  const INK = '#0d0d0d', LINE = '#c9c9c4';
  const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif';

  /* Table card: grey title bar, then one row per column with a PK / FK key cell on the left. */
  const table = (x, y, name, cols) => {
    const H = HEAD + cols.length * ROW;
    let o = `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="6" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
    o += `<path d="M${x} ${y + HEAD} V${y + 6} a6 6 0 0 1 6 -6 H${x + W - 6} a6 6 0 0 1 6 6 V${y + HEAD} Z" fill="#efefed" stroke="${INK}" stroke-width="1.8"/>`;
    o += `<text x="${x + W / 2}" y="${y + 26}" text-anchor="middle" font-size="17" font-weight="700" fill="${INK}">${name}</text>`;
    o += `<line x1="${x + KEYW}" y1="${y + HEAD}" x2="${x + KEYW}" y2="${y + H}" stroke="${LINE}" stroke-width="1.4"/>`;
    cols.forEach(([n, k], r) => {
      const ry = y + HEAD + r * ROW;
      if (r) o += `<line x1="${x}" y1="${ry}" x2="${x + W}" y2="${ry}" stroke="#ececea"/>`;
      if (k) o += `<text x="${x + KEYW / 2}" y="${ry + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="${k === 'PK' ? '#85500f' : '#135238'}">${k}</text>`;
      o += `<text x="${x + KEYW + 14}" y="${ry + 22.5}" font-size="15" ${k === 'PK' ? 'font-weight="600"' : ''} fill="${INK}">${n}</text>`;
    });
    return o;
  };
  const rowY = (y, idx) => y + HEAD + idx * ROW + ROW / 2;

  /* Relationship line through the given points, with ERD end symbols.
     First point = the "from" table end, last point = the "to" table end.
     ends: 'one' draws a bar, 'many' draws a crow's foot. */
  const rel = (pts, a, b) => {
    const path = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
    const sym = (p, q, kind) => {
      const dx = Math.sign(q[0] - p[0]), dy = Math.sign(q[1] - p[1]), px = -dy, py = dx;   // dir away from table, and its perpendicular
      if (kind === 'one') {
        const cx = p[0] + dx * 16, cy = p[1] + dy * 16;
        return `<line x1="${cx + px * 9}" y1="${cy + py * 9}" x2="${cx - px * 9}" y2="${cy - py * 9}" stroke="${INK}" stroke-width="1.8"/>`;
      }
      const tx = p[0] + dx * 18, ty = p[1] + dy * 18;
      return `<line x1="${tx}" y1="${ty}" x2="${p[0] + px * 10}" y2="${p[1] + py * 10}" stroke="${INK}" stroke-width="1.8"/>` +
        `<line x1="${tx}" y1="${ty}" x2="${p[0] - px * 10}" y2="${p[1] - py * 10}" stroke="${INK}" stroke-width="1.8"/>`;
    };
    return path + sym(pts[0], pts[1], a) + sym(pts[pts.length - 1], pts[pts.length - 2], b);
  };

  const erd = (() => {
    const Y1 = 30, Y2 = 400;
    const users = [360, Y1], profiles = [40, Y1], comments = [680, Y1], posts = [1000, Y1], follows = [120, Y2], likes = [640, Y2];
    const bottom = Y1 + HEAD + 4 * ROW;   // bottom edge of the top row (all have 4 columns)

    const cards =
      table(...profiles, 'profiles', [['profile_id', 'PK'], ['user_id', 'FK'], ['full_name'], ['bio']]) +
      table(...users, 'users', [['user_id', 'PK'], ['username'], ['email'], ['created_at']]) +
      table(...comments, 'comments', [['comment_id', 'PK'], ['user_id', 'FK'], ['post_id', 'FK'], ['text']]) +
      table(...posts, 'posts', [['post_id', 'PK'], ['user_id', 'FK'], ['caption'], ['created_at']]) +
      table(...follows, 'follows', [['follow_id', 'PK'], ['follower_id', 'FK'], ['following_id', 'FK']]) +
      table(...likes, 'likes', [['like_id', 'PK'], ['user_id', 'FK'], ['post_id', 'FK']]);

    const uid = rowY(Y1, 0);   // y of users.user_id and posts.post_id rows
    const links =
      /* profiles 1 — 1 users */
      rel([[270, rowY(Y1, 1)], [315, rowY(Y1, 1)], [315, uid], [360, uid]], 'one', 'one') +
      /* comments N — 1 users */
      rel([[680, rowY(Y1, 1)], [635, rowY(Y1, 1)], [635, uid], [590, uid]], 'many', 'one') +
      /* comments N — 1 posts */
      rel([[910, rowY(Y1, 2)], [955, rowY(Y1, 2)], [955, uid], [1000, uid]], 'many', 'one') +
      /* posts N — 1 users (goes underneath the comments table) */
      rel([[1115, bottom], [1115, 250], [560, 250], [560, bottom]], 'many', 'one') +
      /* likes N — 1 users */
      rel([[660, Y2], [660, 300], [520, 300], [520, bottom]], 'many', 'one') +
      /* likes N — 1 posts */
      rel([[840, Y2], [840, 330], [1160, 330], [1160, bottom]], 'many', 'one') +
      /* follows N — 1 users (follower) */
      rel([[170, Y2], [170, 300], [385, 300], [385, bottom]], 'many', 'one') +
      /* follows N — 1 users (following) */
      rel([[250, Y2], [250, 330], [425, 330], [425, bottom]], 'many', 'one');

    return `<svg class="illus erd" viewBox="0 0 1280 560" width="1280" style="max-width:100%;height:auto" role="img" aria-label="ER diagram of a mini Instagram: users, profiles, posts, comments, likes and follows" font-family="${FONT}">${links}${cards}</svg>`;
  })();

  const legend =
    `<p class="erd-legend"><b>PK</b> primary key &nbsp;·&nbsp; <b>FK</b> foreign key &nbsp;·&nbsp; ` +
    `<svg width="30" height="14" viewBox="0 0 30 14" aria-hidden="true"><line x1="0" y1="7" x2="30" y2="7" stroke="#0d0d0d" stroke-width="1.8"/><line x1="15" y1="1" x2="15" y2="13" stroke="#0d0d0d" stroke-width="1.8"/></svg> one &nbsp;·&nbsp; ` +
    `<svg width="30" height="14" viewBox="0 0 30 14" aria-hidden="true"><line x1="0" y1="7" x2="30" y2="7" stroke="#0d0d0d" stroke-width="1.8"/><line x1="12" y1="7" x2="30" y2="1" stroke="#0d0d0d" stroke-width="1.8"/><line x1="12" y1="7" x2="30" y2="13" stroke="#0d0d0d" stroke-width="1.8"/></svg> many</p>`;

  /* ---- Keys, explained against the diagram above ---- */
  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const inDiagram = (t) => `<div class="callout green"><div class="callout-title">In the diagram</div>${p(t)}</div>`;
  const interview = (q, a) => `<div class="callout amber"><div class="callout-title">Interview question</div>${p(`<strong>${q}</strong>`)}${p(a)}</div>`;
  const row = (r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`;

  const keys =
    `<h3>Keys you must know</h3>` +
    p('Keys are how tables identify their rows and point at each other. Every example below uses the diagram above. Scroll up and find the table as you read.') +
    `<table><thead><tr><th>Key</th><th>One-line meaning</th><th>Example from the diagram</th></tr></thead><tbody>` +
    [
      ['Primary key', 'Uniquely identifies each row. No duplicates, no NULL.', '<code>users.user_id</code>'],
      ['Foreign key', 'Points at a row in another table.', '<code>posts.user_id</code> → <code>users.user_id</code>'],
      ['Super key', 'Any column set that identifies a row, extra columns allowed.', '<code>(user_id, username)</code>'],
      ['Candidate key', 'A minimal super key. Nothing can be removed.', '<code>user_id</code>, <code>email</code>'],
      ['Alternate key', 'A candidate key you did not pick as the primary key.', '<code>email</code>'],
      ['Composite key', 'A key made of two or more columns together.', '<code>(user_id, post_id)</code> in <code>likes</code>'],
      ['Unique key', 'A constraint that blocks duplicate values.', '<code>UNIQUE(email)</code>'],
    ].map(row).join('') + `</tbody></table>` +

    `<h3>1. Primary key (PK)</h3>` +
    p('Uniquely identifies every row in a table. It cannot repeat and cannot be NULL.') +
    inDiagram('Every table has a <strong>PK</strong> cell: <code>user_id</code> in <code>users</code>, <code>post_id</code> in <code>posts</code>, <code>like_id</code> in <code>likes</code>. Two users can never share a <code>user_id</code>.') +
    interview('Can a table have two primary keys?', 'No. A table has only one primary key <em>constraint</em>, but that one key can be made of several columns (a composite primary key).') +

    `<h3>2. Foreign key (FK)</h3>` +
    p('Connects one table to another by referring to the primary key (or another unique key) of that table.') +
    inDiagram('Every line in the diagram is a foreign key. <code>posts.user_id</code> holds a <code>users.user_id</code>, so each post knows who wrote it. The crow\'s foot sits on the FK side (many posts) and the bar on the PK side (one user).') +
    interview('Can a foreign key contain duplicate values?', 'Yes. One user can write many posts, so the same <code>user_id</code> appears on many rows of <code>posts</code>. A foreign key can also be NULL if the column allows it, which means "not linked to anything".') +

    `<h3>3. Candidate key</h3>` +
    p('Any column, or combination of columns, that could identify a row and has nothing extra in it. Every candidate key is unique and not NULL.') +
    inDiagram('In <code>users</code>, both <code>user_id</code> and <code>email</code> could identify a person, so both are candidate keys (assuming no two people share an email and none is empty).') +
    interview('Candidate key vs primary key?', 'Candidate keys are all the possible unique identifiers. The primary key is the one you choose from them.') +

    `<h3>4. Super key</h3>` +
    p('Any set of columns that uniquely identifies a row, even if it carries unnecessary extra columns.') +
    inDiagram('<code>user_id</code> is a super key, and so is <code>(user_id, username)</code>, because <code>user_id</code> alone is already enough. The second one has a useless extra column.') +
    p('<strong>Difference:</strong> a candidate key is a <em>minimal</em> super key. You cannot remove a column from it without losing uniqueness.') +

    `<h3>5. Composite key</h3>` +
    p('A key built from two or more columns together. Each column on its own may repeat, but the pair must not.') +
    inDiagram('<code>likes</code> uses <code>like_id</code> as its PK, but a common alternative is <code>(user_id, post_id)</code> as a composite key. Asha can like many posts and a post can have many likes, but Asha can like post 101 only once. <code>follows</code> works the same way with <code>(follower_id, following_id)</code>.') +

    `<h3>6. Alternate key</h3>` +
    p('A candidate key that was not chosen as the primary key.') +
    inDiagram('<code>user_id</code> is the PK of <code>users</code>, so <code>email</code> (also a candidate key) is the alternate key.') +

    `<h3>7. Unique key</h3>` +
    p('A constraint that prevents duplicate values in a column or a group of columns.') +
    inDiagram('<code>UNIQUE(email)</code> on <code>users</code> stops two accounts using the same email, even though <code>email</code> is not the primary key.') +
    interview('Primary key vs unique key?', 'A table has one primary key, and it cannot be NULL. A table can have many unique keys. How NULL is handled in a unique column depends on the database: PostgreSQL allows several NULLs, SQL Server allows only one.');

  mod.sections.push({
    id: 'sql-tables',
    title: 'Tables',
    description: 'ER diagram of a mini Instagram: tables, primary keys, foreign keys and how they connect.',
    intro: `<div class="doc"><div class="board erd-board">${erd}</div>${legend}${keys}</div>`,
    qna: [],
    notes: [],
    quiz: [],
  });
})();
