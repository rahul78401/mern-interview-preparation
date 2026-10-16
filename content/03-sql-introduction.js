/* SQL module, sub-module 1: Introduction (what, why, who, how).
   Loaded after 02-outline.js, which registers the empty SQL module. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'sql');
  if (!mod) return;
  mod.unlocked = true;   // modules are locked by default (see app.js)

  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const ol = (a) => `<ol>${a.map((i) => `<li>${i}</li>`).join('')}</ol>`;
  const h = (t) => `<h4>${t}</h4>`;
  const ia = (t) => `<div class="callout green"><div class="callout-title">Interview answer</div>${p(t)}</div>`;
  const rem = (t) => `<div class="callout amber"><div class="callout-title">Remember</div>${p(t)}</div>`;
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const F = Learn.fig;
  const fig = (nodes, cap, o) => (F ? F.wrap(F.flow(nodes, o), cap) : '');

  const intro =
    `<div class="doc">` +
    `<div class="callout green"><div class="callout-title">Learn the thinking before the commands</div><p>This page explains <strong>why SQL exists</strong>, who created it and how a database works. No queries yet.</p></div>` +

    `<h3>1. What is SQL?</h3>` +
    p('SQL stands for <strong>Structured Query Language</strong>. It is the language we use to talk to a database: what we want to read, what we want to save, and how we want to change or organize it.') +
    p('Imagine <strong>AddressBox</strong>, a real-estate app. It must remember users and phone numbers, properties and prices, owners, customer inquiries, messages and notifications. All of that lives in a database.') +
    fig([{ t: 'AddressBox', s: 'Backend API', c: 'green' }, { t: 'SQL' }, { t: 'Database', s: 'e.g. PostgreSQL', c: 'gray' }], 'The backend sends SQL; the database stores and returns the data.', { bidir: true, w: 150 }) +
    p('The backend might need to:') +
    ul(['Find all properties in Ahmedabad.', 'Save a new user\'s details.', 'Change a property\'s price.', 'Delete an inquiry that should no longer exist.']) +
    table(['Term', 'What it is'], [
      ['<strong>SQL</strong>', 'The language'],
      ['<strong>PostgreSQL / MySQL</strong>', 'Database management systems that understand SQL'],
      ['<strong>Database</strong>', 'The organized collection of stored information'],
      ['<strong>Backend</strong>', 'The application code that handles requests and talks to the database'],
    ]) +

    `<h3>2. Why was SQL created?</h3>` +
    p('Imagine a company storing one million customers in text files or spreadsheets. Problems appear quickly:') +
    ol([
      'Finding one customer among millions is slow and hard.',
      'Two customers can accidentally get the same ID.',
      'Different employees update the same information incorrectly.',
      'A computer crash can interrupt a data update halfway.',
      'Finding customers who match several conditions gets complicated.',
    ]) +
    p('People needed a better way to store, retrieve and manage large amounts of structured information. The answer was <strong>relational databases</strong>: organize data into related tables, and give people a language to work with them.') +

    `<h3>3. Who created SQL?</h3>` +
    table(['Who', 'Contribution'], [
      ['<strong>Edgar F. Codd</strong> (1970)', 'Proposed the relational model: organizing data into relations, which inspired relational databases.'],
      ['<strong>Donald Chamberlin &amp; Raymond Boyce</strong> (IBM, 1970s)', 'Developed SEQUEL, the predecessor of SQL, to work with relational data.'],
    ]) +
    p('No single person wrote all of SQL. Researchers, database companies and standards bodies improved it over time. <strong>ANSI and ISO</strong> standardized it, so different databases share a common language.') +

    `<h3>4. Why is it called a relational database?</h3>` +
    p('Data is stored in <strong>tables</strong> that connect through <strong>relationships</strong>. Take an online shop:') +
    `<div style="display:flex;flex-wrap:wrap;gap:24px">` +
    `<div><strong>Customers</strong>${table(['customer_id', 'name'], [['101', 'Rahul'], ['102', 'Amit']])}</div>` +
    `<div><strong>Orders</strong>${table(['order_id', 'customer_id', 'amount'], [['501', '101', '₹2,000'], ['502', '101', '₹500'], ['503', '102', '₹1,200']])}</div>` +
    `</div>` +
    p('<code>customer_id</code> in Orders points to the customer who placed the order. Rahul\'s name is <em>not</em> repeated in every order; each order just refers to <code>customer_id = 101</code>.') +
    p('That lets us answer: who placed order 501, how many orders Rahul placed, how much he spent, and which customers have not ordered at all.') +

    `<h3>5. Database vs Excel sheet</h3>` +
    table(['Feature', 'Spreadsheet', 'Relational database'], [
      ['Store rows and columns', 'Yes', 'Yes'],
      ['Connect related data', 'Possible, often manual', 'Built-in relationships'],
      ['Many concurrent users', 'Limited', 'Designed for it'],
      ['Enforce data rules', 'Some support', 'Strong constraints and validation'],
      ['Transactions', 'Limited', 'Built-in'],
      ['Search and combine large data', 'Gets cumbersome', 'Designed for efficient querying'],
    ]) +
    p('With 500 salespeople using a CRM at once, one person\'s update must not overwrite another\'s work, and searches must stay fast and consistent. That is where a real database becomes essential.') +

    `<h3>6. What happens when you use SQL?</h3>` +
    p('A customer searches for properties in Ahmedabad:') +
    fig([{ t: 'User', s: 'searches' }, { t: 'Backend', s: 'business rules', c: 'amber' }, { t: 'Database', s: 'runs the query', c: 'gray' }, { t: 'Results', s: 'to backend' }, { t: 'User', s: 'sees properties', c: 'green' }], 'The backend builds the database operation; the database executes it.', { w: 128, gap: 32 }) +
    p('The database does not magically know what the user wants. In NestJS this may be raw SQL or an ORM such as Sequelize, Prisma or TypeORM, which generates SQL for you.') +

    `<h3>7. Why different database technologies?</h3>` +
    table(['Database', 'What it is'], [
      ['<strong>PostgreSQL</strong>', 'Relational. SQL, relationships, transactions, indexes, advanced types. Vector search via the pgvector extension.'],
      ['<strong>MySQL</strong>', 'Relational. Common for web apps and business systems.'],
      ['<strong>MongoDB</strong>', 'Document database. Stores JSON-like documents instead of relational tables.'],
      ['<strong>SQLite</strong>', 'Small relational database stored in a single file; good for local and embedded use.'],
    ]) +
    p('Different apps need different things: relationships, consistency, flexible structure, search speed, scale. SQL is not a database; PostgreSQL and MySQL implement it, while MongoDB mainly uses a different query interface.') +

    `<h3>8. What is inside a database?</h3>` +
    table(['Component', 'Job'], [
      ['Parser', 'Checks the instruction has valid syntax'],
      ['Query planner / optimizer', 'Chooses an efficient way to get or change the data'],
      ['Execution engine', 'Carries out the chosen plan'],
      ['Storage engine', 'Manages how data is stored and retrieved'],
      ['Transactions &amp; concurrency', 'Keep data correct when operations overlap'],
      ['Indexes', 'Faster ways to locate records'],
      ['Logging &amp; recovery', 'Survive crashes and keep data durable'],
    ]) +
    p('With 20 million property records, finding one should not mean reading every row; an index helps. The database also copes with a crash mid-update and two users editing the same record. That is why database engineering is a whole field.') +

    `<h3>9. The four things a database must do (CRUD)</h3>` +
    table(['Operation', 'Meaning', 'Example'], [
      ['<strong>C</strong>reate', 'Save new data', 'A new user or inquiry'],
      ['<strong>R</strong>ead', 'Find data', 'Search properties'],
      ['<strong>U</strong>pdate', 'Change data', 'A price or inquiry status'],
      ['<strong>D</strong>elete', 'Remove data, if retention rules allow', 'Remove an old record'],
    ]) +
    p('The syntax comes later. For now, know what each one is for.') +

    `<h3>10. The takeaway</h3>` +
    p('SQL exists because applications need a <strong>reliable, structured and efficient</strong> way to work with data. You say <em>what</em> you want; the database decides <em>how</em>, while handling storage, speed, consistency and concurrent access.') +
    p('For a 1 to 2 year SDE role, think beyond memorizing commands. Be able to reason about:') +
    ul([
      'How data should be organized.',
      'How tables relate to each other.',
      'How to retrieve the right information.',
      'How to prevent incorrect or inconsistent data.',
      'How databases run operations efficiently.',
      'How applications safely read and update data.',
    ]) +
    `<div class="callout amber"><div class="callout-title">Next topic</div><p>How a database is structured: tables, rows, columns, data types, primary keys, foreign keys, constraints and relationships.</p></div>` +
    `</div>`;

  mod.sections.unshift({
    id: 'sql-introduction',
    title: 'Introduction',
    description: 'What SQL is, why it was created, who made it, and how databases work, before writing any query.',
    intro,
    keyPoints: [
      'SQL is the language; PostgreSQL and MySQL are databases that understand it.',
      'SQL exists because files and spreadsheets break down at scale: slow search, duplicate IDs, bad concurrent updates, crashes.',
      'Relational = tables connected by keys, so data is stored once and referenced.',
      'Codd proposed the relational model (1970); Chamberlin and Boyce at IBM built SEQUEL, which became SQL.',
      'A database is more than a file: parser, planner, storage engine, transactions, indexes and recovery.',
      'Everything is CRUD: Create, Read, Update, Delete.',
    ],
    tip: 'You say what data you want; the database decides how to get it.',

    qna: [
      {
        id: 'what-is-sql',
        q: '1. What is SQL?',
        a:
          h('Simple explanation') +
          p('SQL (Structured Query Language) is the language used to communicate with a relational database: to read, save, change and organize data.') +
          h('Do not mix these up') +
          ul(['<strong>SQL</strong>: the language', '<strong>PostgreSQL / MySQL</strong>: database systems that understand SQL', '<strong>Database</strong>: the stored, organized data', '<strong>Backend</strong>: code that receives requests and talks to the database']) +
          ia('SQL is the standard language for working with relational databases. The backend uses it to ask the database for data or to store and change data.'),
      },
      {
        id: 'why-sql-created',
        q: '2. Why was SQL created? What problem does it solve?',
        a:
          p('Before databases, companies used text files and spreadsheets. At scale these fail:') +
          ul(['Finding one record among millions is hard', 'Duplicate IDs', 'Conflicting updates from different people', 'Crashes leave updates half-done', 'Multi-condition searches are complicated']) +
          ia('Relational databases and SQL give a structured, efficient and consistent way to store, find and change large amounts of data, even with many users at once.'),
      },
      {
        id: 'who-created-sql',
        q: '3. Who created SQL?',
        a:
          ul(['<strong>Edgar F. Codd</strong> proposed the relational model in 1970.', '<strong>Donald Chamberlin and Raymond Boyce</strong> (IBM, 1970s) developed SEQUEL, the predecessor of SQL.']) +
          p('SQL was then improved by many companies and standardized by <strong>ANSI and ISO</strong>.') +
          rem('Do not say one person invented all of SQL.'),
      },
      {
        id: 'what-is-relational-db',
        q: '4. What is a relational database?',
        a:
          p('A database that stores data in tables and connects them through relationships. For example, an <code>orders</code> table holds a <code>customer_id</code> that points to a row in <code>customers</code>.') +
          p('The customer\'s name is stored once, not repeated in every order. This avoids duplication and lets you ask questions across tables, such as how many orders a customer placed.') +
          ia('A relational database organizes data into related tables. Rows in one table refer to rows in another using keys, so data is stored once and combined when needed.'),
      },
      {
        id: 'db-vs-excel',
        q: '5. How is a database different from an Excel sheet?',
        a:
          p('Both show rows and columns. A database adds:') +
          ul(['Built-in relationships between tables', 'Safe access for many concurrent users', 'Strong constraints and validation', 'Transactions', 'Efficient search over very large data']) +
          ia('A spreadsheet stores data. A database also protects it: it enforces rules, handles many users at once, supports transactions and searches large data efficiently.'),
      },
      {
        id: 'how-app-uses-sql',
        q: '6. How does an application use SQL?',
        a:
          ol(['The user sends a request (for example, search properties in Ahmedabad).', 'The backend receives it and applies business rules.', 'The backend builds a database operation.', 'The database executes it and returns results.', 'The backend sends the response to the user.']) +
          p('In NestJS this can be raw SQL, or an ORM such as Sequelize, Prisma or TypeORM that generates the SQL.'),
      },
      {
        id: 'sql-vs-nosql-dbs',
        q: '7. PostgreSQL vs MySQL vs MongoDB vs SQLite: why so many?',
        a:
          ul(['<strong>PostgreSQL</strong>: relational, rich features, extensions such as pgvector', '<strong>MySQL</strong>: relational, popular for web apps', '<strong>MongoDB</strong>: stores JSON-like documents, flexible structure', '<strong>SQLite</strong>: relational, single-file, lightweight']) +
          ia('Different apps need different trade-offs: relationships and consistency, flexible documents, speed, scale or simplicity. SQL is a language, not a database; PostgreSQL and MySQL implement it.'),
      },
      {
        id: 'inside-a-database',
        q: '8. What happens inside a database when it receives a query?',
        a:
          ol(['The <strong>parser</strong> checks the syntax.', 'The <strong>planner/optimizer</strong> picks an efficient plan (for example, using an index).', 'The <strong>execution engine</strong> runs the plan.', 'The <strong>storage engine</strong> reads or writes the data.', 'Transaction, concurrency and logging systems keep it correct and recoverable.']) +
          rem('Do not say a database is "just a file with rows". Indexes, transactions and recovery are what make it a database.'),
      },
      {
        id: 'what-is-crud',
        q: '9. What is CRUD?',
        a:
          p('<strong>C</strong>reate, <strong>R</strong>ead, <strong>U</strong>pdate, <strong>D</strong>elete: the four basic operations on data.') +
          ul(['Create: save a new user or inquiry', 'Read: search properties', 'Update: change a price or status', 'Delete: remove a record, if retention rules permit']),
      },
      {
        id: 'why-index',
        q: '10. Why does a database use indexes?',
        a:
          p('With millions of rows, checking every row to find one is slow. An index gives the database a faster way to locate matching records, like the index at the back of a book.') +
          ia('An index lets the database find rows without scanning the whole table, which makes searches much faster.'),
      },
    ],

    notes: [
      {
        id: 'sql-quick-recap',
        title: 'Quick note: SQL in one minute',
        date: '2026-10-16',
        tags: ['sql', 'recap'],
        body:
          p('<strong>SQL</strong> is the language. <strong>PostgreSQL/MySQL</strong> are the databases. The <strong>backend</strong> sends SQL; the database stores and returns data.') +
          p('Databases beat files and spreadsheets on: fast search, unique IDs, safe concurrent updates, crash recovery, enforced rules.') +
          p('<strong>Relational</strong> = tables connected by keys. <strong>CRUD</strong> = Create, Read, Update, Delete.'),
      },
      {
        id: 'sql-dont-say',
        title: 'Quick note: things not to say in an interview',
        date: '2026-10-16',
        tags: ['sql', 'interview'],
        body: ul([
          '"SQL is a database." It is a language.',
          '"One person invented SQL." Codd, Chamberlin, Boyce and standards bodies all contributed.',
          '"A database is just a file." It has a planner, indexes, transactions and recovery.',
          '"A database is just a bigger Excel." Constraints, concurrency and transactions are the difference.',
        ]),
      },
    ],

    quiz: [
      {
        q: 'What does SQL stand for?',
        options: ['Simple Query Logic', 'Structured Query Language', 'Standard Question List', 'Sequential Query Layer'],
        answer: 1,
        explain: 'SQL is Structured Query Language, the language used to talk to relational databases.',
      },
      {
        q: 'Which of these is a database management system, not a language?',
        options: ['SQL', 'PostgreSQL', 'CRUD', 'SEQUEL'],
        answer: 1,
        explain: 'PostgreSQL is a database system that understands SQL. SQL itself is the language.',
      },
      {
        q: 'Who proposed the relational model in 1970?',
        options: ['Edgar F. Codd', 'Donald Chamberlin', 'Raymond Boyce', 'Linus Torvalds'],
        answer: 0,
        explain: 'Codd proposed the relational model. Chamberlin and Boyce developed SEQUEL at IBM.',
      },
      {
        q: 'In the Orders table, why store customer_id instead of the customer name?',
        options: ['Numbers are always faster to print', 'So the name is stored once and referenced', 'Names are not allowed in tables', 'SQL cannot store text'],
        answer: 1,
        explain: 'Relationships let each order refer to a customer, avoiding repeated data.',
      },
      {
        q: 'Which problem do databases solve better than spreadsheets?',
        options: ['Many users editing at once safely', 'Drawing charts', 'Printing reports', 'Choosing fonts'],
        answer: 0,
        explain: 'Databases are built for concurrent access, constraints and transactions.',
      },
      {
        q: 'Which component picks an efficient way to run a query?',
        options: ['Parser', 'Query planner / optimizer', 'Storage engine', 'Frontend'],
        answer: 1,
        explain: 'The planner/optimizer chooses the plan; the parser only checks syntax.',
      },
      {
        q: 'What does the R in CRUD stand for?',
        options: ['Remove', 'Replace', 'Read', 'Relate'],
        answer: 2,
        explain: 'CRUD = Create, Read, Update, Delete.',
      },
      {
        q: 'Why is an index useful?',
        options: ['It encrypts data', 'It lets the database find rows without scanning every row', 'It deletes duplicates', 'It backs up the database'],
        answer: 1,
        explain: 'Indexes give the database a faster path to matching records.',
      },
    ],
  });
})();
