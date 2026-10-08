/* Module 1 (Introduction), sub-module 2: Fundamentals.
   Loaded after 01-introduction.js and appended to that module. */
(() => {
  const F = Learn.fig;
  const mod = Learn.modules.find((m) => m.id === 'introduction');
  if (!mod) return;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const h = (t) => `<h4>${t}</h4>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const ia = (t) => `<div class="callout green"><div class="callout-title">Interview answer</div>${p(t)}</div>`;
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  /* Notion-style block: heading, definition, example, "in backend" note, "learn" chips */
  const note = (t, title = 'Note') => `<div class="callout"><div class="callout-title">${title}</div>${p(t)}</div>`;
  const topic = (n, title, def, body, learn) =>
    `<h3>${n}. ${title}</h3>${def}${body || ''}${learn ? `<div class="learn"><b>Learn</b>${learn.map((l) => `<span>${l}</span>`).join('')}</div>` : ''}`;
  const pair = (a, b, c1, c2) => F.flow([{ t: a, c: c1 || 'green' }, { t: b, c: c2 || '' }], { w: 130, gap: 50 });

  const intro =
    `<div class="doc">` +
    `<div class="callout green"><div class="callout-title">Goal</div><p>Be able to <strong>read, understand, write and debug</strong> basic backend code without getting lost. Examples use <strong>JavaScript / Node.js</strong>, which is very common for backend development. The same concepts exist in Python, Java, Go, etc.</p></div>` +

    topic(1, 'Variables',
      p('A <strong>variable is a box that stores information</strong>.'),
      code('const name = "Rahul";\nlet age = 25;\n\nconsole.log(name);\nconsole.log(age);') +
      F.wrap(pair('name', '"Rahul"') + pair('age', '25')) +
      note('You use variables everywhere in backend code: <code>username</code>, <code>email</code>, <code>isActive</code>.', 'In backend') +
      h('Exercise') +
      code('const price = 500;\nconst quantity = 3;\nconst total = price * quantity;\nconsole.log(total); // 1500'),
      ['let', 'const', 'strings', 'numbers', 'booleans', 'null', 'undefined']) +

    topic(2, 'Functions',
      p('A <strong>function is a reusable piece of code that performs a task</strong>. Instead of writing the same code again and again, you write it once and call it.'),
      F.wrap(F.flow([{ t: '10, 20', s: 'Input', c: 'green' }, { t: 'add()' }, { t: '30', s: 'Output', c: 'amber' }], { w: 110 })) +
      code('function add(a, b) {\n  return a + b;\n}\n\nconst result = add(10, 20);\nconsole.log(result); // 30\n\nfunction greet(name) {\n  return `Hello ${name}`;\n}') +
      note('A backend is basically full of functions, for example <code>calculatePrice(price, tax)</code>.', 'In backend'),
      ['parameters', 'arguments', 'return value', 'function call', 'scope', 'arrow functions']) +

    topic(3, 'Conditions & loops',
      p('<strong>Conditions</strong> allow the program to make decisions. <strong>Loops</strong> mean: do this repeatedly. Teach conditions before loops.'),
      code('const age = 20;\n\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}') +
      F.group([
        ['age >= 18 is YES', F.flow([{ t: 'age >= 18 ?', c: 'amber' }, { t: 'Adult', c: 'green' }], { w: 130, gap: 50 })],
        ['age >= 18 is NO', F.flow([{ t: 'age >= 18 ?', c: 'amber' }, { t: 'Minor' }], { w: 130, gap: 50 })],
      ]) +
      note('<code>if (user.isActive) { allowAccess(); } else { denyAccess(); }</code>', 'In backend') +
      h('Loops') +
      code('const users = ["Rahul", "Amit", "John"];\n\nfor (const user of users) {\n  console.log(user);\n}') +
      F.wrap(F.flow([{ t: 'users', s: 'Rahul, Amit, John' }, { t: 'process each', s: 'one by one', c: 'green' }], { w: 150, gap: 50 })),
      ['for', 'while', 'for...of', 'break', 'continue']) +

    topic(4, 'Objects',
      p('An <strong>object stores information using key → value pairs</strong>. Very important for backend development.'),
      code('const user = {\n  name: "Rahul",\n  age: 25,\n  email: "rahul@gmail.com"\n};\n\nconsole.log(user.name);\nconsole.log(user.email);') +
      table(['Key', 'Value'], [['name', 'Rahul'], ['age', '25'], ['email', 'rahul@gmail.com']]) +
      note('Backend APIs constantly work with objects, e.g. <code>{ id: 101, name: "Shoes", price: 1200 }</code>.', 'In backend')) +

    topic(5, 'Classes',
      p('A <strong>class is a blueprint for creating objects</strong>.'),
      F.group([
        ['One class, many objects', F.flow([{ t: 'User class', s: 'Blueprint', c: 'amber' }, { t: 'User #1', s: 'Rahul · 25', c: 'green' }], { w: 130, gap: 50 }) + F.flow([{ t: 'User class', s: 'Blueprint', c: 'amber' }, { t: 'User #2', s: 'Amit · 30', c: 'green' }], { w: 130, gap: 50 })],
      ]) +
      code('class User {\n  constructor(name, email) {\n    this.name = name;\n    this.email = email;\n  }\n\n  greet() {\n    return `Hello ${this.name}`;\n  }\n}\n\nconst user = new User("Rahul", "rahul@gmail.com");\nconsole.log(user.greet());') +
      note('Don\'t overteach initially. Understanding class, constructor, properties, methods, object creation and basic inheritance is enough.', 'Enough for now'),
      ['class', 'constructor', 'properties', 'methods', 'object creation', 'basic inheritance']) +

    topic(6, 'Arrays',
      p('An <strong>array is simply a list of values</strong>. Positions are called indexes and start at 0.'),
      code('const users = ["Rahul", "Amit", "John"];\n\nconsole.log(users[0]); // Rahul\n\nusers.push("Neha");\nusers.pop();\nusers.length;') +
      table(['Index', '0', '1', '2'], [['Value', 'Rahul', 'Amit', 'John']]) +
      p('Very important array methods:') +
      code('const prices = [100, 200, 300];\nconst doubled = prices.map(price => price * 2);\nconsole.log(doubled); // [200, 400, 600]'),
      ['map()', 'filter()', 'find()', 'forEach()', 'reduce()']) +

    topic(7, 'Maps',
      p('A <strong>Map stores key → value relationships</strong>. Useful when you need to quickly find something using a key.'),
      code('const users = new Map();\n\nusers.set(1, "Rahul");\nusers.set(2, "Amit");\n\nconsole.log(users.get(1)); // Rahul') +
      table(['Key', 'Value'], [['1', 'Rahul'], ['2', 'Amit'], ['3', 'John']]) +
      p('Typical keys: <code>User ID → User</code>, <code>Product ID → Product</code>, <code>Session ID → Session</code>.')) +

    topic(8, 'Sets',
      p('A <strong>Set stores unique values</strong>. Useful when you need to remove duplicates.'),
      code('const numbers = new Set();\n\nnumbers.add(10);\nnumbers.add(20);\nnumbers.add(10); // ignored\n\nconsole.log(numbers); // 10, 20') +
      F.wrap(F.flow([{ t: '10, 20, 10, 30, 20', s: 'Input', c: 'amber' }, { t: 'Set', s: '10, 20, 30', c: 'green' }], { w: 170, gap: 50 }))) +

    topic(9, 'Error handling',
      p('Real applications fail sometimes. The database can fail, an API can fail, the user can send invalid data, the network can fail. So developers need to <strong>handle errors properly</strong>.'),
      code('try {\n  const result = riskyOperation();\n  console.log(result);\n} catch (error) {\n  console.log("Something went wrong");\n}') +
      F.group([
        ['It works', F.flow([{ t: 'Code runs' }, { t: 'Continue', c: 'green' }], { w: 130, gap: 50 })],
        ['It fails', F.flow([{ t: 'Code runs' }, { t: 'catch block', c: 'amber' }], { w: 130, gap: 50 })],
      ]) +
      code('function withdraw(balance, amount) {\n  if (amount > balance) {\n    throw new Error("Insufficient balance");\n  }\n  return balance - amount;\n}'),
      ['try', 'catch', 'finally', 'throw', 'Error objects']) +

    topic(10, 'Async programming',
      p('<strong>Extremely important for backend.</strong> Imagine your server asks a database and has to wait 2 seconds. You don\'t want the entire application to freeze. Async programming lets the program <strong>start a task and continue doing other work while waiting for the result</strong>.'),
      code('async function getUser() {\n  const response = await fetch("https://api.example.com/user");\n  const user = await response.json();\n  return user;\n}') +
      F.wrap(F.flow([{ t: 'Request database', c: 'amber' }, { t: 'Do other work' }, { t: 'Database responds', c: 'green' }, { t: 'Continue' }], { w: 130 })) +
      note('You don\'t need to explain the event loop deeply at this stage. Understand <strong>why <code>await</code> exists and what problem async programming solves</strong>.', 'Keep it simple'),
      ['sync vs async', 'Promise', 'async', 'await', 'callbacks', 'error handling with async', 'event loop (basic)']) +

    topic(11, 'File handling',
      p('Backend applications often need to work with files, for example when a user uploads an image or an <code>invoice.pdf</code>.'),
      F.wrap(F.flow([{ t: 'Upload' }, { t: 'Save file', c: 'green' }, { t: 'Read file', c: 'green' }, { t: 'Process file', c: 'amber' }], { w: 120 })) +
      code('const fs = require("fs");\n\nfs.writeFileSync("users.txt", "Rahul");\n\nconst data = fs.readFileSync("users.txt", "utf8");\nconsole.log(data);'),
      ['read file', 'write file', 'update file', 'delete file', 'file paths', 'JSON files', 'async file operations']) +

    topic(12, 'Modules & packages',
      p('As applications become bigger, you don\'t put everything into one file. Split code into <strong>modules</strong>. <strong>Packages</strong> are reusable code written by other developers.'),
      code('project\n├── users.js\n├── products.js\n├── payments.js\n└── server.js') +
      code('// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// server.js\nimport { add } from "./math.js";\nconsole.log(add(10, 20));') +
      F.wrap(F.flow([{ t: 'math.js', s: 'export', c: 'amber' }, { t: 'server.js', s: 'import', c: 'green' }, { t: 'use add()' }], { w: 120 })) +
      code('npm install express\n\nimport express from "express";'),
      ['import', 'export', 'npm', 'package.json', 'dependencies', 'modules']) +

    topic(13, 'OOP basics',
      p('OOP = <strong>Object-Oriented Programming</strong>. Don\'t make it complicated. The basic idea: <strong>put related data + behavior together</strong>.'),
      code('class BankAccount {\n  constructor(balance) {\n    this.balance = balance;\n  }\n\n  deposit(amount) {\n    this.balance += amount;\n  }\n\n  withdraw(amount) {\n    this.balance -= amount;\n  }\n}') +
      table(['BankAccount', ''], [['Data', '<code>balance</code>'], ['Behavior', '<code>deposit()</code>, <code>withdraw()</code>']]) +
      F.wrap(F.flow(['Class', 'Object', 'Properties', 'Methods', 'Encapsulation', 'Inheritance', 'Polymorphism'], { w: 104, gap: 22 })) +
      note('Don\'t spend too much time on advanced OOP. Understanding how classes and objects organize code matters more than memorizing definitions.', 'Keep it simple')) +

    topic(14, 'Basic data structures',
      p('A <strong>data structure is a way of organizing data</strong>. This is where programming starts becoming more powerful.'),
      F.wrap(F.flow(['Array', 'Stack', 'Queue', 'Hash Map', 'Set', 'Linked List', 'Tree', 'Graph'], { w: 92, gap: 18 }), 'Focus on the first four for backend fundamentals.') +
      table(['Structure', 'Rule', 'Example'], [
        ['Array', 'Ordered list: <code>[10, 20, 30, 40]</code>', 'Lists of items'],
        ['Stack', '<strong>Last in → first out</strong>', 'Browser back, undo, function calls'],
        ['Queue', '<strong>First in → first out</strong>', 'User request → queue → worker'],
        ['Hash Map', '<code>userId → user</code>', 'Extremely common in backend systems'],
      ])) +

    topic(15, 'Time & space complexity',
      p('This is basically asking: <strong>how expensive is my code?</strong> It describes how the work grows as the input grows.'),
      code('for (const user of users) {\n  console.log(user);\n}\n\n// 10 users        → 10 operations\n// 1,000 users     → 1,000 operations\n// 1,000,000 users → 1,000,000 operations   =  O(n)') +
      table(['Complexity', 'Meaning'], [
        ['<code>O(1)</code>', 'Constant. Example: <code>users[0]</code>, direct access'],
        ['<code>O(log n)</code>', 'Very efficient'],
        ['<code>O(n)</code>', 'Grows with input. Example: looping over all users'],
        ['<code>O(n log n)</code>', 'Common for efficient sorting'],
        ['<code>O(n²)</code>', 'Can become slow'],
      ]) +
      F.wrap(F.growth())) +

    topic(16, 'Git & GitHub',
      p('<strong>Git</strong> is basically a <strong>history system for your code</strong>. It tracks changes, so if a new version breaks everything you can roll back. <strong>GitHub</strong> is a platform where Git repositories can be stored and collaborated on.'),
      F.wrap(F.flow([{ t: 'Version 1' }, { t: 'Version 2' }, { t: 'Version 3', s: 'rollback here', c: 'green' }, { t: 'Version 4', s: 'broken', c: 'amber' }], { w: 120 })) +
      h('Basic workflow') +
      F.wrap(F.flow([{ t: 'Write code' }, { t: 'git status' }, { t: 'git add', c: 'green' }, { t: 'git commit', c: 'green' }, { t: 'git push', c: 'amber' }, { t: 'GitHub', c: 'gray' }], { w: 96, gap: 26 })) +
      code('git status\ngit add .\ngit commit -m "Add user API"\ngit push') +
      code('git clone\ngit status\ngit add\ngit commit\ngit push\ngit pull\ngit branch\ngit checkout / switch\ngit merge'),
      ['Repository', 'Commit', 'Branch', 'Remote', 'Pull Request', 'Merge Conflict']) +

    `<p class="source">Docs: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener">MDN JavaScript</a> · <a href="https://docs.github.com/en/get-started/git-basics" target="_blank" rel="noopener">GitHub Git basics</a> · <a href="https://docs.github.com/en/get-started/learning-to-code/getting-started-with-git" target="_blank" rel="noopener">Getting started with Git</a></p>` +
    `</div>`;

  mod.sections.push({
    id: 'programming-fundamentals',
    title: 'Fundamentals',
    description: 'The basic language skills needed before APIs, backend logic and databases.',
    intro,
    keyPoints: [
      'Variables store values; functions turn input into output.',
      'Conditions make decisions; loops repeat work.',
      'Objects, arrays, Maps and Sets organize data. Pick the one that fits.',
      'Handle errors with try / catch; use async / await so waiting does not freeze the app.',
      'Complexity tells you how code slows down as data grows.',
      'Git tracks history; GitHub hosts and shares it.',
    ],

    qna: [
      {
        id: 'let-const-var',
        q: 'What is the difference between let, const and var?',
        a:
          table(['Keyword', 'Reassign?', 'Scope'], [
            ['<code>const</code>', 'No', 'Block'],
            ['<code>let</code>', 'Yes', 'Block'],
            ['<code>var</code>', 'Yes', 'Function (older style)'],
          ]) +
          ia('<code>const</code> declares a variable that cannot be reassigned, <code>let</code> declares a reassignable block-scoped variable, and <code>var</code> is the older function-scoped form. Prefer <code>const</code> by default and <code>let</code> when you need to reassign.') +
          p('Note: <code>const</code> stops reassignment, not mutation. A <code>const</code> array can still be pushed to.'),
      },
      {
        id: 'null-vs-undefined',
        q: 'What is the difference between null and undefined?',
        a:
          ul(['<code>undefined</code>: a variable exists but has no value yet.', '<code>null</code>: an intentional "no value" that you assign yourself.']) +
          code('let a;          // undefined\nlet b = null;   // empty on purpose') +
          ia('<code>undefined</code> means a value has not been assigned, while <code>null</code> is an explicit value that represents the intentional absence of a value.'),
      },
      {
        id: 'map-filter-reduce',
        q: 'What is the difference between map, filter and reduce?',
        a:
          table(['Method', 'Returns', 'Example'], [
            ['<code>map</code>', 'New array, same length, each item transformed', '<code>[1,2,3].map(x => x * 2)</code> → <code>[2,4,6]</code>'],
            ['<code>filter</code>', 'New array with only matching items', '<code>[1,2,3].filter(x => x > 1)</code> → <code>[2,3]</code>'],
            ['<code>reduce</code>', 'A single value', '<code>[1,2,3].reduce((a, b) => a + b, 0)</code> → <code>6</code>'],
          ]) +
          p('<code>forEach</code> just runs code for each item and returns nothing. <code>find</code> returns the first match.') +
          ia('<code>map</code> transforms every element, <code>filter</code> keeps the elements that pass a test, and <code>reduce</code> combines all elements into one value.'),
      },
      {
        id: 'array-map-set',
        q: 'When would you use an array, a Map or a Set?',
        a:
          table(['Use', 'When'], [
            ['Array', 'You need an ordered list'],
            ['Map', 'You need quick lookup by key, such as userId → user'],
            ['Set', 'You need unique values or to remove duplicates'],
          ]) +
          ia('Use an array for ordered lists, a Map for key-based lookup, and a Set when each value must be unique.'),
      },
      {
        id: 'sync-vs-async',
        q: 'What is the difference between synchronous and asynchronous code? Why do we need async/await?',
        a:
          ul(['<strong>Synchronous:</strong> one step at a time; each step waits for the previous one.', '<strong>Asynchronous:</strong> start a slow task (database, network, file) and keep working until the result arrives.']) +
          F.wrap(F.flow([{ t: 'Request DB', c: 'amber' }, { t: 'Do other work' }, { t: 'DB responds', c: 'green' }, { t: 'Continue' }], { w: 120 })) +
          p('<code>async</code>/<code>await</code> is a readable way to work with Promises: <code>await</code> pauses that function until the Promise settles, without freezing the whole app.') +
          ia('Asynchronous code lets a program start a long-running task and continue other work while waiting. <code>async</code>/<code>await</code> makes Promise-based code read like normal sequential code.'),
      },
      {
        id: 'error-handling',
        q: 'How do you handle errors in JavaScript?',
        a:
          code('try {\n  const result = riskyOperation();\n} catch (error) {\n  console.log(error.message);\n} finally {\n  // always runs\n}') +
          ul(['<code>throw new Error("...")</code> raises an error yourself.', 'With async code, wrap <code>await</code> calls in <code>try/catch</code>, or use <code>.catch()</code> on a Promise.']) +
          ia('I use <code>try/catch</code> around code that can fail, <code>throw</code> meaningful Error objects for invalid situations, and <code>finally</code> for cleanup. For async code, I use <code>try/catch</code> with <code>await</code>.'),
      },
      {
        id: 'class-object-oop',
        q: 'What is the difference between a class and an object? What is OOP?',
        a:
          p('A <strong>class</strong> is a blueprint; an <strong>object</strong> is one thing created from it with <code>new</code>.') +
          F.wrap(F.flow([{ t: 'User class', s: 'Blueprint', c: 'amber' }, { t: 'User #1', s: 'Rahul', c: 'green' }], { w: 130 }) + '', '') +
          p('OOP means keeping related <strong>data + behavior</strong> together. Core ideas: encapsulation, inheritance, polymorphism.') +
          ia('A class is a blueprint that defines properties and methods, and an object is an instance created from that class. OOP organizes code around objects that combine data and behavior.'),
      },
      {
        id: 'stack-vs-queue',
        q: 'What is the difference between a stack and a queue?',
        a:
          F.group([
            ['Stack (LIFO)', F.flow([{ t: '30', s: 'removed first', c: 'amber' }, { t: '20' }, { t: '10' }], { dir: 'v', w: 150, gap: 14 })],
            ['Queue (FIFO)', F.flow([{ t: '10', s: 'first out', c: 'amber' }, { t: '20' }, { t: '30' }, { t: '40' }], { w: 90, gap: 28 })],
          ]) +
          ul(['Stack: browser back, undo, function calls.', 'Queue: user requests waiting for a worker.']) +
          ia('A stack is last-in, first-out, while a queue is first-in, first-out.'),
      },
      {
        id: 'big-o',
        q: 'What is time complexity (Big O)?',
        a:
          p('It describes how the work your code does <em>grows as the input grows</em>.') +
          code('users[0]                 // O(1)\nfor (const u of users) {} // O(n)') +
          p('10 users → 10 operations. 1,000,000 users → 1,000,000 operations. That is <code>O(n)</code>.') +
          ia('Time complexity expresses how an algorithm\'s running time grows relative to input size, written in Big O notation such as O(1), O(n) or O(n²).'),
      },
      {
        id: 'git-add-commit-push',
        q: 'What is the difference between git add, git commit and git push?',
        a:
          F.wrap(F.flow([{ t: 'git add', s: 'Stage changes', c: 'green' }, { t: 'git commit', s: 'Save locally', c: 'green' }, { t: 'git push', s: 'Send to GitHub', c: 'amber' }], { w: 130 })) +
          ul(['<code>git add</code>: choose which changes go into the next commit.', '<code>git commit</code>: save a snapshot in your local history.', '<code>git push</code>: upload your commits to the remote (GitHub).']) +
          ia('<code>git add</code> stages changes, <code>git commit</code> records them in the local repository, and <code>git push</code> uploads those commits to a remote repository such as GitHub.'),
      },
    ],

    notes: [],

    quiz: [
      { q: 'What does this print? <code>const price = 500; const quantity = 3; console.log(price * quantity);</code>', options: ['1500', '503', '5003', 'An error'], answer: 0, explain: 'Multiplication of two numbers: 500 × 3 = 1500.' },
      { q: 'Which keyword declares a variable that cannot be reassigned?', options: ['let', 'const', 'var', 'new'], answer: 1, explain: '<code>const</code> prevents reassignment.' },
      { q: 'What is the value of a variable that is declared but never assigned?', options: ['null', '0', 'undefined', 'An empty string'], answer: 2, explain: 'It is <code>undefined</code>. <code>null</code> must be assigned on purpose.' },
      { q: 'For <code>function add(a, b)</code>, what are <code>10</code> and <code>20</code> in <code>add(10, 20)</code>?', options: ['Arguments', 'Parameters', 'Return values', 'Scopes'], answer: 0, explain: 'a and b are parameters; the values you pass in are arguments.' },
      { q: 'Which structure lets a program make decisions?', options: ['A loop', 'An if / else condition', 'An array', 'A class'], answer: 1, explain: 'Conditions choose between paths; loops repeat.' },
      { q: 'What does <code>for (const user of users)</code> do?', options: ['Declares a class', 'Stops the program', 'Runs the block once for each item in users', 'Sorts users'], answer: 2, explain: 'for...of iterates over each item.' },
      { q: 'Which pair is used to share code between files with ES modules?', options: ['import / export', 'push / pop', 'try / catch', 'get / set'], answer: 0, explain: '<code>export</code> in one file, <code>import</code> in another.' },
      { q: 'What does <code>user.name</code> do for <code>const user = { name: "Rahul" }</code>?', options: ['Reads the value stored under the key name', 'Reads an array index', 'Calls a function', 'Creates a class'], answer: 0, explain: 'Objects store key → value pairs; dot notation reads a value.' },
      { q: 'A class is best described as…', options: ['A list of values', 'A blueprint for creating objects', 'A loop', 'An error'], answer: 1, explain: 'Objects are created from a class with <code>new</code>.' },
      { q: 'What is <code>[100, 200, 300].map(p => p * 2)</code>?', options: ['[200, 400, 600]', '600', '[100, 200, 300]', 'undefined'], answer: 0, explain: '<code>map</code> returns a new array with each item transformed.' },
      { q: 'Which array method returns only the items that match a condition?', options: ['map', 'filter', 'reduce', 'push'], answer: 1, explain: '<code>filter</code> keeps the items that pass the test.' },
      { q: 'What does a Set contain after <code>add(10)</code>, <code>add(20)</code>, <code>add(10)</code>?', options: ['10, 20, 10', '10, 20', 'Only 10', 'Only 20'], answer: 1, explain: 'A Set keeps unique values; the second 10 is ignored.' },
      { q: 'When is a Map the best choice?', options: ['Quick lookup by key, like userId → user', 'Removing duplicates', 'Repeating code', 'Defining a blueprint'], answer: 0, explain: 'Maps store key → value relationships.' },
      { q: 'Which block always runs, whether or not an error happened?', options: ['try', 'catch', 'finally', 'throw'], answer: 2, explain: '<code>finally</code> is used for cleanup.' },
      { q: 'Which keyword raises an error manually?', options: ['catch', 'throw', 'await', 'export'], answer: 1, explain: '<code>throw new Error("...")</code>.' },
      { q: 'What problem does async programming solve?', options: ['The app freezing while waiting for slow work like a database or network call', 'Making CSS faster', 'Typing less code', 'Avoiding variables'], answer: 0, explain: 'Async lets the program keep working while waiting.' },
      { q: 'Which keyword marks a function so you can use <code>await</code> inside it?', options: ['async', 'defer', 'promise', 'static'], answer: 0, explain: '<code>async function</code> allows <code>await</code>.' },
      { q: 'A stack follows which rule?', options: ['First in, first out', 'Last in, first out', 'Random order', 'Sorted order'], answer: 1, explain: 'LIFO. Queues are FIFO.' },
      { q: 'What is the time complexity of looping once over n users?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explain: 'The work grows in direct proportion to n.' },
      { q: 'Which git command saves a snapshot of staged changes in your local history?', options: ['git push', 'git commit', 'git pull', 'git clone'], answer: 1, explain: '<code>git commit</code> records the snapshot; <code>git push</code> uploads it.' },
    ],
  });
})();
