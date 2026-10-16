/* SQL module, sub-module 6: Indexing and Performance (Level 4).
   Keys and indexes, B-trees, composite indexes, scans, EXPLAIN, slow queries, pagination, N+1. */
(() => {
  const K = Learn.sqlKit;
  if (!K) return;
  const { p, code, tv, res, table, card, cols, sec, callout, note, nav, hero, band, page, ok } = K;
  const INK = '#0d0d0d';

  /* ---------- visuals ---------- */
  /* Grid of table "pages". `hits` = indexes the database actually reads. */
  const pagesSvg = (hits, all) => {
    const C = 12, R = 4, S = 26, G = 6;
    let o = '';
    for (let i = 0; i < C * R; i++) {
      const x = (i % C) * (S + G) + 2, y = Math.floor(i / C) * (S + G) + 2, hit = all || hits.includes(i);
      o += `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="5" fill="${hit ? (all ? '#cfe7da' : '#1e7a4c') : '#f3f3f1'}" stroke="${hit ? '#1e7a4c' : '#dcdcd8'}" stroke-width="1.4"/>`;
    }
    return `<svg viewBox="0 0 ${C * (S + G)} ${R * (S + G)}" style="width:100%;max-width:400px;height:auto" role="img" aria-label="${all ? 'Every page of the table is read' : 'Only a few pages are read'}">${o}</svg>`;
  };

  /* Small B-tree: root -> three leaf nodes -> table rows. Searching for 60 is highlighted. */
  const btreeSvg = (() => {
    const box = (x, y, w, h, t, hot, mono = true) =>
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${hot ? '#e7f3ec' : '#fff'}" stroke="${hot ? '#1e7a4c' : INK}" stroke-width="${hot ? 2.2 : 1.5}"/>` +
      `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="13" font-weight="600" fill="${INK}" ${mono ? 'font-family="ui-monospace, Consolas, monospace"' : ''}>${t}</text>`;
    const ln = (x1, y1, x2, y2, hot) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${hot ? '#1e7a4c' : '#9b9b9b'}" stroke-width="${hot ? 2.6 : 1.4}"/>`;
    const nodes = [[20, '10 · 20 · 30', ['10', '20', '30']], [205, '50 · 60 · 70', ['50', '60', '70']], [390, '90 · 100 · 110', ['90', '100', '110']]];
    let o = ln(280, 44, 95, 90) + ln(280, 44, 465, 90) + ln(280, 44, 280, 90, true);
    o += box(215, 10, 130, 34, '40 · 80');
    nodes.forEach(([x, t, rows], ni) => {
      const hot = ni === 1;
      o += box(x, 90, 150, 34, t, hot);
      rows.forEach((r, ri) => {
        const bx = x + 2 + ri * 50, hit = hot && r === '60';
        o += ln(x + 75, 124, bx + 22, 178, hit) + box(bx, 178, 46, 30, r, hit);
      });
    });
    o += `<text x="10" y="34" font-size="11" fill="#6b6b6b">index</text><text x="10" y="232" font-size="11" fill="#6b6b6b">table rows (found at the bottom of the tree)</text>`;
    return `<svg viewBox="0 0 560 240" style="width:100%;height:auto" role="img" aria-label="A B-tree: searching for 60 goes root, middle node, then the row" font-family="Inter, system-ui, Arial, sans-serif">${o}</svg>`;
  })();

  const bars = (rows) => `<div class="jbars">${rows.map(([label, a, b, aText, bText]) =>
    `<div class="jbar-row"><span class="jbar-l">${label}</span><div class="jbar-w">` +
    `<div class="jbar"><i style="width:${Math.max(a, 1.2)}%" class="amber"></i><span>${aText}</span></div>` +
    `<div class="jbar"><i style="width:${Math.max(b, 1.2)}%" class="green"></i><span>${bText}</span></div></div></div>`).join('')}</div>` +
    `<p class="jnote"><span class="jkey amber"></span> OFFSET &nbsp; <span class="jkey green"></span> keyset</p>`;

  /* ---------- page ---------- */
  const NAV = [['p-keys', 'Keys & constraints'], ['p-btree', 'B-tree indexes'], ['p-comp', 'Composite indexes'], ['p-scan', 'Seq scan vs index scan'], ['p-explain', 'EXPLAIN'], ['p-slow', 'Why queries are slow'], ['p-page', 'OFFSET vs keyset'], ['p-n1', 'N+1 queries'], ['p-cheat', 'Say it in an interview']];

  const keys = sec('p-keys', 1, 'Primary keys, foreign keys and unique constraints', 'A constraint is a <strong>rule</strong>. An index is a <strong>speed tool</strong>. Some constraints give you both.',
    cols(2,
      card('What you declare, what you get', '', table(['You declare', 'The database also builds', 'Note'], [
        ['<code>PRIMARY KEY</code>', 'a unique index', 'Also NOT NULL. Lookups by <code>post_id</code> are fast by default.'],
        ['<code>UNIQUE</code>', 'a unique index', 'Blocks duplicates and speeds up lookups on that column.'],
        ['<code>FOREIGN KEY</code>', '<strong>nothing</strong> in PostgreSQL', 'MySQL (InnoDB) does index it. In PostgreSQL, add the index yourself.'],
        ['<code>PRIMARY KEY (a, b)</code>', 'one index on <code>(a, b)</code>', 'Order matters. See composite indexes.'],
      ])),
      card('Index your foreign keys', '<code>posts.user_id</code> is a foreign key.',
        code(`CREATE INDEX idx_posts_user_id\n  ON posts (user_id);`) +
        `<ul class="jbul"><li>"Show all posts of user 42" filters on <code>user_id</code>. Without an index it reads the whole table.</li><li>Joining <code>users</code> to <code>posts</code> uses the same column.</li><li>Deleting a user makes the database look for that user's posts, so it needs the index too.</li></ul>`)
    ) +
    callout('Remember', 'Primary key and unique give you a rule <em>and</em> an index. A foreign key gives you a rule only (in PostgreSQL), so create its index on purpose.', 'green'));

  const btree = sec('p-btree', 2, 'B-tree indexes and when indexes help', 'The default index type. Think of the index at the back of a book.',
    cols(2,
      card('How it works', '',
        p('A B-tree keeps the values <strong>sorted</strong> in a small tree. To find 60 you do not read every row. You ask the root, then one node, then you reach the row.') +
        `<ul class="jbul"><li>Looking for <strong>60</strong>: the root says "between 40 and 80", go to the middle node, find 60, jump to the row.</li><li>A table of a million rows needs only about <strong>3 to 4 steps</strong>. Doubling the data adds almost nothing.</li><li>Because values are sorted, it also handles ranges (<code>BETWEEN</code>, <code>&gt;</code>) and <code>ORDER BY</code>.</li></ul>` +
        code(`CREATE INDEX idx_posts_created_at\n  ON posts (created_at);`)),
      card('Looking for 60', 'Green path: root → middle node → row.', `<div class="jfig">${btreeSvg}</div>`)
    ) +
    cols(2,
      card('Indexes help with', '', `<ul class="jbul"><li><code>WHERE col = value</code> and ranges (<code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>)</li><li><code>JOIN … ON</code> columns</li><li><code>ORDER BY col LIMIT n</code> (already sorted, no sorting needed)</li><li><code>MIN</code> / <code>MAX</code></li><li>Prefix search: <code>LIKE 'abc%'</code></li><li>Checking uniqueness quickly</li></ul>`, 'good'),
      card('Indexes do NOT help when', '', `<ul class="jbul"><li>The table is tiny. Reading it all is already fast.</li><li>The column has few different values (like <code>is_active</code>, where 95% are true).</li><li>The pattern starts with a wildcard: <code>LIKE '%abc'</code>.</li><li>You wrap the column in a function or maths: <code>WHERE LOWER(email) = …</code>, <code>WHERE views + 1 = 10</code>.</li><li>You need most of the table anyway.</li><li>The types do not match (comparing a number column to a text value).</li></ul>`, 'warn')
    ) +
    callout('The price of an index', 'Every <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code> must also update every index on that table, and indexes take disk space. Add indexes for queries you actually run, not "just in case".'));

  const comp = sec('p-comp', 3, 'Composite indexes', 'One index on several columns. Like a phone book sorted by last name, then first name.',
    cols(2,
      card('Built for one query', '"Latest posts of a user."',
        code(`CREATE INDEX idx_posts_user_created\n  ON posts (user_id, created_at);\n\nSELECT * FROM posts\nWHERE user_id = 42\nORDER BY created_at DESC\nLIMIT 10;`) +
        note('The index is sorted by <code>user_id</code> first, then by <code>created_at</code> inside each user. The database jumps to user 42 and reads the newest entries in order.')),
      card('What the index looks like', 'Sorted by the first column, then the second.',
        tv('index (user_id, created_at)', ['user_id', 'created_at', '→ row'], [['1', 'Jan 05', 'post 101'], ['1', 'Mar 02', 'post 103'], ['2', 'Feb 01', 'post 102'], ['2', 'Feb 09', 'post 105'], ['3', 'Jan 20', 'post 104']]))
    ) +
    cols(2,
      card('The leftmost-column rule', 'The index works from the left. You cannot skip the first column.', table(['Query filters on', 'Uses the index?'], [
        ['<code>user_id</code>', 'Yes'],
        ['<code>user_id</code> and <code>created_at</code>', 'Yes, best case'],
        ['<code>user_id</code> + <code>ORDER BY created_at</code>', 'Yes, and no extra sort'],
        ['<code>created_at</code> only', '<strong>No</strong> (or poorly). It skips the first column'],
      ])),
      card('Choosing the column order', '', `<ul class="jbul"><li>Put columns tested with <strong>equals</strong> first.</li><li>Put the <strong>range or sort</strong> column last.</li><li>One composite index usually replaces a separate index on its first column.</li></ul>` + note('Phone book: easy to find "Sharma", hard to find everyone called "Asha" (the second column) without reading the whole book.'))
    ));

  const scan = sec('p-scan', 4, 'Sequential scan vs index scan', 'Two ways the database can find your rows. It chooses the cheaper one.',
    cols(2,
      card('Sequential scan (Seq Scan)', 'Reads <strong>every page</strong> of the table and keeps the matches.', `<div class="jfig">${pagesSvg([], true)}</div>` +
        `<ul class="jbul"><li>Work grows with the size of the table.</li><li>Fine for small tables, or when you need most of the rows.</li><li>The classic sign of a missing index on a big table.</li></ul>`),
      card('Index scan', 'Uses the index to <strong>jump</strong> to the few pages that hold the rows.', `<div class="jfig">${pagesSvg([5, 19, 38])}</div>` +
        `<ul class="jbul"><li>Work stays small even on huge tables.</li><li>Best when the query returns only a few rows.</li><li>Related: <em>Index Only Scan</em> (the index has all the columns you need) and <em>Bitmap Scan</em> (a middle ground).</li></ul>`)
    ) +
    callout('An index does not guarantee an index scan', 'If a query returns a big share of the table, the database may <em>choose</em> a seq scan on purpose, because jumping around is slower than reading in order. It decides from statistics about your data, which is why <code>EXPLAIN</code> matters.', 'green'));

  const explain = sec('p-explain', 5, 'EXPLAIN and EXPLAIN ANALYZE', 'Ask the database <em>how</em> it will run, or did run, a query.',
    cols(2,
      card('The two commands', '',
        code(`EXPLAIN\nSELECT * FROM posts WHERE user_id = 42;\n\nEXPLAIN ANALYZE\nSELECT * FROM posts WHERE user_id = 42;`) +
        table(['', 'EXPLAIN', 'EXPLAIN ANALYZE'], [
          ['Runs the query?', 'No', '<strong>Yes</strong>'],
          ['Numbers', 'estimates', 'estimates <strong>and</strong> real time and rows'],
        ]) +
        callout('Careful', '<code>EXPLAIN ANALYZE</code> really executes the query. For <code>UPDATE</code> or <code>DELETE</code>, wrap it: <code>BEGIN; EXPLAIN ANALYZE …; ROLLBACK;</code>')),
      card('Before the index', 'Example output (PostgreSQL). Numbers are illustrative.',
        code(`Seq Scan on posts  (cost=0.00..21500.00 rows=3 width=72)\n                   (actual time=0.020..96.310 rows=3 loops=1)\n  Filter: (user_id = 42)\n  Rows Removed by Filter: 999997\nPlanning Time: 0.090 ms\nExecution Time: 96.350 ms`) +
        `<p class="jsub" style="margin-top:14px">After <code>CREATE INDEX idx_posts_user_id ON posts (user_id);</code></p>` +
        code(`Index Scan using idx_posts_user_id on posts\n    (cost=0.42..12.50 rows=3 width=72)\n    (actual time=0.030..0.045 rows=3 loops=1)\n  Index Cond: (user_id = 42)\nPlanning Time: 0.110 ms\nExecution Time: 0.070 ms`))
    ) +
    card('How to read a plan', 'Look at these first.', table(['You see', 'It means'], [
      ['<code>Seq Scan on posts</code>', 'The whole table is read. Suspicious on a big table.'],
      ['<code>Rows Removed by Filter: 999997</code>', 'Almost everything read was thrown away. An index could avoid that work.'],
      ['<code>Index Scan using idx_…</code> / <code>Index Cond</code>', 'The index was used.'],
      ['<code>cost=0.00..21500.00</code>', 'The planner\'s estimate in made-up units, only good for comparing plans.'],
      ['<code>rows=3</code> vs <code>actual … rows=3</code>', 'Estimated vs real rows. A big gap means stale statistics. Run <code>ANALYZE</code>.'],
      ['<code>actual time</code> and <code>Execution Time</code>', 'Real milliseconds. The number you want to bring down.'],
    ])));

  const slow = sec('p-slow', 6, 'Why queries become slow', 'Most slow queries have one of a few common causes.',
    cols(2,
      card('Common causes and fixes', '', table(['Cause', 'Fix'], [
        ['No index on the filter or join column', 'Add an index'],
        ['Function or maths on the column (<code>LOWER(email)</code>)', 'Rewrite, or create an index on the expression'],
        ['<code>LIKE '+"'%abc'"+'</code> (leading wildcard)', 'Full-text search or a trigram index'],
        ['<code>SELECT *</code> when you need 2 columns', 'Select only what you need'],
        ['Big <code>OFFSET</code>', 'Keyset pagination'],
        ['N+1 queries', 'Join or batch the queries'],
        ['Returning far too many rows', 'Filter, <code>LIMIT</code>, paginate'],
        ['Composite index in the wrong column order', 'Reorder the columns'],
        ['Outdated statistics', '<code>ANALYZE</code>'],
        ['Too many indexes (slow writes)', 'Drop the ones nobody uses'],
        ['Waiting on another transaction\'s lock', 'Keep transactions short'],
      ])),
      card('How to investigate, step by step', '',
        `<ol class="tv-steps">
          <li><strong>Find the query.</strong> Use the slow-query log or <code>pg_stat_statements</code>. Get the real parameter values.</li>
          <li><strong>Run <code>EXPLAIN ANALYZE</code></strong> on it.</li>
          <li><strong>Look for</strong> a Seq Scan on a big table, huge <em>Rows Removed by Filter</em>, a big gap between estimated and actual rows, or an expensive sort.</li>
          <li><strong>Make a guess:</strong> "there is no index on <code>user_id</code>".</li>
          <li><strong>Fix it:</strong> add the index or rewrite the query.</li>
          <li><strong>Run <code>EXPLAIN ANALYZE</code> again.</strong> Confirm the plan changed and the time dropped.</li>
          <li><strong>Check the cost:</strong> make sure writes did not get noticeably slower.</li>
        </ol>`)
    ));

  const pageSec = sec('p-page', 7, 'Pagination: OFFSET vs keyset', 'Both give you "the next 20 rows". They behave very differently on page 5,000.',
    cols(2,
      card('OFFSET pagination', 'Simple, but gets slower on every page.',
        code(`SELECT post_id, caption\nFROM posts\nORDER BY post_id DESC\nLIMIT 20 OFFSET 100000;`) +
        p('To return 20 rows, the database must first <strong>walk past 100,000 rows and throw them away</strong>. The deeper the page, the more it skips.')),
      card('Keyset pagination', 'Remember the last row you showed, and start after it.',
        code(`SELECT post_id, caption\nFROM posts\nWHERE post_id < 900000   -- last id of the previous page\nORDER BY post_id DESC\nLIMIT 20;`) +
        p('The index jumps straight to <code>900000</code> and reads 20 rows. Page 1 and page 5,000 cost the same.'))
    ) +
    card('Rows the database walks through (page size 20)', '', bars([
      ['Page 1', 0.02, 0.02, '20', '20'],
      ['Page 100', 2, 0.02, '2,000', '20'],
      ['Page 5,000', 100, 0.02, '100,000', '20'],
    ])) +
    cols(2,
      card('Trade-offs', '', table(['', 'OFFSET', 'Keyset'], [
        ['Speed on deep pages', 'slow', '<strong>constant</strong>'],
        ['Jump to "page 500"', 'yes', 'no (next / previous only)'],
        ['Rows shift when data changes', 'yes, you may see repeats or skips', 'stable'],
        ['Needs', 'nothing', 'a unique, indexed sort column'],
      ])),
      card('Sorting by a non-unique column', 'Add the id as a tie-breaker and compare both together.',
        code(`SELECT post_id, caption, created_at\nFROM posts\nWHERE (created_at, post_id)\n    < ('2026-10-01 10:00:00', 900000)\nORDER BY created_at DESC, post_id DESC\nLIMIT 20;`) +
        note('Back it with an index on <code>(created_at, post_id)</code>. Your API returns a <code>next_cursor</code> (the last row\'s values) and the client sends it back.'))
    ));

  const n1 = sec('p-n1', 8, 'The N+1 query problem', 'One query to get a list, then one extra query for <strong>each</strong> item in it.',
    cols(2,
      card('How it happens', 'Show 20 posts with the author\'s name.',
        code(`const posts = await postRepo.find({ take: 20 });      // 1 query\n\nfor (const post of posts) {\n  post.author = await userRepo.findOneBy({         // 20 queries\n    user_id: post.user_id,\n  });\n}`) +
        code(`SELECT * FROM posts LIMIT 20;\nSELECT * FROM users WHERE user_id = 1;\nSELECT * FROM users WHERE user_id = 2;\nSELECT * FROM users WHERE user_id = 1;\n-- … 20 times in total`) +
        note('<strong>1 + 20 = 21 queries.</strong> With 100 posts it is 101. Each query pays for a network round trip, parsing and planning, so the page crawls.')),
      card('How to fix it', '',
        `<h4 class="jh4">Fix 1: one JOIN (1 query)</h4>` +
        code(`SELECT p.post_id, p.caption, u.username\nFROM posts p\nJOIN users u ON u.user_id = p.user_id\nLIMIT 20;`) +
        `<h4 class="jh4">Fix 2: batch with IN (2 queries)</h4>` +
        code(`SELECT * FROM posts LIMIT 20;\nSELECT * FROM users\nWHERE user_id IN (1, 2, 3, 7, 9);`) +
        `<h4 class="jh4">Fix 3: ask your ORM to load the relation</h4>` +
        table(['ORM', 'Option'], [['TypeORM', '<code>relations: { author: true }</code>'], ['Prisma', '<code>include: { author: true }</code>'], ['Sequelize', '<code>include: [User]</code>']]))
    ) +
    callout('How to spot it', 'The query log shows the <strong>same query shape repeated with different ids</strong>, or the number of queries grows with the number of rows on the page. ORMs with lazy loading hide it well, so count the queries per request.', 'green'));

  const cheat = sec('p-cheat', 9, 'Say it in an interview', 'Your answer to "why is this query slow, and what would you do?"',
    cols(2,
      card('A 30-second answer', '', `<ol class="tv-steps"><li>"First I would get the exact query and run <strong>EXPLAIN ANALYZE</strong>."</li><li>"I would look for a <strong>sequential scan</strong> on a big table, many rows removed by the filter, or estimates far from actual."</li><li>"Usually it is a <strong>missing or unusable index</strong>, so I would add one, in the right column order, and check the plan again."</li><li>"If the query is fine, I would check for <strong>N+1</strong> calls, a deep <strong>OFFSET</strong>, or lock waits."</li></ol>`),
      card('Quick definitions', '', table(['Term', 'One line'], [
        ['Index', 'A sorted structure that lets the database jump to rows.'],
        ['B-tree', 'The default index. Good for equals, ranges and sorting.'],
        ['Seq scan', 'Read every page of the table.'],
        ['Index scan', 'Use the index to jump to matching rows.'],
        ['Composite index', 'An index on several columns. Leftmost column first.'],
        ['EXPLAIN ANALYZE', 'Run the query and show the real plan and time.'],
        ['Keyset pagination', '"Start after the last row I saw." Constant speed.'],
        ['N+1', 'One query for the list, plus one per item.'],
      ]))
    ));

  K.add({
    id: 'sql-performance',
    title: 'Indexing & Performance',
    description: 'Level 4: keys and indexes, B-trees, composite indexes, EXPLAIN, seq vs index scan, slow queries, OFFSET vs keyset pagination, N+1.',
    intro: page(
      hero({ level: 'Level 4', title: 'Indexing and query performance', intro: 'You should be able to explain why a query is slow and how you would investigate it. This page gives you the words and the steps.',
        items: ['Primary keys and foreign keys', 'Unique constraints and composite indexes', 'B-tree indexes and when they help', 'EXPLAIN and EXPLAIN ANALYZE', 'Sequential scan vs index scan', 'Why queries become slow', 'OFFSET vs keyset pagination', 'N+1 query problems'] }),
      nav(NAV),
      band('Our example', 'A big <code>posts</code> table. Nothing is stored in the examples below, we just imagine the size.',
        `<div class="jcard" style="min-width:320px">${table(['Table', 'Rows', 'Columns'], [
          ['<code>users</code>', '50,000', '<code>user_id</code> (PK), <code>username</code>, <code>email</code>'],
          ['<code>posts</code>', '<strong>1,000,000</strong>', '<code>post_id</code> (PK), <code>user_id</code> (FK), <code>caption</code>, <code>created_at</code>'],
        ])}</div>`),
      keys, btree, comp, scan, explain, slow, pageSec, n1, cheat),
  });
})();
