/* SQL module, sub-module 3: Fundamentals.
   Level 1 SQL (SELECT … GROUP BY / HAVING), explained with the mini Instagram tables.
   Every example starts from the same practice data shown at the top of the page. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'sql');
  if (!mod) return;
  const F = Learn.fig;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const tip = (title, t, tone = 'green') => `<div class="callout ${tone}"><div class="callout-title">${title}</div>${p(t)}</div>`;
  const note = (t) => `<p class="tv-note">${t}</p>`;
  const NULLC = '<span class="tv-null">NULL</span>';

  const tv = (name, cols, rows) =>
    `<div class="tv"><div class="tv-head">${name}<small>${rows.length} row${rows.length === 1 ? '' : 's'}</small></div><div class="tv-scroll"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>` +
    rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + `</tbody></table></div></div>`;
  const grid = (...items) => `<div class="tv-grid">${items.join('')}</div>`;
  const result = (cols, rows) => tv('result', cols, rows);
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  /* Annotated query: one row per clause. kind 'opt' marks optional clauses. */
  const anatomy = (rows) =>
    `<div class="qbox">${rows.map(([kw, body, what, opt]) =>
      `<div class="qrow"><span class="qk${opt ? ' opt' : ''}">${kw}</span><span class="qb">${esc(body)}</span><span class="qn">${what}${opt ? ' <em>(optional)</em>' : ''}</span></div>`).join('')}</div>`;

  /* ---- Practice data (same tables as the diagram, plus a views column on posts) ---- */
  const usersData = [
    ['1', 'shekar', 'shekar@mail.com', '2026-01-05'],
    ['2', 'asha', 'asha@mail.com', '2026-01-12'],
    ['3', 'ravi', 'ravi@mail.com', '2026-02-03'],
    ['4', 'meena', 'meena@mail.com', '2026-02-20'],
    ['5', 'kiran', 'kiran@mail.com', '2026-03-08'],
  ];
  const postsData = [
    ['101', '1', 'My first SQL table!', '120'],
    ['102', '2', 'Sunset in Goa', '340'],
    ['103', '1', 'Day 2: keys', '80'],
    ['104', '3', 'Biryani time', '210'],
    ['105', '2', 'Beach walk', NULLC],
  ];
  const tUsers = () => tv('users', ['user_id', 'username', 'email', 'created_at'], usersData);
  const tPosts = () => tv('posts', ['post_id', 'user_id', 'caption', 'views'], postsData);

  const flow = F
    ? F.wrap(F.flow(['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'].map((t, i) => ({ t, c: i === 4 ? 'green' : '' })), { w: 104, gap: 26 }),
      'The database reads the clauses in this order, which is different from the order you write them.')
    : '';

  const intro =
    `<div class="doc">` +
    tip('Level 1: write these without searching', 'SELECT, WHERE, ORDER BY, LIMIT · DISTINCT, IN, BETWEEN, LIKE · INSERT, UPDATE, DELETE · NULL, IS NULL, COALESCE · COUNT, SUM, AVG, MIN, MAX · GROUP BY and HAVING') +

    /* ---------- Practice data ---------- */
    `<h3>Practice data</h3>` +
    p('We use two tables from the Instagram diagram. For practice, <code>posts</code> also has a <code>views</code> column. Post 105 is brand new, so its views are <strong>NULL</strong> (unknown). Every example below starts from this data, so the examples do not affect each other.') +
    grid(tUsers(), tPosts()) +

    /* ---------- One query ---------- */
    `<h3>First, understand one query</h3>` +
    code(`SELECT username, email\nFROM users\nWHERE user_id = 1;`) +
    p('Read it like English: <em>"Give me the username and email, from the users table, where the user_id is 1."</em>') +
    anatomy([
      ['SELECT', 'username, email', 'Which <strong>columns</strong> do I want?'],
      ['FROM', 'users', 'Which <strong>table</strong>?'],
      ['WHERE', 'user_id = 1', 'Which <strong>rows</strong>?', true],
    ]) +
    grid(result(['username', 'email'], [['shekar', 'shekar@mail.com']])) +
    ul([
      '<strong>Statement</strong>: the whole instruction. It ends with a semicolon <code>;</code>.',
      '<strong>Clause</strong>: one part of a statement. It starts with a keyword and does one job. <code>SELECT …</code>, <code>FROM …</code> and <code>WHERE …</code> are three clauses.',
      '<strong>Keyword</strong>: a word SQL already knows (<code>SELECT</code>, <code>WHERE</code>). Capital letters are only a habit to make them easy to spot; SQL does not care.',
      '<strong>Condition</strong>: a test that is true or false for each row (<code>user_id = 1</code>).',
    ]) +

    `<h4>The clauses, in the order you write them</h4>` +
    table(['Clause', 'Job', 'Needed?'], [
      ['<code>SELECT</code>', 'Pick columns (or calculations)', 'Yes'],
      ['<code>FROM</code>', 'Pick the table', 'Yes (almost always)'],
      ['<code>WHERE</code>', 'Keep only rows that pass a test', 'Optional'],
      ['<code>GROUP BY</code>', 'Put rows into buckets', 'Optional'],
      ['<code>HAVING</code>', 'Keep only buckets that pass a test', 'Optional'],
      ['<code>ORDER BY</code>', 'Sort the result', 'Optional'],
      ['<code>LIMIT</code>', 'Keep only the first N rows', 'Optional'],
    ]) +
    flow +

    `<h4>What happens when you leave something out (defaults)</h4>` +
    table(['If you do not write…', 'The database assumes'], [
      ['<code>WHERE</code>', 'Every row. <code>SELECT * FROM users;</code> returns the whole table.'],
      ['<code>SELECT *</code> instead of column names', 'Every column.'],
      ['<code>ORDER BY</code>', 'No guaranteed order. Never rely on it.'],
      ['a direction after <code>ORDER BY</code>', '<code>ASC</code> (smallest first). Write <code>DESC</code> for biggest first.'],
      ['<code>LIMIT</code>', 'All the rows.'],
      ['<code>DISTINCT</code>', 'Keep duplicates (<code>ALL</code>).'],
      ['a column in <code>INSERT</code>', 'Its <code>DEFAULT</code> value, or <code>NULL</code> if it has none.'],
      ['<code>WHERE</code> in <code>UPDATE</code> / <code>DELETE</code>', '<strong>Every row.</strong> This is the classic mistake.'],
    ]) +
    p('Small rules: text goes in <strong>single quotes</strong> (<code>\'asha\'</code>), numbers do not, and <code>AND</code> is worked out before <code>OR</code>, so use brackets when you mix them.') +

    /* ---------- 1. SELECT / WHERE / ORDER BY / LIMIT ---------- */
    `<h3>1. SELECT, WHERE, ORDER BY, LIMIT</h3>` +
    `<h4>SELECT: choose columns</h4>` +
    code(`SELECT * FROM posts;                  -- every column\nSELECT username, email FROM users;    -- only these two`) +
    grid(result(['username', 'email'], usersData.map((r) => [r[1], r[2]]))) +

    `<h4>WHERE: choose rows</h4>` +
    code(`SELECT caption, views\nFROM posts\nWHERE views > 100;`) +
    grid(result(['caption', 'views'], [['My first SQL table!', '120'], ['Sunset in Goa', '340'], ['Biryani time', '210']])) +
    note('Post 105 is missing because NULL is not greater than 100. NULL is covered in section 4.') +
    table(['Operator', 'Meaning'], [
      ['<code>=</code> &nbsp; <code>&lt;&gt;</code> (or <code>!=</code>)', 'equal · not equal'],
      ['<code>&gt;</code> &nbsp; <code>&lt;</code> &nbsp; <code>&gt;=</code> &nbsp; <code>&lt;=</code>', 'greater · smaller · or equal'],
      ['<code>AND</code> &nbsp; <code>OR</code> &nbsp; <code>NOT</code>', 'combine tests: both · either · opposite'],
    ]) +
    code(`SELECT caption FROM posts\nWHERE views > 100 AND user_id = 2;    -- both must be true`) +
    grid(result(['caption'], [['Sunset in Goa']])) +

    `<h4>ORDER BY: sort</h4>` +
    code(`SELECT caption, views\nFROM posts\nWHERE views > 100\nORDER BY views DESC;`) +
    grid(result(['caption', 'views'], [['Sunset in Goa', '340'], ['Biryani time', '210'], ['My first SQL table!', '120']])) +
    note('<code>ASC</code> is the default. Sort by several columns with a comma: <code>ORDER BY user_id ASC, views DESC</code>.') +

    `<h4>LIMIT: keep the first N rows</h4>` +
    code(`SELECT caption, views\nFROM posts\nWHERE views > 100\nORDER BY views DESC\nLIMIT 2;                              -- top 2 most viewed`) +
    grid(result(['caption', 'views'], [['Sunset in Goa', '340'], ['Biryani time', '210']])) +
    tip('Remember', 'Use <code>LIMIT</code> with <code>ORDER BY</code>. Without a sort, "the first 2" is just any 2.', 'amber') +

    /* ---------- 2. DISTINCT / IN / BETWEEN / LIKE ---------- */
    `<h3>2. DISTINCT, IN, BETWEEN, LIKE</h3>` +
    `<h4>DISTINCT: remove repeated values</h4>` +
    code(`SELECT DISTINCT user_id FROM posts;`) +
    grid(result(['user_id'], [['1'], ['2'], ['3']])) +
    note('<code>posts</code> has 5 rows, but only 3 different people wrote them.') +

    `<h4>IN: match any value from a list</h4>` +
    code(`SELECT username FROM users\nWHERE user_id IN (1, 3, 5);`) +
    grid(result(['username'], [['shekar'], ['ravi'], ['kiran']])) +
    note('Same as <code>user_id = 1 OR user_id = 3 OR user_id = 5</code>, just shorter. <code>NOT IN</code> is the opposite.') +

    `<h4>BETWEEN: a range, both ends included</h4>` +
    code(`SELECT caption, views FROM posts\nWHERE views BETWEEN 100 AND 250;`) +
    grid(result(['caption', 'views'], [['My first SQL table!', '120'], ['Biryani time', '210']])) +
    note('Same as <code>views &gt;= 100 AND views &lt;= 250</code>. Works for dates too.') +

    `<h4>LIKE: match a pattern in text</h4>` +
    p('<code>%</code> means any number of characters (even none). <code>_</code> means exactly one character.') +
    table(['Pattern', 'Meaning', 'Matches in posts.caption'], [
      ['<code>\'S%\'</code>', 'starts with S', 'Sunset in Goa'],
      ['<code>\'%time\'</code>', 'ends with "time"', 'Biryani time'],
      ['<code>\'%SQL%\'</code>', 'contains "SQL"', 'My first SQL table!'],
      ['<code>\'_ay%\'</code>', 'any one letter, then "ay"', 'Day 2: keys'],
    ]) +
    code(`SELECT caption FROM posts\nWHERE caption LIKE '%SQL%';`) +
    grid(result(['caption'], [['My first SQL table!']])) +
    note('Upper and lower case: PostgreSQL <code>LIKE</code> cares about it (use <code>ILIKE</code> to ignore case). MySQL ignores case by default.') +

    /* ---------- 3. INSERT / UPDATE / DELETE ---------- */
    `<h3>3. INSERT, UPDATE, DELETE</h3>` +
    `<h4>INSERT: add a row</h4>` +
    code(`INSERT INTO users (username, email)\nVALUES ('divya', 'divya@mail.com');`) +
    p('First list the columns, then give the values <strong>in the same order</strong>. We skipped <code>user_id</code> and <code>created_at</code>, so the database fills them from their defaults (an automatic id and today\'s date), as long as the table was created that way.') +
    grid(tv('users after INSERT', ['user_id', 'username', 'email', 'created_at'], [...usersData.slice(-1), ['<strong>6</strong>', '<strong>divya</strong>', '<strong>divya@mail.com</strong>', '<strong>2026-10-16</strong>']])) +
    note('Several rows at once: <code>VALUES (…), (…), (…)</code>. Only the last existing row is shown above to save space.') +

    `<h4>UPDATE: change rows</h4>` +
    code(`UPDATE posts\nSET views = 150\nWHERE post_id = 105;`) +
    grid(tv('before', ['post_id', 'caption', 'views'], [['105', 'Beach walk', NULLC]]), tv('after', ['post_id', 'caption', 'views'], [['105', 'Beach walk', '<strong>150</strong>']])) +
    note('Change more than one column with a comma: <code>SET views = 150, caption = \'Beach day\'</code>.') +

    `<h4>DELETE: remove rows</h4>` +
    code(`DELETE FROM posts\nWHERE post_id = 105;`) +
    tip('Never forget WHERE', '<code>UPDATE</code> or <code>DELETE</code> without <code>WHERE</code> changes or removes <strong>every row</strong>. Safe habit: first run <code>SELECT * FROM posts WHERE post_id = 105;</code> and check you got exactly the rows you mean. Then change <code>SELECT *</code> to <code>DELETE</code>.', 'amber') +

    /* ---------- 4. NULL ---------- */
    `<h3>4. NULL, IS NULL, COALESCE</h3>` +
    p('<strong>NULL means "no value" or "unknown".</strong> It is not <code>0</code> and it is not empty text. Post 105 has no views recorded yet, so its <code>views</code> is NULL.') +
    table(['Rule', 'Example', 'Result'], [
      ['Comparing with NULL is never true', '<code>views = NULL</code>, <code>views &gt; 100</code>', 'row is left out'],
      ['Maths with NULL gives NULL', '<code>views + 10</code>', 'NULL'],
      ['Aggregates skip NULL', '<code>AVG(views)</code>', 'NULL values are ignored'],
    ]) +
    `<h4>IS NULL / IS NOT NULL</h4>` +
    code(`SELECT post_id, caption FROM posts\nWHERE views IS NULL;        -- not "= NULL"`) +
    grid(result(['post_id', 'caption'], [['105', 'Beach walk']])) +
    note('<code>IS NOT NULL</code> gives the other four posts.') +

    `<h4>COALESCE: replace NULL with a fallback</h4>` +
    p('<code>COALESCE(a, b, …)</code> returns the <strong>first value that is not NULL</strong>. <code>AS</code> gives the result column a name.') +
    code(`SELECT caption, COALESCE(views, 0) AS views\nFROM posts;`) +
    grid(result(['caption', 'views'], [['My first SQL table!', '120'], ['Sunset in Goa', '340'], ['Day 2: keys', '80'], ['Biryani time', '210'], ['Beach walk', '<strong>0</strong>']])) +
    note('This changes only what you see. The table still stores NULL.') +

    /* ---------- 5. Aggregates ---------- */
    `<h3>5. COUNT, SUM, AVG, MIN, MAX</h3>` +
    p('An aggregate function looks at many rows and returns <strong>one value</strong>.') +
    table(['Function', 'Returns'], [
      ['<code>COUNT(*)</code>', 'number of rows'],
      ['<code>COUNT(column)</code>', 'number of rows where that column is not NULL'],
      ['<code>SUM(column)</code>', 'total'],
      ['<code>AVG(column)</code>', 'average'],
      ['<code>MIN(column)</code> &nbsp; <code>MAX(column)</code>', 'smallest · biggest'],
    ]) +
    code(`SELECT COUNT(*), COUNT(views), SUM(views),\n       AVG(views), MIN(views), MAX(views)\nFROM posts;`) +
    grid(result(['COUNT(*)', 'COUNT(views)', 'SUM(views)', 'AVG(views)', 'MIN(views)', 'MAX(views)'], [['5', '4', '750', '187.5', '80', '340']])) +
    note('<code>COUNT(*)</code> is 5 but <code>COUNT(views)</code> is 4, because post 105 is NULL. <code>AVG</code> is 750 ÷ 4 = 187.5, not 750 ÷ 5.') +
    code(`SELECT COUNT(*) FROM posts WHERE user_id = 1;   -- WHERE runs first, so this counts shekar's posts`) +
    grid(result(['COUNT(*)'], [['2']])) +

    /* ---------- 6. GROUP BY / HAVING ---------- */
    `<h3>6. GROUP BY and HAVING</h3>` +
    p('Without <code>GROUP BY</code>, an aggregate covers the whole table. <code>GROUP BY</code> first sorts rows into <strong>buckets</strong> (one per value), then runs the aggregate on each bucket.') +
    code(`SELECT user_id, COUNT(*) AS total_posts\nFROM posts\nGROUP BY user_id;`) +
    grid(
      tv('bucket user_id = 1', ['post_id', 'caption'], [['101', 'My first SQL table!'], ['103', 'Day 2: keys']]),
      tv('bucket user_id = 2', ['post_id', 'caption'], [['102', 'Sunset in Goa'], ['105', 'Beach walk']]),
      tv('bucket user_id = 3', ['post_id', 'caption'], [['104', 'Biryani time']]),
    ) +
    grid(result(['user_id', 'total_posts'], [['1', '2'], ['2', '2'], ['3', '1']])) +
    tip('Rule', 'Every column in <code>SELECT</code> must either be in <code>GROUP BY</code> or be inside an aggregate like <code>COUNT()</code>. Otherwise the database does not know which value to show for the bucket.', 'amber') +

    `<h4>HAVING: filter the buckets</h4>` +
    code(`SELECT user_id, COUNT(*) AS total_posts\nFROM posts\nGROUP BY user_id\nHAVING COUNT(*) >= 2;`) +
    grid(result(['user_id', 'total_posts'], [['1', '2'], ['2', '2']])) +
    table(['', 'WHERE', 'HAVING'], [
      ['Filters', 'individual <strong>rows</strong>', 'whole <strong>groups</strong>'],
      ['Runs', '<strong>before</strong> GROUP BY', '<strong>after</strong> GROUP BY'],
      ['Can use COUNT / SUM…?', 'No', 'Yes'],
    ]) +

    `<h4>All the clauses together</h4>` +
    code(`SELECT user_id, SUM(views) AS total_views\nFROM posts\nWHERE views > 100\nGROUP BY user_id\nHAVING SUM(views) > 200\nORDER BY total_views DESC\nLIMIT 5;`) +
    p('In words: take posts with more than 100 views, group them by author, keep authors whose total is over 200, show the biggest total first, and stop at 5 rows.') +
    grid(result(['user_id', 'total_views'], [['2', '340'], ['3', '210']])) +

    /* ---------- Practice ---------- */
    `<h3>Write these from memory</h3>` +
    `<ol>
      <li>Show the usernames of users created after 1 February 2026.</li>
      <li>Show the 3 most viewed posts.</li>
      <li>Show posts whose caption contains "keys".</li>
      <li>Show posts with no views recorded.</li>
      <li>Count how many posts each user wrote, but only for users with at least 2.</li>
      <li>Add a user named "neha" and then change her email to a new one.</li>
    </ol>` +
    `<details class="answers"><summary>Show answers</summary>` +
    code(`SELECT username FROM users WHERE created_at > '2026-02-01';\n\nSELECT * FROM posts ORDER BY views DESC LIMIT 3;\n\nSELECT * FROM posts WHERE caption LIKE '%keys%';\n\nSELECT * FROM posts WHERE views IS NULL;\n\nSELECT user_id, COUNT(*) FROM posts GROUP BY user_id HAVING COUNT(*) >= 2;\n\nINSERT INTO users (username, email) VALUES ('neha', 'neha@mail.com');\nUPDATE users SET email = 'neha.new@mail.com' WHERE username = 'neha';`) +
    `</details>` +
    `</div>`;

  mod.sections.push({
    id: 'sql-fundamentals',
    title: 'Fundamentals',
    description: 'Level 1 SQL in easy English: SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, IN, BETWEEN, LIKE, INSERT, UPDATE, DELETE, NULL, aggregates, GROUP BY and HAVING.',
    intro,
    qna: [],
    notes: [],
    quiz: [],
  });
})();
