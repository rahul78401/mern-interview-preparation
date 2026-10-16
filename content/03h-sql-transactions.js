/* SQL module, sub-module 7: Transactions and Design (Level 5).
   Transactions, ACID, isolation levels, locks and deadlocks, normalization, constraints, schema design. */
(() => {
  const K = Learn.sqlKit;
  if (!K) return;
  const { p, code, tv, hl, ok, res, table, card, cols, sec, callout, note, nav, hero, band, page, timeline } = K;
  const INK = '#0d0d0d';
  const yes = '<span class="jyes">Possible</span>', no = '<span class="jno">Prevented</span>';

  /* Deadlock picture: each transaction holds one row and waits for the other. */
  const deadlockSvg = (() => {
    const txn = (x, t) => `<rect x="${x}" y="14" width="120" height="42" rx="10" fill="#fff" stroke="${INK}" stroke-width="1.7"/><text x="${x + 60}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${t}</text>`;
    const row = (x, t) => `<rect x="${x}" y="156" width="120" height="42" rx="10" fill="#f3f3f1" stroke="${INK}" stroke-width="1.7"/><text x="${x + 60}" y="182" text-anchor="middle" font-size="14" font-weight="600" font-family="ui-monospace, Consolas, monospace" fill="${INK}">${t}</text>`;
    const holds = (x) => `<line x1="${x}" y1="58" x2="${x}" y2="154" stroke="#1e7a4c" stroke-width="2.6"/>`;
    const waits = (x1, x2) => `<line x1="${x1}" y1="58" x2="${x2}" y2="154" stroke="#b8741a" stroke-width="2.4" stroke-dasharray="7 6"/>`;
    return `<svg viewBox="0 0 560 214" style="width:100%;max-width:560px;height:auto" role="img" aria-label="Deadlock: A holds row 1 and waits for row 2, B holds row 2 and waits for row 1" font-family="Inter, system-ui, Arial, sans-serif">` +
      holds(70) + holds(490) + waits(110, 450) + waits(450, 110) +
      txn(10, 'Txn A') + txn(430, 'Txn B') + row(10, 'row 1') + row(430, 'row 2') +
      `<text x="80" y="112" font-size="12" font-weight="600" fill="#135238">holds</text>` +
      `<text x="500" y="112" font-size="12" font-weight="600" fill="#135238">holds</text>` +
      `<text x="280" y="84" text-anchor="middle" font-size="12" font-weight="600" fill="#85500f">each waits for the other</text></svg>`;
  })();

  const acid = (letter, name, line, example, how) =>
    card(`<span class="jletter">${letter}</span>${name}`, line, `<p>${example}</p>` + note(`<strong>Kept by:</strong> ${how}`));

  const NAV = [['t-why', 'Why transactions'], ['t-acid', 'ACID'], ['t-cmd', 'BEGIN · COMMIT · ROLLBACK'], ['t-iso', 'Isolation levels'], ['t-lock', 'Locks & deadlocks'], ['t-norm', 'Normalization'], ['t-cons', 'Constraints'], ['t-design', 'Schema design'], ['t-cheat', 'Cheat sheet']];

  const why = sec('t-why', 1, 'Why we need transactions', 'Some changes only make sense <strong>together</strong>. A transaction makes a group of statements one single unit.',
    cols(2,
      card('Sending money takes two steps', 'Move 200 from Asha to Ravi.', code(`UPDATE accounts SET balance = balance - 200 WHERE id = 1;  -- Asha\nUPDATE accounts SET balance = balance + 200 WHERE id = 2;  -- Ravi`) +
        p('If the server crashes <strong>between</strong> the two lines, 200 rupees simply disappear. A transaction guarantees both lines happen, or neither does.')),
      card('What the balances look like', 'The total should always be 1500.', table(['Moment', 'Asha', 'Ravi', 'Total'], [
        ['Start', '1000', '500', '1500'],
        ['<span class="jbad">After the first UPDATE, then a crash</span>', '800', '500', '<strong>1300 ✗</strong>'],
        ['After both UPDATEs', '800', '700', '1500'],
      ]) + note('Row 2 is the dangerous state. Without a transaction, a crash can leave the database stuck there.'))
    ));

  const acidSec = sec('t-acid', 2, 'ACID properties', 'Four promises a transaction makes. The word is the first letters.',
    cols(4,
      acid('A', 'Atomicity', 'All or nothing.', 'If any step fails, every step is undone. The transfer either fully happens or does not happen at all.', 'the undo log (rollback)'),
      acid('C', 'Consistency', 'Rules always hold.', 'Before and after, the data follows its rules: balance never negative, every post points to a real user.', 'constraints, plus your own logic'),
      acid('I', 'Isolation', 'No peeking at half-done work.', 'Other transactions running at the same time do not see the 1300 in the middle of the transfer.', 'locks and versions of rows, set by the isolation level'),
      acid('D', 'Durability', 'Committed means permanent.', 'Once the database says "committed", the change survives a crash or power cut.', 'the write-ahead log, flushed to disk')
    ));

  const cmd = sec('t-cmd', 3, 'BEGIN, COMMIT, ROLLBACK', 'Three commands control a transaction.',
    cols(2,
      card('Save it: COMMIT', '',
        code(`BEGIN;\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\nUPDATE accounts SET balance = balance + 200 WHERE id = 2;\nCOMMIT;`) +
        note('Until <code>COMMIT</code>, other users still see the old balances (1000 and 500). After it, both changes appear at once.')),
      card('Undo it: ROLLBACK', '',
        code(`BEGIN;\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\n-- something goes wrong here\nROLLBACK;`) +
        note('Everything since <code>BEGIN</code> is thrown away. Asha still has 1000.'))
    ) +
    cols(2,
      card('The commands', '', table(['Command', 'What it does'], [
        ['<code>BEGIN</code>', 'Start a transaction'],
        ['<code>COMMIT</code>', 'Make all changes permanent'],
        ['<code>ROLLBACK</code>', 'Undo all changes since <code>BEGIN</code>'],
        ['<code>SAVEPOINT name</code>', 'A bookmark inside a transaction, so you can undo only part of it'],
      ]) + note('<strong>Autocommit:</strong> without <code>BEGIN</code>, every single statement is its own mini transaction and is saved immediately.')),
      card('In a NestJS app', 'Let the ORM commit or roll back for you.', code(`await dataSource.transaction(async (manager) => {\n  await manager.decrement(Account, { id: 1 }, 'balance', 200);\n  await manager.increment(Account, { id: 2 }, 'balance', 200);\n});   // an error inside = automatic ROLLBACK`)
        + note('Use the <code>manager</code> given to you for every query inside, or those queries run <em>outside</em> the transaction.'))
    ));

  const iso = sec('t-iso', 4, 'Isolation levels and the three problems', 'When transactions overlap, three strange things can happen. Isolation levels decide which ones you allow.',
    cols(2,
      card('Dirty read', 'Reading someone\'s <strong>uncommitted</strong> change.', timeline([
        ['UPDATE … SET balance = 0', '', 'A changes the balance but has not committed.'],
        ['', 'SELECT balance', 'B reads <strong>0</strong>, a value that is not official yet.'],
        ['ROLLBACK', '', 'A undoes it. The balance is 1000, but B already used 0.'],
      ])),
      card('Non-repeatable read', 'The <strong>same row</strong> changes between two reads.', timeline([
        ['SELECT balance', '', 'A reads <strong>1000</strong>.'],
        ['', 'UPDATE … SET balance = 800; COMMIT', 'B changes it and commits.'],
        ['SELECT balance', '', 'A reads <strong>800</strong>. Same query, different answer.'],
      ]))
    ) +
    cols(2,
      card('Phantom read', 'The <strong>set of rows</strong> changes between two reads.', timeline([
        ['SELECT COUNT(*) … user_id = 1', '', 'A sees <strong>2</strong> posts.'],
        ['', 'INSERT a post for user 1; COMMIT', 'B adds a matching row.'],
        ['SELECT COUNT(*) … user_id = 1', '', 'A now sees <strong>3</strong>. A "phantom" appeared.'],
      ])),
      card('Which level allows which problem', '', table(['Isolation level', 'Dirty read', 'Non-repeatable read', 'Phantom read'], [
        ['Read Uncommitted', yes, yes, yes],
        ['Read Committed', no, yes, yes],
        ['Repeatable Read', no, no, yes + ' <small>*</small>'],
        ['Serializable', no, no, no],
      ]) + note('* In PostgreSQL, Repeatable Read also prevents phantoms. Higher levels are safer but cause more waiting, and sometimes a transaction must be retried.'))
    ) +
    cols(2,
      card('Defaults and how to set one', '', `<ul class="jbul"><li><strong>PostgreSQL</strong> default: Read Committed.</li><li><strong>MySQL (InnoDB)</strong> default: Repeatable Read.</li><li>PostgreSQL never allows dirty reads. "Read Uncommitted" behaves like Read Committed there.</li></ul>` +
        code(`BEGIN ISOLATION LEVEL REPEATABLE READ;\n-- queries here see one steady snapshot\nCOMMIT;`) +
        note('Choose per transaction. Most apps stay on the default and use Serializable only for money-critical logic.')),
      card('Which level should I use?', '', `<ul class="jbul"><li><strong>Read Committed:</strong> fine for most apps, and the usual default.</li><li><strong>Repeatable Read:</strong> when one transaction must see a steady picture, for example a long report.</li><li><strong>Serializable:</strong> money-critical logic. Be ready to <strong>retry</strong> if the database cancels a transaction.</li></ul>`)
    )
);

  const lock = sec('t-lock', 5, 'Locking basics and deadlocks', 'When two transactions want the same row, one waits. When they wait for <em>each other</em>, that is a deadlock.',
    cols(2,
      card('Locks in one minute', '',
        `<ul class="jbul"><li>When a transaction <strong>changes a row</strong>, it locks that row. Others who want to change it <strong>wait</strong> until it commits or rolls back.</li><li>In PostgreSQL and MySQL (InnoDB) a plain <code>SELECT</code> does not wait and does not block anyone.</li><li>Long transactions hold locks for a long time, which makes other queries look "slow".</li></ul>` +
        `<p class="jsub" style="margin-top:12px">Lock rows on purpose so nobody changes them while you decide:</p>` +
        code(`BEGIN;\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n-- check the balance, then:\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\nCOMMIT;`)),
      card('A deadlock', 'Each one holds a row the other needs.', `<div class="jfig">${deadlockSvg}</div>` +
        note('Neither can ever continue. The database notices the cycle, <strong>cancels one</strong> transaction (the "victim") with an error, and lets the other finish.'))
    ) +
    cols(2,
      card('How it unfolds', '', timeline([
        ['UPDATE … WHERE id = 1', '', 'A locks <strong>row 1</strong>.'],
        ['', 'UPDATE … WHERE id = 2', 'B locks <strong>row 2</strong>.'],
        ['UPDATE … WHERE id = 2', '', 'A wants row 2, so it waits for B.'],
        ['', 'UPDATE … WHERE id = 1', 'B wants row 1, so it waits for A. <strong>Deadlock.</strong>', 'hl'],
        ['', '', 'The database rolls one back with "deadlock detected". The other continues.'],
      ])),
      card('How to avoid them', '', `<ul class="jbul"><li><strong>Same order, always.</strong> If every transaction touches row 1 before row 2, a cycle cannot form.</li><li><strong>Keep transactions short.</strong> No waiting for a user or an API call inside one.</li><li><strong>Lock only what you need.</strong></li><li><strong>Retry.</strong> The victim got an error, so catch it and run the transaction again.</li></ul>`)
    ));

  const norm = sec('t-norm', 6, 'Normalization: 1NF, 2NF, 3NF', 'Organise tables so each fact is stored <strong>once</strong>. We improve one messy table, step by step.',
    callout('One sentence to remember', 'Every column must depend on <strong>the key</strong> (1NF), <strong>the whole key</strong> (2NF), and <strong>nothing but the key</strong> (3NF).', 'green') +
    card('Start: a messy table', 'Two problems. Several products are packed into one cell, and customer facts are repeated.',
      `<div class="tv-grid">${tv('orders_raw', ['order_id', 'customer', 'city', 'products'], [['101', 'Asha', 'Pune', hlCell('Pen, Book')], ['102', 'Ravi', 'Delhi', 'Bag']])}</div>`) +
    cols(3,
      card('1NF: one value per cell', 'No lists in a cell, no repeating columns (<code>product1</code>, <code>product2</code>). Each row identifiable.',
        tv('orders', ['order_id', 'customer', 'city', 'product'], [hl('101', 'Asha', 'Pune', 'Pen'), hl('101', 'Asha', 'Pune', 'Book'), ['102', 'Ravi', 'Delhi', 'Bag']]) +
        note('Key is <code>(order_id, product)</code>. Asha and Pune are still repeated (amber).')),
      card('2NF: the whole key', 'A column must depend on the <strong>whole</strong> key, not part of it. Here customer and city depend only on <code>order_id</code>, so move them out.',
        tv('orders', ['order_id', 'customer', 'city'], [['101', 'Asha', 'Pune'], ['102', 'Ravi', 'Delhi']]) +
        tv('order_items', ['order_id', 'product'], [['101', 'Pen'], ['101', 'Book'], ['102', 'Bag']]) +
        note('Only matters when the key has two or more columns.')),
      card('3NF: nothing but the key', 'No column may depend on another <strong>non-key</strong> column. City depends on the customer (<code>order → customer → city</code>), so move it out.',
        tv('customers', ['customer_id', 'name', 'city'], [['1', 'Asha', 'Pune'], ['2', 'Ravi', 'Delhi']]) +
        tv('orders', ['order_id', 'customer_id'], [['101', '1'], ['102', '2']]) +
        tv('order_items', ['order_id', 'product'], [['101', 'Pen'], ['101', 'Book'], ['102', 'Bag']]))
    ) +
    cols(2,
      card('What goes wrong without it', '', table(['Problem', 'Example'], [
        ['Update', 'Asha moves to Mumbai. You must change every order row she appears in, and missing one leaves two cities.'],
        ['Insert', 'You cannot save a new customer until they place an order.'],
        ['Delete', 'Deleting Ravi\'s only order also deletes the fact that Ravi exists.'],
      ])),
      card('Good to know', '', `<ul class="jbul"><li>Most real schemas aim for <strong>3NF</strong>.</li><li>Normal forms go beyond 3NF (BCNF and more), but 1NF to 3NF is what interviews ask.</li><li>Sometimes you <strong>denormalize on purpose</strong> (store a copy) to make reads faster. Do it knowingly and keep the copy updated.</li></ul>`)
    ));

  const cons = sec('t-cons', 7, 'Constraints and data integrity', 'Rules the database enforces for you, so bad data cannot get in, whatever code is writing.',
    cols(2,
      card('The constraints', '', table(['Constraint', 'Rule', 'Example'], [
        ['<code>NOT NULL</code>', 'A value is required', '<code>email</code>'],
        ['<code>UNIQUE</code>', 'No duplicates', '<code>username</code>'],
        ['<code>PRIMARY KEY</code>', 'Unique and not null, identifies the row', '<code>user_id</code>'],
        ['<code>FOREIGN KEY</code>', 'Must point to a real row', '<code>posts.user_id → users</code>'],
        ['<code>CHECK</code>', 'Your own condition', '<code>balance &gt;= 0</code>'],
        ['<code>DEFAULT</code>', 'Value used when none is given', '<code>created_at = now()</code>'],
      ])),
      card('All of them in one table', '',
        code(`CREATE TABLE accounts (\n  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  owner     VARCHAR(50)   NOT NULL UNIQUE,\n  balance   DECIMAL(12,2) NOT NULL DEFAULT 0\n                          CHECK (balance >= 0),\n  user_id   BIGINT REFERENCES users (user_id)\n                          ON DELETE SET NULL\n);`) +
        note('Try to take 5000 from a balance of 1000 and the <code>CHECK</code> fails, the statement errors, and the transaction rolls back. This is <strong>Consistency</strong> in action.'))
    ) +
    cols(2,
      card('Foreign key: what happens on delete?', 'Choose with <code>ON DELETE …</code>.', table(['Option', 'When the parent row is deleted'], [
        ['<code>CASCADE</code>', 'the child rows are deleted too'],
        ['<code>SET NULL</code>', 'the child\'s foreign key becomes NULL'],
        ['<code>RESTRICT</code> / <code>NO ACTION</code>', 'the delete is <strong>blocked</strong> (the default)'],
      ])),
      card('Why not just validate in the app?', '', callout('Last line of defense', 'App checks give friendly messages. Constraints guarantee the rule. Other services, scripts, migrations and bugs can all write to the same database, and only the database can stop all of them.', 'green'))
    ));

  const design = sec('t-design', 8, 'Basic schema design', 'A simple recipe that works for most apps. Example: the mini Instagram.',
    cols(2,
      card('The recipe', '', `<ol class="tv-steps">
        <li><strong>List the things</strong> (entities): users, posts, likes.</li>
        <li><strong>List what you store</strong> about each (columns).</li>
        <li><strong>Give each table a primary key.</strong></li>
        <li><strong>Connect them.</strong> One-to-many: foreign key on the "many" side. Many-to-many: a junction table.</li>
        <li><strong>Normalize</strong> to 3NF. Store each fact once.</li>
        <li><strong>Add constraints</strong>: NOT NULL, UNIQUE, CHECK, foreign keys.</li>
        <li><strong>Add indexes</strong> for the queries you will run (foreign keys first).</li>
      </ol>`),
      card('The mini Instagram, as SQL', '',
        code(`CREATE TABLE users (\n  user_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  username   VARCHAR(30)  NOT NULL UNIQUE,\n  email      VARCHAR(255) NOT NULL UNIQUE,\n  created_at TIMESTAMP    NOT NULL DEFAULT now()\n);\n\nCREATE TABLE posts (\n  post_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  user_id    BIGINT NOT NULL REFERENCES users (user_id)\n                    ON DELETE CASCADE,\n  caption    TEXT,\n  created_at TIMESTAMP NOT NULL DEFAULT now()\n);\nCREATE INDEX idx_posts_user_id ON posts (user_id);\n\nCREATE TABLE likes (\n  user_id    BIGINT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,\n  post_id    BIGINT NOT NULL REFERENCES posts (post_id) ON DELETE CASCADE,\n  created_at TIMESTAMP NOT NULL DEFAULT now(),\n  PRIMARY KEY (user_id, post_id)   -- one like per user per post\n);`) +
        note('<code>likes</code> is the junction table. Its composite primary key stops a user liking the same post twice.')),
    ) +
    cols(2,
      card('Choosing data types', '', table(['Data', 'Use', 'Avoid'], [
        ['Money', '<code>DECIMAL(12,2)</code>', '<code>FLOAT</code> (rounding errors)'],
        ['Ids', '<code>BIGINT</code> identity, or <code>UUID</code>', 'text ids'],
        ['Short text', '<code>VARCHAR(n)</code>', ''],
        ['Long text', '<code>TEXT</code>', ''],
        ['Date and time', '<code>TIMESTAMP</code>', 'dates stored as text'],
        ['Yes / no', '<code>BOOLEAN</code>', '<code>\'Y\'</code> / <code>\'N\'</code> text'],
      ])),
      card('Common mistakes', '', `<ul class="jbul"><li>Storing a list in one column (<code>'101,102,103'</code>). Use a junction table.</li><li>A table with no primary key.</li><li>No foreign keys, so orphan rows appear.</li><li><code>FLOAT</code> for money.</li><li>Storing a value you can calculate (like a like count) without keeping it in sync.</li><li>Forgetting the index on a foreign key.</li></ul>`)
    ));

  const cheat = sec('t-cheat', 9, 'Cheat sheet', 'The short answers.',
    `<div class="jcard">${table(['Term', 'One-line answer'], [
      ['Transaction', 'A group of statements that succeed or fail together.'],
      ['Atomicity', 'All or nothing.'],
      ['Consistency', 'The data always follows its rules.'],
      ['Isolation', 'Overlapping transactions do not see each other\'s unfinished work.'],
      ['Durability', 'Committed data survives a crash.'],
      ['Dirty read', 'Reading another transaction\'s uncommitted change.'],
      ['Non-repeatable read', 'The same row gives a different value on the second read.'],
      ['Phantom read', 'The same query returns a different set of rows on the second read.'],
      ['Deadlock', 'Two transactions each wait for a lock the other holds. The database cancels one.'],
      ['1NF / 2NF / 3NF', 'One value per cell / depends on the whole key / depends on nothing but the key.'],
      ['Constraint', 'A rule the database enforces (NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK).'],
    ])}</div>`);

  /* tiny helper kept at the bottom so the cell above stays readable */
  function hlCell(t) { return `<span class="jbad">${t}</span>`; }

  K.add({
    id: 'sql-transactions',
    title: 'Transactions & Design',
    description: 'Level 5: ACID, BEGIN / COMMIT / ROLLBACK, isolation levels, deadlocks, normalization, constraints and basic schema design.',
    intro: page(
      hero({ level: 'Level 5', title: 'Transactions and database design', intro: 'How a database keeps data correct when many things happen at once, and how to lay out tables so the data stays clean.',
        items: ['ACID properties', 'BEGIN, COMMIT, ROLLBACK', 'Isolation levels, dirty and non-repeatable reads', 'Deadlocks and locking basics', 'Normalization: 1NF, 2NF, 3NF', 'Constraints and data integrity', 'Basic schema design'] }),
      nav(NAV),
      band('Practice data', 'A tiny bank. We will move money between these two accounts.', tv('accounts', ['id', 'owner', 'balance'], [['1', 'Asha', '1000'], ['2', 'Ravi', '500']])),
      why, acidSec, cmd, iso, lock, norm, cons, design, cheat),
  });
})();
