/* SQL module, sub-module 4: Joins and relationships (Level 2).
   Wide, sectioned layout: jump menu, practice data, then one section per topic made of cards
   (explanation + SQL on one side, result on the other). Uses its own practice data, shown at the top. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'sql');
  if (!mod) return;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const NULLC = '<span class="tv-null">NULL</span>';
  const INK = '#0d0d0d';

  /* ---------- building blocks ---------- */
  /* Table. A row is an array of cells, or {r: [cells], cls: 'hl' | 'ok'} to tint it. */
  const tv = (name, cols, rows) =>
    `<div class="tv"><div class="tv-head">${name}<small>${rows.length} row${rows.length === 1 ? '' : 's'}</small></div><div class="tv-scroll"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>` +
    rows.map((r) => (Array.isArray(r) ? `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>` : `<tr class="${r.cls}">${r.r.map((c) => `<td>${c}</td>`).join('')}</tr>`)).join('') +
    `</tbody></table></div></div>`;
  const hl = (...r) => ({ r, cls: 'hl' });          // amber row: came from an unmatched record
  const res = (cols, rows) => tv('result', cols, rows);
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  const card = (title, sub, body, cls = '') => `<div class="jcard ${cls}"><h4>${title}</h4>${sub ? `<p class="jsub">${sub}</p>` : ''}${body}</div>`;
  const cols = (n, ...items) => `<div class="jgrid j${n}">${items.join('')}</div>`;
  const sec = (id, n, title, sub, body) =>
    `<section class="jsec" id="${id}"><div class="jhead"><span class="jnum">${n}</span><div><h3>${title}</h3><p>${sub}</p></div></div>${body}</section>`;
  const callout = (title, t, tone = 'amber') => `<div class="callout ${tone}"><div class="callout-title">${title}</div>${p(t)}</div>`;

  /* Venn diagram: which part of tables A and B a join keeps. mode: inner | left | right | anti */
  let vid = 0;
  const venn = (mode, a, b) => {
    const id = 'vn' + ++vid, G = '#bfe0cf';
    const A = '<circle cx="70" cy="50" r="38"', B = '<circle cx="120" cy="50" r="38"';
    const fill =
      mode === 'inner' ? `${B} fill="${G}" clip-path="url(#${id})"/>` :
      mode === 'left' ? `${A} fill="${G}"/>` :
      mode === 'right' ? `${B} fill="${G}"/>` :
      `${A} fill="${G}"/>${B} fill="#fff" clip-path="url(#${id})"/>`;
    return `<svg class="venn" viewBox="0 0 190 100" role="img" aria-label="${mode} join" font-family="Inter, system-ui, Arial, sans-serif">` +
      `<defs><clipPath id="${id}">${A}/></clipPath></defs>${fill}` +
      `${A} fill="none" stroke="${INK}" stroke-width="1.6"/>${B} fill="none" stroke="${INK}" stroke-width="1.6"/>` +
      `<text x="52" y="54" text-anchor="middle" font-size="10" font-weight="600" fill="${INK}">${a}</text>` +
      `<text x="138" y="54" text-anchor="middle" font-size="10" font-weight="600" fill="${INK}">${b}</text></svg>`;
  };

  /* Small relationship diagram with ERD end symbols. spec: [leftName, leftEnd, rightName, rightEnd] or 3 boxes. */
  const relSvg = (boxes, links) => {
    const w = 400, y = 20, h = 40, mid = y + h / 2;
    const bx = ([name, x, bw]) =>
      `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="8" fill="#fff" stroke="${INK}" stroke-width="1.7"/>` +
      `<text x="${x + bw / 2}" y="${mid + 5}" text-anchor="middle" font-size="14" font-weight="700" font-family="ui-monospace, Consolas, monospace" fill="${INK}">${name}</text>`;
    const sym = (px, dx, kind) => kind === 'one'
      ? `<line x1="${px + dx * 14}" y1="${mid - 9}" x2="${px + dx * 14}" y2="${mid + 9}" stroke="${INK}" stroke-width="1.7"/>`
      : `<line x1="${px + dx * 16}" y1="${mid}" x2="${px}" y2="${mid - 9}" stroke="${INK}" stroke-width="1.7"/><line x1="${px + dx * 16}" y1="${mid}" x2="${px}" y2="${mid + 9}" stroke="${INK}" stroke-width="1.7"/>`;
    const ln = ([x1, k1, x2, k2]) =>
      `<line x1="${x1}" y1="${mid}" x2="${x2}" y2="${mid}" stroke="${INK}" stroke-width="1.7"/>${sym(x1, 1, k1)}${sym(x2, -1, k2)}`;
    return `<svg class="relsvg" viewBox="0 0 ${w} 80" role="img" aria-label="relationship diagram">${links.map(ln).join('')}${boxes.map(bx).join('')}</svg>`;
  };

  /* Matching picture for the basics: posts rows on the left, users rows on the right, a line per match. */
  const matchSvg = (() => {
    const RH = 30, HH = 30, LX = 10, LW = 215, RX = 365, RW = 200, H = HH + 5 * RH + 4, FONT = 'Inter, system-ui, Arial, sans-serif';
    const posts = [['101', '1'], ['102', '2'], ['103', '1'], ['104', '3'], ['105', null]];
    const users = [['1', 'shekar'], ['2', 'asha'], ['3', 'ravi'], ['4', 'meena'], ['5', 'kiran']];
    const rowBg = (x, w, i, bad) => `<rect x="${x}" y="${HH + i * RH}" width="${w}" height="${RH}" fill="${bad ? '#fbf0db' : '#fff'}" stroke="#ececea"/>`;
    const head = (x, w, t, c1, c2) =>
      `<rect x="${x}" y="0" width="${w}" height="${HH}" rx="0" fill="#111"/><text x="${x + 12}" y="19" font-size="13" font-weight="600" fill="#fff" font-family="ui-monospace, Consolas, monospace">${t}</text>`;
    let o = '';
    posts.forEach(([id, uid], i) => {
      o += rowBg(LX, LW, i, uid === null);
      o += `<text x="${LX + 14}" y="${HH + i * RH + 20}" font-size="13" fill="${INK}"><tspan font-weight="600">post ${id}</tspan><tspan fill="#6b6b6b">   user_id = </tspan>${uid === null ? '<tspan font-style="italic" fill="#9b9b9b">NULL</tspan>' : `<tspan font-weight="600">${uid}</tspan>`}</text>`;
    });
    users.forEach(([id, name], i) => {
      const bad = !posts.some((r) => r[1] === id);
      o += rowBg(RX, RW, i, bad);
      o += `<text x="${RX + 14}" y="${HH + i * RH + 20}" font-size="13" fill="${INK}"><tspan fill="#6b6b6b">user_id = </tspan><tspan font-weight="600">${id}</tspan><tspan fill="#6b6b6b">   </tspan>${name}</text>`;
    });
    posts.forEach(([, uid], i) => {
      if (uid === null) return;
      const y1 = HH + i * RH + RH / 2, y2 = HH + (Number(uid) - 1) * RH + RH / 2, x1 = LX + LW, x2 = RX;
      o += `<path d="M${x1} ${y1} C${x1 + 60} ${y1} ${x2 - 60} ${y2} ${x2} ${y2}" fill="none" stroke="#1e7a4c" stroke-width="2"/><circle cx="${x1}" cy="${y1}" r="4" fill="#1e7a4c"/><circle cx="${x2}" cy="${y2}" r="4" fill="#1e7a4c"/>`;
    });
    o += head(LX, LW, 'posts') + head(RX, RW, 'users');
    o += `<text x="${(x1c => x1c)((LX + LW + RX) / 2)}" y="${H + 16}" text-anchor="middle" font-size="12" fill="#6b6b6b">posts.user_id = users.user_id</text>`;
    return `<svg class="matchsvg" viewBox="0 0 580 ${H + 24}" role="img" aria-label="Rows of posts matched to rows of users" font-family="${FONT}">${o}</svg>`;
  })();

  /* ---------- practice data ---------- */
  const tUsers = () => tv('users', ['user_id', 'username', 'invited_by'], [['1', 'shekar', NULLC], ['2', 'asha', '1'], ['3', 'ravi', '1'], ['4', 'meena', '2'], ['5', 'kiran', NULLC]]);
  const tPosts = () => tv('posts', ['post_id', 'user_id', 'caption'], [['101', '1', 'My first SQL table!'], ['102', '2', 'Sunset in Goa'], ['103', '1', 'Day 2: keys'], ['104', '3', 'Biryani time'], ['105', NULLC, 'Anonymous post']]);
  const tLikes = () => tv('likes', ['like_id', 'user_id', 'post_id'], [['1', '2', '101'], ['2', '3', '101'], ['3', '1', '102'], ['4', '2', '103']]);
  const tProfiles = () => tv('profiles', ['profile_id', 'user_id', 'bio'], [['1', '1', 'Learning SQL'], ['2', '2', 'Traveller'], ['3', '3', 'Foodie']]);

  /* ---------- page ---------- */
  const NAV = [['j-basics', 'Basics'], ['j-types', 'INNER · LEFT · RIGHT'], ['j-self', 'Self join'], ['j-multi', '3–4 tables'], ['j-rel', 'Relationships'], ['j-unmatched', 'Unmatched records'], ['j-dupes', 'Duplicate rows'], ['j-cheat', 'Cheat sheet']];
  const nav = `<nav class="jnav" aria-label="On this page">${NAV.map(([id, t]) => `<button class="jchip" data-act="scroll" data-target="${id}">${t}</button>`).join('')}</nav>`;

  const hero =
    `<div class="jhero"><div><span class="jbadge">Level 2</span><h2>Joins and relationships</h2>` +
    p('Data lives in separate tables so nothing is repeated. A <strong>join</strong> puts the pieces back together when you need an answer that spans tables.') +
    `</div><ul class="jlist">` +
    ['INNER, LEFT and RIGHT JOIN', 'Self joins', 'Joining 3–4 tables', 'One-to-one, one-to-many, many-to-many', 'Finding unmatched records', 'Avoiding duplicate rows after joins'].map((t) => `<li>${t}</li>`).join('') +
    `</ul></div>`;

  const data =
    `<div class="jband"><div class="jband-t"><strong>Practice data</strong><span>Same Instagram tables as before. Note the gaps on purpose: meena and kiran have no posts, post 105 has no user, posts 104 and 105 have no likes.</span></div>` +
    `<div class="tv-grid">${tUsers()}${tPosts()}${tLikes()}${tProfiles()}</div></div>`;

  const basics = sec('j-basics', 1, 'How a join works', 'Match a column in one table to a column in another, row by row.',
    cols(2,
      card('The idea', '', p('Each post stores only a <code>user_id</code>, not the username. To show <em>"Sunset in Goa by asha"</em>, the database looks up that <code>user_id</code> in <code>users</code>. That lookup is a join.') +
        code(`SELECT users.username, posts.caption\nFROM users\nINNER JOIN posts\n  ON posts.user_id = users.user_id;`) +
        `<div class="qbox">
          <div class="qrow"><span class="qk">FROM users</span><span class="qb"></span><span class="qn">the first table</span></div>
          <div class="qrow"><span class="qk">JOIN posts</span><span class="qb"></span><span class="qn">the table to attach</span></div>
          <div class="qrow"><span class="qk">ON …</span><span class="qb"></span><span class="qn">how rows match: <strong>foreign key = primary key</strong></span></div>
        </div>` +
        p('When two tables share a column name, write <code>table.column</code> so SQL knows which one you mean.') +
        callout('Forgot the ON?', 'Without an <code>ON</code> condition every row pairs with every row (5 users × 5 posts = 25 rows). Always write it.')),
      card('What the database does', 'Green line = a match. Amber row = no match.', `<div class="jfig">${matchSvg}</div>` +
        `<p class="jsub">INNER JOIN keeps only the matched pairs. LEFT and RIGHT JOIN also keep the amber rows from one side, with NULL for the missing half.</p>`)
    ));

  const types = sec('j-types', 2, 'INNER, LEFT and RIGHT JOIN', 'Same tables, same ON. The only difference is what happens to rows with no match.',
    cols(3,
      card('INNER JOIN', 'Only rows that match on both sides.', venn('inner', 'users', 'posts') +
        code(`SELECT users.username, posts.caption\nFROM users\nINNER JOIN posts\n  ON posts.user_id = users.user_id;`) +
        res(['username', 'caption'], [['shekar', 'My first SQL table!'], ['asha', 'Sunset in Goa'], ['shekar', 'Day 2: keys'], ['ravi', 'Biryani time']]) +
        `<p class="jnote">Lost: meena and kiran (no posts) and post 105 (no user). <code>JOIN</code> alone means INNER JOIN.</p>`),
      card('LEFT JOIN', 'Every row from the left table, matched or not.', venn('left', 'users', 'posts') +
        code(`SELECT users.username, posts.caption\nFROM users\nLEFT JOIN posts\n  ON posts.user_id = users.user_id;`) +
        res(['username', 'caption'], [['shekar', 'My first SQL table!'], ['shekar', 'Day 2: keys'], ['asha', 'Sunset in Goa'], ['ravi', 'Biryani time'], hl('meena', NULLC), hl('kiran', NULLC)]) +
        `<p class="jnote">Every user is kept. Where no post matches, the post columns are NULL. This is the most used outer join.</p>`),
      card('RIGHT JOIN', 'Every row from the right table, matched or not.', venn('right', 'users', 'posts') +
        code(`SELECT users.username, posts.caption\nFROM users\nRIGHT JOIN posts\n  ON posts.user_id = users.user_id;`) +
        res(['username', 'caption'], [['shekar', 'My first SQL table!'], ['asha', 'Sunset in Goa'], ['shekar', 'Day 2: keys'], ['ravi', 'Biryani time'], hl(NULLC, 'Anonymous post')]) +
        `<p class="jnote">Every post is kept, even the one with no user. A RIGHT JOIN is a LEFT JOIN with the tables swapped, so many people only use LEFT.</p>`)
    ) +
    callout('Remember', '"Left" and "right" mean the table written <strong>before</strong> and <strong>after</strong> the word JOIN. Rows can come back in any order unless you add <code>ORDER BY</code>.'));

  const self = sec('j-self', 3, 'Self join', 'A table joined to itself, to compare one row with another row of the same table.',
    cols(2,
      card('Who invited whom?', '<code>users.invited_by</code> holds the <code>user_id</code> of the person who invited you. Both sides live in the same table.',
        `<div class="jfig">${relSvg([['users AS u', 5, 150], ['users AS inv', 245, 150]], [[155, 'many', 245, 'one']])}</div>` +
        code(`SELECT u.username AS username,\n       inv.username AS invited_by\nFROM users AS u\nLEFT JOIN users AS inv\n  ON u.invited_by = inv.user_id;`) +
        p('Use the table <strong>twice with two different aliases</strong> (<code>u</code> and <code>inv</code>). Think of them as two copies: <code>u</code> is the person, <code>inv</code> is their inviter. Aliases are required here, otherwise SQL cannot tell the copies apart.')),
      card('Result', 'LEFT JOIN keeps people nobody invited.', res(['username', 'invited_by'], [['shekar', NULLC], ['asha', 'shekar'], ['ravi', 'shekar'], ['meena', 'asha'], ['kiran', NULLC]]) +
        `<p class="jnote">shekar and kiran joined on their own, so <code>invited_by</code> is NULL and no inviter matches. With an INNER JOIN they would disappear.</p>` +
        `<p class="jnote">Other self-join uses: employee and manager, a category and its parent category, two rows of the same table that share a value.</p>`)
    ));

  const multi = sec('j-multi', 4, 'Joining 3–4 tables', 'Add one JOIN per table. Each ON links the new table to one that is already in the query.',
    cols(2,
      card('Who liked whose post?', 'Needs <code>likes</code>, <code>users</code> (the liker), <code>posts</code>, and <code>users</code> again (the author).',
        code(`SELECT liker.username  AS liker,\n       p.caption,\n       author.username AS author\nFROM likes AS l\nJOIN users AS liker\n  ON liker.user_id = l.user_id\nJOIN posts AS p\n  ON p.post_id = l.post_id\nJOIN users AS author\n  ON author.user_id = p.user_id;`) +
        `<ol class="tv-steps">
          <li>Start with the table that holds the facts: <code>likes</code>.</li>
          <li>Add <code>users AS liker</code> through <code>l.user_id</code>.</li>
          <li>Add <code>posts</code> through <code>l.post_id</code>.</li>
          <li>Add <code>users AS author</code> through <code>p.user_id</code>. Same table, second alias.</li>
        </ol>`),
      card('Result', '', res(['liker', 'caption', 'author'], [['asha', 'My first SQL table!', 'shekar'], ['ravi', 'My first SQL table!', 'shekar'], ['shekar', 'Sunset in Goa', 'asha'], ['asha', 'Day 2: keys', 'shekar']]) +
        `<p class="jnote">Each like row is looked up three times. Four likes, four result rows.</p>` +
        callout('Tips for bigger joins', 'Build it one JOIN at a time and run it after each step. Give every table a short alias. Choose LEFT JOIN for any table whose rows might be missing, otherwise an INNER JOIN silently drops rows.', 'green'))
    ));

  const rel = sec('j-rel', 5, 'One-to-one, one-to-many, many-to-many', 'The relationship decides where the foreign key goes.',
    cols(3,
      card('One-to-one', 'One user has one profile.', `<div class="jfig">${relSvg([['users', 5, 125], ['profiles', 270, 125]], [[130, 'one', 270, 'one']])}</div>` +
        p('<code>profiles.user_id</code> is a foreign key and also <strong>UNIQUE</strong>, so a user can only have one profile.') +
        code(`SELECT u.username, pr.bio\nFROM users u\nLEFT JOIN profiles pr\n  ON pr.user_id = u.user_id;`) +
        `<p class="jnote">Result: one row per user. meena and kiran get a NULL bio.</p>`),
      card('One-to-many', 'One user writes many posts.', `<div class="jfig">${relSvg([['users', 5, 125], ['posts', 270, 125]], [[130, 'one', 270, 'many']])}</div>` +
        p('The foreign key goes on the <strong>many</strong> side: <code>posts.user_id</code>. The most common relationship.') +
        code(`SELECT u.username, p.caption\nFROM users u\nJOIN posts p\n  ON p.user_id = u.user_id;`) +
        `<p class="jnote">Result: shekar appears twice, once per post. The "one" side repeats.</p>`),
      card('Many-to-many', 'A user likes many posts, a post is liked by many users.', `<div class="jfig">${relSvg([['users', 5, 95], ['likes', 150, 100], ['posts', 300, 95]], [[100, 'one', 150, 'many'], [250, 'many', 300, 'one']])}</div>` +
        p('Two tables cannot hold this directly, so add a <strong>junction table</strong> (<code>likes</code>) with two foreign keys.') +
        code(`SELECT u.username, p.caption\nFROM likes l\nJOIN users u ON u.user_id = l.user_id\nJOIN posts p ON p.post_id = l.post_id;`) +
        `<p class="jnote">You always join <em>through</em> the junction table.</p>`)
    ));

  const unmatched = sec('j-unmatched', 6, 'Finding unmatched records', 'LEFT JOIN, then keep only the rows where the right side is NULL.',
    cols(2,
      card('Users who have never posted', '', venn('anti', 'users', 'posts') +
        code(`SELECT users.username\nFROM users\nLEFT JOIN posts\n  ON posts.user_id = users.user_id\nWHERE posts.post_id IS NULL;`) +
        res(['username'], [['meena'], ['kiran']])),
      card('Posts nobody has liked', '', venn('anti', 'posts', 'likes') +
        code(`SELECT p.post_id, p.caption\nFROM posts p\nLEFT JOIN likes l\n  ON l.post_id = p.post_id\nWHERE l.like_id IS NULL;`) +
        res(['post_id', 'caption'], [['104', 'Biryani time'], ['105', 'Anonymous post']]))
    ) +
    cols(2,
      card('Why it works', '', p('After a LEFT JOIN, a left row with no match gets NULL in every right-side column. Filtering <code>WHERE right.key IS NULL</code> keeps exactly those rows. This pattern is called an <strong>anti-join</strong>.') +
        callout('Test the key, not any column', 'Check the right table\'s <strong>primary key</strong>. It can never be NULL in a real row, so NULL can only mean "no match". A nullable column could be NULL for a matched row too.')),
      card('Other ways to write it', '', code(`SELECT username FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM posts p\n  WHERE p.user_id = u.user_id\n);`) +
        p('<code>NOT EXISTS</code> gives the same answer. Avoid <code>NOT IN (subquery)</code>: if the subquery returns even one NULL (like post 105\'s <code>user_id</code>), it returns <strong>no rows at all</strong>.'))
    ));

  const dupes = sec('j-dupes', 7, 'Avoiding duplicate rows after joins', 'A one-to-many join repeats the "one" side once for every matching "many" row.',
    cols(2,
      card('Why it happens', 'shekar has 2 posts, so he appears twice.',
        res(['username', 'caption'], [{ r: ['shekar', 'My first SQL table!'], cls: 'hl' }, ['asha', 'Sunset in Goa'], { r: ['shekar', 'Day 2: keys'], cls: 'hl' }, ['ravi', 'Biryani time']]) +
        code(`-- "How many users have posted?"\nSELECT COUNT(*)\nFROM users\nJOIN posts ON posts.user_id = users.user_id;`) +
        res(['COUNT(*)'], [['4']]) +
        `<p class="jnote">Wrong. 4 is the number of <em>joined rows</em>. Only 3 users have posted.</p>`),
      card('Also watch for', '', `<ul class="jbul">
          <li><strong>Joining on a column that is not unique.</strong> If both sides repeat the value (for example joining two tables on <code>city</code>), every pair is produced.</li>
          <li><strong>Forgetting the ON.</strong> Gives every row × every row.</li>
          <li><strong>Joining several one-to-many tables at once.</strong> Posts and likes of one user multiply against each other, so counts and sums come out too big.</li>
        </ul>` + callout('Habit', 'After writing a join, ask: <em>is each join key unique on at least one side?</em> and <em>how many rows should the answer have?</em> If the numbers do not match, rows are being duplicated.', 'green'))
    ) +
    cols(3,
      card('Fix 1: DISTINCT', 'Remove repeated rows from the result.', code(`SELECT DISTINCT users.username\nFROM users\nJOIN posts\n  ON posts.user_id = users.user_id;`) +
        res(['username'], [['shekar'], ['asha'], ['ravi']]) +
        `<p class="jnote">To count: <code>COUNT(DISTINCT users.user_id)</code> gives 3.</p>`),
      card('Fix 2: GROUP BY', 'One row per user, with the many side counted.', code(`SELECT users.username,\n       COUNT(posts.post_id) AS posts\nFROM users\nLEFT JOIN posts\n  ON posts.user_id = users.user_id\nGROUP BY users.user_id, users.username;`) +
        res(['username', 'posts'], [['shekar', '2'], ['asha', '1'], ['ravi', '1'], ['meena', '0'], ['kiran', '0']]) +
        `<p class="jnote">Count a column of the right table (<code>posts.post_id</code>), not <code>*</code>. <code>COUNT(*)</code> would show 1 for meena.</p>`),
      card('Fix 3: EXISTS', 'Do not join at all if you only need to know "has any".', code(`SELECT username\nFROM users u\nWHERE EXISTS (\n  SELECT 1 FROM posts p\n  WHERE p.user_id = u.user_id\n);`) +
        res(['username'], [['shekar'], ['asha'], ['ravi']]) +
        `<p class="jnote">Each user is checked once, so duplicates cannot appear.</p>`)
    ));

  const cheat = sec('j-cheat', 8, 'Cheat sheet', 'Pick the join from the question.',
    `<div class="jcard">${table(['I want…', 'Use'], [
      ['Only rows that match on both sides', '<code>INNER JOIN</code> (or just <code>JOIN</code>)'],
      ['All rows from the first table, plus matches', '<code>LEFT JOIN</code>'],
      ['All rows from the second table, plus matches', '<code>RIGHT JOIN</code> (or swap the tables and use <code>LEFT JOIN</code>)'],
      ['Rows in A that have nothing in B', '<code>A LEFT JOIN B … WHERE B.key IS NULL</code>'],
      ['To compare rows of the same table', 'Self join with two aliases'],
      ['Three or more tables', 'One <code>JOIN … ON …</code> per extra table'],
      ['Many-to-many data', 'Join through the junction table'],
      ['One row per "one" side after a join', '<code>DISTINCT</code>, <code>GROUP BY</code> or <code>EXISTS</code>'],
    ])}</div>`);

  const intro = `<div class="doc jwide">${hero}${nav}${data}${basics}${types}${self}${multi}${rel}${unmatched}${dupes}${cheat}</div>`;

  mod.sections.push({
    id: 'sql-joins',
    title: 'Joins',
    description: 'Level 2: INNER, LEFT and RIGHT joins, self joins, joining 3–4 tables, relationships, unmatched records and duplicate rows.',
    intro,
    qna: [],
    notes: [],
    quiz: [],
  });
})();
