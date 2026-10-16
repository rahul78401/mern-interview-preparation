/* SQL module, sub-module 5: Advanced SQL (Level 3).
   Subqueries, CTEs, CASE, window functions, set operations, second-highest and top-N-per-group. */
(() => {
  const K = Learn.sqlKit;
  if (!K) return;
  const { p, code, NULLC, tv, hl, ok, res, table, card, cols, sec, callout, note, nav, hero, band, page } = K;

  /* ---------- practice data ---------- */
  const emp = [
    ['1', 'Asha', 'Eng', '90000'], ['2', 'Ravi', 'Eng', '80000'], ['3', 'Meena', 'Eng', '80000'], ['4', 'Kiran', 'Sales', '60000'],
    ['5', 'Divya', 'Sales', '70000'], ['6', 'Neha', 'Sales', '70000'], ['7', 'Arjun', 'HR', '50000'], ['8', 'Sana', 'HR', '65000'],
  ];
  const tEmp = () => tv('employees', ['emp_id', 'name', 'dept', 'salary'], emp);
  const tIos = () => tv('ios_users', ['name'], [['Asha'], ['Ravi'], ['Meena']]);
  const tAnd = () => tv('android_users', ['name'], [['Ravi'], ['Kiran'], ['Meena']]);
  const tSign = () => tv('signups', ['month', 'signups'], [['2026-01', '100'], ['2026-02', '150'], ['2026-03', '120'], ['2026-04', '180']]);

  const NAV = [['a-sub', 'Subqueries'], ['a-cte', 'CTEs'], ['a-case', 'CASE WHEN'], ['a-rank', 'ROW_NUMBER · RANK'], ['a-part', 'PARTITION BY · OVER'], ['a-lag', 'LAG · LEAD'], ['a-set', 'UNION · INTERSECT'], ['a-top', '2nd highest · Top N'], ['a-cheat', 'Cheat sheet']];

  const sub = sec('a-sub', 1, 'Subqueries and correlated subqueries', 'A query inside another query. The inner one gives the outer one something to work with.',
    cols(2,
      card('Plain subquery', 'The inner query runs <strong>once</strong>, first.',
        p('Question: <em>who earns more than the company average?</em> You cannot write <code>salary &gt; AVG(salary)</code> directly, so ask the average in a small query and use its answer.') +
        code(`SELECT name, salary\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary) FROM employees\n);`) +
        tv('inner query returns', ['AVG(salary)'], [['70625']]) +
        res(['name', 'salary'], [['Asha', '90000'], ['Ravi', '80000'], ['Meena', '80000']]) +
        note('The brackets matter. The inner query is replaced by its answer (70625), then the outer query runs as <code>salary &gt; 70625</code>.')),
      card('Correlated subquery', 'The inner query uses a column from the <strong>outer row</strong>, so it runs once per row.',
        p('Question: <em>who earns more than the average of <u>their own</u> department?</em> The average changes with every employee.') +
        code(`SELECT name, dept, salary\nFROM employees e\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees\n  WHERE dept = e.dept   -- uses the outer row\n);`) +
        tv('what the database works out, row by row', ['name', 'dept', 'salary', 'own dept avg'], [
          ok('Asha', 'Eng', '90000', '83333'), ['Ravi', 'Eng', '80000', '83333'], ['Meena', 'Eng', '80000', '83333'],
          ['Kiran', 'Sales', '60000', '66667'], ok('Divya', 'Sales', '70000', '66667'), ok('Neha', 'Sales', '70000', '66667'),
          ['Arjun', 'HR', '50000', '57500'], ok('Sana', 'HR', '65000', '57500'),
        ]) +
        note('Green rows are the answer: Asha, Divya, Neha, Sana. Correlated subqueries can be slow on big tables, so often a JOIN or a window function does the same job faster.'))
    ) +
    cols(2,
      card('Where a subquery can sit', '', table(['Place', 'Gives back', 'Example'], [
        ['<code>WHERE</code> with <code>=</code> <code>&gt;</code>', 'one value', '<code>salary &gt; (SELECT AVG…)</code>'],
        ['<code>WHERE … IN</code>', 'a list of values', '<code>dept IN (SELECT dept FROM …)</code>'],
        ['<code>WHERE EXISTS</code>', 'yes / no', '<code>EXISTS (SELECT 1 FROM …)</code>'],
        ['<code>FROM</code>', 'a temporary table (needs an alias)', '<code>FROM (SELECT …) AS t</code>'],
        ['<code>SELECT</code>', 'one value per row', '<code>(SELECT COUNT(*) …) AS total</code>'],
      ])),
      card('Easy way to remember', '', callout('Plain vs correlated', '<strong>Plain:</strong> the inner query could run alone and always gives the same answer. <strong>Correlated:</strong> the inner query mentions the outer table (<code>e.dept</code>), so it cannot run alone.', 'green'))
    ));

  const cte = sec('a-cte', 2, 'CTEs using WITH', 'Give a query a name, then use that name like a table. It lives only for this one statement.',
    cols(2,
      card('Same question, written in steps', 'Employees above their department average.',
        code(`WITH dept_avg AS (\n  SELECT dept, ROUND(AVG(salary), 2) AS avg_salary\n  FROM employees\n  GROUP BY dept\n)\nSELECT e.name, e.dept, e.salary, d.avg_salary\nFROM employees e\nJOIN dept_avg d ON d.dept = e.dept\nWHERE e.salary > d.avg_salary;`) +
        note('Read it top to bottom: <strong>Step 1</strong> build <code>dept_avg</code>. <strong>Step 2</strong> join to it.')),
      card('What each step produces', '',
        tv('dept_avg (the CTE)', ['dept', 'avg_salary'], [['Eng', '83333.33'], ['Sales', '66666.67'], ['HR', '57500.00']]) +
        res(['name', 'dept', 'salary', 'avg_salary'], [['Asha', 'Eng', '90000', '83333.33'], ['Divya', 'Sales', '70000', '66666.67'], ['Neha', 'Sales', '70000', '66666.67'], ['Sana', 'HR', '65000', '57500.00']]))
    ) +
    cols(2,
      card('Why use a CTE', '', `<ul class="jbul"><li><strong>Readable.</strong> Long queries become small named steps.</li><li><strong>Reusable.</strong> Use the same name twice in one query.</li><li><strong>Chainable.</strong> <code>WITH a AS (…), b AS (…) SELECT …</code>, where <code>b</code> can use <code>a</code>.</li></ul>`),
      card('Good to know', '', `<ul class="jbul"><li>A CTE exists only for the one statement that follows it.</li><li>It is mostly about clarity. A CTE and an equivalent subquery usually run the same.</li><li><code>WITH RECURSIVE</code> lets a CTE call itself, used for trees such as categories and sub-categories.</li></ul>`)
    ));

  const caseSec = sec('a-case', 3, 'CASE WHEN', 'If-else inside SQL. It turns values into labels or conditional numbers.',
    cols(2,
      card('Label each row', 'The first matching <code>WHEN</code> wins. No match and no <code>ELSE</code> gives NULL.',
        code(`SELECT name, salary,\n  CASE\n    WHEN salary >= 80000 THEN 'High'\n    WHEN salary >= 65000 THEN 'Medium'\n    ELSE 'Low'\n  END AS band\nFROM employees;`) +
        res(['name', 'salary', 'band'], [['Asha', '90000', 'High'], ['Ravi', '80000', 'High'], ['Meena', '80000', 'High'], ['Kiran', '60000', 'Low'], ['Divya', '70000', 'Medium'], ['Neha', '70000', 'Medium'], ['Arjun', '50000', 'Low'], ['Sana', '65000', 'Medium']])),
      card('CASE inside an aggregate', 'Count only the rows that pass a test, per group.',
        code(`SELECT dept,\n  SUM(CASE WHEN salary >= 70000\n           THEN 1 ELSE 0 END) AS high_earners\nFROM employees\nGROUP BY dept;`) +
        res(['dept', 'high_earners'], [['Eng', '3'], ['Sales', '2'], ['HR', '0']]) +
        note('Each row becomes 1 or 0, then <code>SUM</code> adds them up. This "conditional count" is a very common interview pattern.') +
        callout('Remember', 'End every <code>CASE</code> with <code>END</code>. Conditions are checked top to bottom, so put the strictest first.'))
    ));

  const rank = sec('a-rank', 4, 'Window functions: ROW_NUMBER, RANK, DENSE_RANK', 'Calculate across related rows <strong>without</strong> collapsing them into one.',
    cols(2,
      card('Three ways to number rows', 'Same data, sorted by salary (highest first).',
        code(`SELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,\n  RANK()       OVER (ORDER BY salary DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense\nFROM employees;`) +
        p('<code>OVER (ORDER BY …)</code> says <em>"number the rows in this order"</em>. The columns before it are the function; <code>OVER</code> is what makes it a window function.')),
      card('Result: watch the ties', 'Ravi and Meena tie at 80000. Divya and Neha tie at 70000.',
        res(['name', 'salary', 'row_num', 'rnk', 'dense'], [
          ['Asha', '90000', '1', '1', '1'], hl('Ravi', '80000', '2', '2', '2'), hl('Meena', '80000', '3', '2', '2'),
          hl('Divya', '70000', '4', '4', '3'), hl('Neha', '70000', '5', '4', '3'), ['Sana', '65000', '6', '6', '4'],
          ['Kiran', '60000', '7', '7', '5'], ['Arjun', '50000', '8', '8', '6'],
        ]) +
        note('Rows with equal salary may swap their <code>row_num</code>. Add a second sort column (like <code>name</code>) to make it fixed.'))
    ) +
    `<div class="jcard">${table(['Function', 'Ties get', 'After a tie', 'Sequence here', 'Use it for'], [
      ['<code>ROW_NUMBER()</code>', 'different numbers', 'carries on', '1, 2, 3, 4, 5, 6…', 'exactly N rows, remove duplicates'],
      ['<code>RANK()</code>', 'the <strong>same</strong> rank', '<strong>skips</strong> numbers', '1, 2, 2, 4, 4, 6…', 'sports-style ranking'],
      ['<code>DENSE_RANK()</code>', 'the <strong>same</strong> rank', 'no gap', '1, 2, 2, 3, 3, 4…', '"Nth highest" questions'],
    ])}</div>`);

  const part = sec('a-part', 5, 'PARTITION BY and OVER', '<code>OVER</code> defines the window. <code>PARTITION BY</code> splits it into groups, like GROUP BY but every row stays.',
    cols(2,
      card('Rank inside each department', '',
        code(`SELECT name, dept, salary,\n  RANK() OVER (\n    PARTITION BY dept\n    ORDER BY salary DESC\n  ) AS dept_rank,\n  ROUND(AVG(salary) OVER (\n    PARTITION BY dept), 2) AS dept_avg\nFROM employees\nORDER BY dept, dept_rank, name;`) +
        `<ul class="jbul"><li><code>PARTITION BY dept</code> = start counting again for each department.</li><li><code>ORDER BY salary DESC</code> inside <code>OVER</code> = the order used for ranking.</li><li><code>AVG(…) OVER (…)</code> = an ordinary aggregate that is shown on every row instead of collapsing them.</li></ul>`),
      card('Result', '',
        res(['name', 'dept', 'salary', 'dept_rank', 'dept_avg'], [
          ['Asha', 'Eng', '90000', '1', '83333.33'], ['Meena', 'Eng', '80000', '2', '83333.33'], ['Ravi', 'Eng', '80000', '2', '83333.33'],
          ['Divya', 'Sales', '70000', '1', '66666.67'], ['Neha', 'Sales', '70000', '1', '66666.67'], ['Kiran', 'Sales', '60000', '3', '66666.67'],
          ['Sana', 'HR', '65000', '1', '57500.00'], ['Arjun', 'HR', '50000', '2', '57500.00'],
        ]))
    ) +
    `<div class="jcard">${table(['', 'GROUP BY', 'Window function (OVER)'], [
      ['Rows in the result', 'one per group (collapsed)', '<strong>all rows kept</strong>'],
      ['Group total next to each row?', 'No, needs a join back', 'Yes, same query'],
      ['Syntax', '<code>GROUP BY dept</code>', '<code>… OVER (PARTITION BY dept)</code>'],
    ])}</div>`);

  const lag = sec('a-lag', 6, 'LAG and LEAD', 'Look at the previous row (<code>LAG</code>) or the next row (<code>LEAD</code>) without a self join.',
    cols(2,
      card('Month-by-month change', '',
        code(`SELECT month, signups,\n  LAG(signups)  OVER (ORDER BY month) AS prev,\n  LEAD(signups) OVER (ORDER BY month) AS next,\n  signups - LAG(signups)\n    OVER (ORDER BY month)  AS change\nFROM signups;`) +
        `<ul class="jbul"><li><code>LAG(col)</code> = the value from the row <strong>before</strong>.</li><li><code>LEAD(col)</code> = the value from the row <strong>after</strong>.</li><li>The first row has no previous row, so <code>LAG</code> gives NULL. Pick a default with <code>LAG(col, 1, 0)</code>.</li><li>Add <code>PARTITION BY</code> to do this separately per user, per product…</li></ul>`),
      card('Result', 'Source table and answer.', tSign() +
        res(['month', 'signups', 'prev', 'next', 'change'], [['2026-01', '100', NULLC, '150', NULLC], ['2026-02', '150', '100', '120', '50'], ['2026-03', '120', '150', '180', '-30'], ['2026-04', '180', '120', NULLC, '60']]))
    ));

  const setOps = sec('a-set', 7, 'UNION, UNION ALL, INTERSECT', 'Stack the results of two queries on top of each other.',
    `<div class="jband"><div class="jband-t"><strong>Two lists</strong><span>Who uses the iOS app and who uses the Android app. Ravi and Meena use both.</span></div><div class="tv-grid">${tIos()}${tAnd()}</div></div>` +
    cols(3,
      card('UNION', 'Everyone, duplicates removed.', code(`SELECT name FROM ios_users\nUNION\nSELECT name FROM android_users;`) + res(['name'], [['Asha'], ['Ravi'], ['Meena'], ['Kiran']])),
      card('UNION ALL', 'Everyone, duplicates kept.', code(`SELECT name FROM ios_users\nUNION ALL\nSELECT name FROM android_users;`) + res(['name'], [['Asha'], ['Ravi'], ['Meena'], hl('Ravi'), ['Kiran'], hl('Meena')])),
      card('INTERSECT', 'Only rows that appear in both.', code(`SELECT name FROM ios_users\nINTERSECT\nSELECT name FROM android_users;`) + res(['name'], [['Ravi'], ['Meena']]))
    ) +
    cols(2,
      card('Rules', '', `<ul class="jbul"><li>Both queries need the <strong>same number of columns</strong>, with compatible types.</li><li>Column names come from the <strong>first</strong> query.</li><li><code>ORDER BY</code> goes once, at the very end.</li><li><code>EXCEPT</code> (rows in the first but not the second) also exists: it would give Asha.</li></ul>`),
      card('UNION vs UNION ALL', '', callout('Prefer UNION ALL', '<code>UNION</code> has to sort or hash everything to remove duplicates, which costs time. If duplicates are impossible or acceptable, use <code>UNION ALL</code>. It is faster.', 'green'))
    ));

  const top = sec('a-top', 8, 'Second-highest salary and top N per group', 'Two classic interview questions. Ask "what about ties?" before you answer.',
    `<h4 class="jh4">Second-highest salary: three ways</h4>` +
    cols(3,
      card('1. DENSE_RANK', 'Handles ties correctly. Works for "Nth".', code(`SELECT DISTINCT salary\nFROM (\n  SELECT salary,\n    DENSE_RANK() OVER (\n      ORDER BY salary DESC) AS r\n  FROM employees\n) t\nWHERE r = 2;`) + res(['salary'], [['80000']])),
      card('2. Subquery with MAX', 'Short, but only for the 2nd.', code(`SELECT MAX(salary)\nFROM employees\nWHERE salary < (\n  SELECT MAX(salary)\n  FROM employees\n);`) + res(['MAX(salary)'], [['80000']]) + note('The biggest salary smaller than the biggest.')),
      card('3. LIMIT … OFFSET', 'Easy. Needs DISTINCT for ties.', code(`SELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;`) + res(['salary'], [['80000']]) + note('Without <code>DISTINCT</code>, two people on the top salary would make the "second" row still the top salary.'))
    ) +
    callout('Who has it?', 'To get the <em>names</em>, use the DENSE_RANK version and select <code>name, salary</code> where <code>r = 2</code>. It returns Ravi and Meena, since both earn 80000.', 'green') +

    `<h4 class="jh4">Top N per group: top 2 earners in each department</h4>` +
    cols(2,
      card('The pattern', 'Number the rows inside each group, then keep the first N.',
        code(`SELECT name, dept, salary, rn\nFROM (\n  SELECT name, dept, salary,\n    ROW_NUMBER() OVER (\n      PARTITION BY dept\n      ORDER BY salary DESC, name\n    ) AS rn\n  FROM employees\n) t\nWHERE rn <= 2;`) +
        `<ol class="tv-steps"><li>Number rows inside each department, highest salary first (<code>ROW_NUMBER … PARTITION BY dept</code>).</li><li>Wrap that in a subquery or CTE.</li><li>Filter <code>rn &lt;= 2</code> in the outer query.</li></ol>`),
      card('Result', '',
        res(['name', 'dept', 'salary', 'rn'], [['Asha', 'Eng', '90000', '1'], ['Meena', 'Eng', '80000', '2'], ['Divya', 'Sales', '70000', '1'], ['Neha', 'Sales', '70000', '2'], ['Sana', 'HR', '65000', '1'], ['Arjun', 'HR', '50000', '2']]) +
        callout('Two things to remember', '<strong>1.</strong> You cannot filter on a window function in the same <code>WHERE</code>, so the subquery or CTE is required. <strong>2.</strong> <code>ROW_NUMBER</code> gives <em>exactly</em> N rows per group. Use <code>RANK</code> or <code>DENSE_RANK</code> if people tied for N should all appear.'))
    ));

  const cheat = sec('a-cheat', 9, 'Cheat sheet', 'Pick the tool from the question.',
    `<div class="jcard">${table(['I need…', 'Use'], [
      ['A value from another query to compare against', 'Subquery in <code>WHERE</code>'],
      ['A comparison that depends on each row\'s own group', 'Correlated subquery, or a window function'],
      ['A long query broken into readable steps', '<code>WITH … AS (…)</code>'],
      ['If-else logic, or a conditional count', '<code>CASE WHEN … THEN … ELSE … END</code>'],
      ['A number for each row in order (unique)', '<code>ROW_NUMBER()</code>'],
      ['Ranking with ties', '<code>RANK()</code> (gaps) or <code>DENSE_RANK()</code> (no gaps)'],
      ['A total or rank per group but all rows kept', '<code>… OVER (PARTITION BY …)</code>'],
      ['The previous or next row\'s value', '<code>LAG()</code> / <code>LEAD()</code>'],
      ['Combine two result sets', '<code>UNION ALL</code> (keep duplicates), <code>UNION</code> (remove), <code>INTERSECT</code> (common)'],
      ['Nth highest', '<code>DENSE_RANK() … = N</code>'],
      ['Top N per group', '<code>ROW_NUMBER() OVER (PARTITION BY …) … WHERE rn &lt;= N</code> in a subquery'],
    ])}</div>`);

  K.add({
    id: 'sql-advanced',
    title: 'Advanced SQL',
    description: 'Level 3: subqueries, CTEs, CASE WHEN, window functions, LAG and LEAD, set operations, second-highest salary and top N per group.',
    intro: page(
      hero({ level: 'Level 3', title: 'Intermediate and advanced SQL', intro: 'These topics separate someone who knows basic SQL from someone ready for backend interviews. Each one is a small idea. Take them one at a time.',
        items: ['Subqueries and correlated subqueries', 'CTEs using WITH', 'CASE WHEN', 'ROW_NUMBER, RANK, DENSE_RANK', 'PARTITION BY, OVER, LAG, LEAD', 'UNION, UNION ALL, INTERSECT', 'Second-highest salary', 'Top N records per group'] }),
      nav(NAV),
      band('Practice data', 'An <code>employees</code> table. Ties are on purpose: Ravi and Meena both earn 80000, Divya and Neha both earn 70000.', tEmp()),
      sub, cte, caseSec, rank, part, lag, setOps, top, cheat),
  });
})();
