/* Node.js module: 12 sub-modules, each with overview, Q&A, notes and a quiz.
   The module itself is registered (empty) in 02-outline.js; this file fills it and unlocks it. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'nodejs');
  if (!mod) return;
  mod.unlocked = true;
  mod.added = '2026-11-12';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const c = (s) => `<pre><code>${esc(s.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`;
  const k = (s) => `<code>${esc(s)}</code>`;
  const slug = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const mk = (title, o) => ({ id: slug(title), title, ...o });

  const sections = [];

  /* ------------------------------------------------------------------ 1 */
  sections.push(mk('What is Node.js', {
    description: 'What Node.js is, what it is good at, and when not to use it.',
    intro:
      `<p><strong>Node.js</strong> is a program that runs JavaScript <em>outside the browser</em>, for example on a server or in your terminal. It is not a language and not a framework. It is a <strong>runtime</strong>: the thing that reads your JavaScript and runs it.</p>` +
      `<p>Node.js uses Chrome's V8 engine to run the code, and adds extras a browser does not have: reading files, opening network ports, talking to databases, and reading environment variables.</p>` +
      c(`// hello.js
console.log('Hello from Node');
// run it:  node hello.js`) +
      `<p>Node.js is great for <strong>I/O-heavy</strong> work: APIs, chat apps, streaming, proxies, tools. It handles thousands of waiting connections on one thread because it does not block while it waits for the database or the network.</p>` +
      `<p>It is a weaker fit for <strong>CPU-heavy</strong> work (video encoding, big maths) on the main thread, because one long calculation blocks every other request. For that, use worker threads or another service.</p>`,
    keyPoints: [
      'Node.js = a JavaScript runtime built on the V8 engine.',
      'Same language on the frontend and backend.',
      'Single-threaded JavaScript with non-blocking I/O.',
      'Great for APIs and real-time apps, not for heavy CPU work on the main thread.',
    ],
    tip: 'In an interview, never say "Node.js is a language" or "Node.js is a framework". Say "a runtime".',
    qna: [
      { id: 'what-is-node', q: 'What is Node.js?', a: `<p>Node.js is an open-source <strong>JavaScript runtime</strong> built on Chrome's V8 engine. It lets you run JavaScript on a server or computer, not only in a browser. It adds APIs for files, network, processes and more.</p>` },
      { id: 'node-vs-browser', q: 'What is the difference between Node.js and the browser?', a: `<p>Both run JavaScript with an engine, but the extras are different.</p><ul><li><strong>Browser:</strong> has ${k('window')}, ${k('document')}, the DOM, ${k('localStorage')}.</li><li><strong>Node.js:</strong> has ${k('fs')}, ${k('http')}, ${k('process')}, ${k('Buffer')}. No DOM.</li></ul><p>In Node the global object is ${k('globalThis')} (older code uses ${k('global')}).</p>` },
      { id: 'single-thread', q: 'Is Node.js single-threaded?', a: `<p>Your JavaScript runs on <strong>one main thread</strong>. But Node.js itself is not fully single-threaded: libuv keeps a <strong>thread pool</strong> (4 threads by default) for things like file system, DNS and crypto, and the OS handles network sockets. So I/O happens in parallel while your JS code stays on one thread.</p>` },
      { id: 'when-use', q: 'When should you use Node.js, and when not?', a: `<p><strong>Good for:</strong> REST and GraphQL APIs, real-time apps (chat, notifications), streaming, microservices, CLI tools.</p><p><strong>Not ideal for:</strong> CPU-heavy tasks (image/video processing, machine learning) on the main thread, because they block the event loop. Use worker threads, a queue with workers, or a different language for those parts.</p>` },
      { id: 'node-versions', q: 'What is an LTS version?', a: `<p><strong>LTS</strong> means Long Term Support. Even-numbered Node versions (20, 22, 24) become LTS and get bug and security fixes for about 30 months. Use an LTS version in production. Odd-numbered versions are short-lived.</p>` },
    ],
    quiz: [
      { q: 'What is Node.js?', options: ['A programming language', 'A JavaScript runtime built on V8', 'A web framework like Express', 'A database'], answer: 1, explain: 'Node.js is a runtime. It runs JavaScript using the V8 engine and adds server features such as files and networking.' },
      { q: 'Which task is Node.js weakest at on its main thread?', options: ['Serving a REST API', 'Streaming files', 'Heavy CPU calculations', 'Handling many websocket connections'], answer: 2, explain: 'A long CPU calculation blocks the event loop, so all other requests wait. I/O-heavy work is where Node shines.' },
      { q: 'Which of these exists in Node.js but NOT in the browser?', options: ['fetch', 'setTimeout', 'The fs module', 'console.log'], answer: 2, explain: 'The fs (file system) module is Node-only. fetch, setTimeout and console exist in both (fetch is built into Node 18+).' },
      { q: 'Which Node.js versions are LTS (Long Term Support)?', options: ['Odd numbers (21, 23)', 'Even numbers (20, 22, 24)', 'Only version 10', 'All versions'], answer: 1, explain: 'Even-numbered releases become LTS. Use them in production.' },
    ],
  }));

  /* ------------------------------------------------------------------ 2 */
  sections.push(mk('How Node.js Works (V8 & libuv)', {
    description: 'V8, libuv, the event loop, the thread pool and the order things run in.',
    intro:
      `<p>Node.js is built from a few parts working together:</p>` +
      `<ul><li><strong>V8</strong>: Google's engine. It turns your JavaScript into machine code and runs it.</li><li><strong>libuv</strong>: a C library that gives Node its <strong>event loop</strong>, its <strong>thread pool</strong>, and non-blocking file, network and timer handling.</li><li><strong>Node APIs</strong>: ${k('fs')}, ${k('http')}, etc. They connect your JS to libuv.</li></ul>` +
      `<h3>The event loop in one picture</h3>` +
      `<p>Your code runs on the main thread. When you ask for something slow (read a file, call a database), Node hands it to libuv and moves on. When the slow thing finishes, its callback is put in a queue. The <strong>event loop</strong> picks callbacks from the queue and runs them when the main thread is free.</p>` +
      `<h3>The phases (simplified)</h3>` +
      `<ol><li><strong>timers</strong>: ${k('setTimeout')}, ${k('setInterval')} callbacks</li><li><strong>poll</strong>: I/O callbacks (network, files)</li><li><strong>check</strong>: ${k('setImmediate')} callbacks</li><li><strong>close</strong>: close events</li></ol>` +
      `<p>Between every callback Node empties two <strong>microtask queues</strong>: first ${k('process.nextTick')}, then Promise callbacks (${k('.then')}, ${k('await')}).</p>` +
      c(`console.log('1 start');
setTimeout(() => console.log('5 timeout'), 0);
setImmediate(() => console.log('6 immediate'));
Promise.resolve().then(() => console.log('4 promise'));
process.nextTick(() => console.log('3 nextTick'));
console.log('2 end');
// order: 1 start, 2 end, 3 nextTick, 4 promise, then timeout / immediate`),
    keyPoints: [
      'V8 runs JavaScript. libuv does the event loop and async I/O.',
      'The main thread never waits: slow work is handed off and a callback runs later.',
      'Order: sync code, then nextTick, then promises, then timers / I/O / setImmediate.',
      'Blocking the main thread blocks every request.',
    ],
    tip: 'A classic interview question: "What runs first, setTimeout 0, setImmediate, nextTick or a Promise?" Answer: nextTick, then Promise, then the timer or setImmediate.',
    qna: [
      { id: 'v8-libuv', q: 'What are V8 and libuv?', a: `<p><strong>V8</strong> is the JavaScript engine from Chrome. It compiles and runs JS. <strong>libuv</strong> is a C library that provides the event loop, the thread pool and cross-platform async I/O. V8 runs your code; libuv handles the waiting.</p>` },
      { id: 'event-loop', q: 'Explain the event loop.', a: `<p>The event loop is a loop that checks queues of finished async tasks and runs their callbacks, one at a time, on the main thread. It lets Node handle many operations without waiting for each one. The main phases are timers, poll (I/O), check (${k('setImmediate')}) and close callbacks.</p>` },
      { id: 'nexttick-vs-promise', q: 'What is the difference between process.nextTick and a Promise callback?', a: `<p>Both are microtasks that run right after the current operation, before the event loop moves on. ${k('process.nextTick')} runs <strong>first</strong>, then Promise callbacks. Avoid calling ${k('nextTick')} in a loop: it can starve the event loop because I/O never gets a turn.</p>` },
      { id: 'timeout-vs-immediate', q: 'setTimeout(fn, 0) vs setImmediate(fn): which runs first?', a: `<p>From the main module the order is <strong>not guaranteed</strong>, it depends on process speed. Inside an I/O callback, ${k('setImmediate')} always runs first, because the check phase comes right after the poll phase.</p>` },
      { id: 'thread-pool', q: 'What is the libuv thread pool and what uses it?', a: `<p>A pool of <strong>4 threads</strong> by default (change with ${k('UV_THREADPOOL_SIZE')}). It runs work that has no non-blocking OS API: <em>file system calls, DNS lookup (${k('dns.lookup')}), crypto (${k('pbkdf2')}, ${k('scrypt')}), zlib</em>. Network sockets do not use it; the OS notifies libuv directly.</p>` },
      { id: 'blocking', q: 'What does "blocking the event loop" mean?', a: `<p>It means running a long synchronous task (a huge loop, ${k('JSON.parse')} of a giant string, ${k('fs.readFileSync')} on a big file) on the main thread. While it runs, no other request or callback can run. Fix it by using async APIs, streams, splitting the work, or worker threads.</p>` },
    ],
    quiz: [
      { q: 'Which part of Node.js provides the event loop?', options: ['V8', 'libuv', 'npm', 'Express'], answer: 1, explain: 'libuv provides the event loop, thread pool and async I/O. V8 only runs JavaScript.' },
      { q: 'What is the output order? console.log("A"); Promise.resolve().then(()=>console.log("B")); process.nextTick(()=>console.log("C")); console.log("D");', options: ['A, B, C, D', 'A, D, C, B', 'A, D, B, C', 'D, A, C, B'], answer: 1, explain: 'Sync code first (A, D). Then nextTick (C), then the Promise callback (B).' },
      { q: 'How many threads are in the libuv thread pool by default?', options: ['1', '2', '4', '16'], answer: 2, explain: 'Four threads by default. You can change it with UV_THREADPOOL_SIZE.' },
      { q: 'Which of these uses the libuv thread pool?', options: ['Incoming HTTP connections', 'fs.readFile', 'setTimeout', 'Promise.resolve'], answer: 1, explain: 'File system calls run in the thread pool. Sockets are handled by the OS and timers by the loop itself.' },
    ],
  }));

  /* ------------------------------------------------------------------ 3 */
  sections.push(mk('Modules: CommonJS vs ESM', {
    description: 'require / module.exports versus import / export, and how to choose.',
    intro:
      `<p>A <strong>module</strong> is just a file that shares some code with other files. Node.js supports two module systems.</p>` +
      `<h3>CommonJS (CJS), the original</h3>` + c(`// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require('./math');
console.log(add(2, 3));`) +
      `<h3>ES Modules (ESM), the standard</h3>` + c(`// math.mjs
export function add(a, b) { return a + b; }

// app.mjs
import { add } from './math.mjs';
console.log(add(2, 3));`) +
      `<p>Node decides which system a file uses by: the extension (${k('.cjs')} = CommonJS, ${k('.mjs')} = ESM), or for ${k('.js')} files the ${k('"type"')} field in the nearest ${k('package.json')} (${k('"module"')} for ESM, default is CommonJS).</p>` +
      `<table><thead><tr><th></th><th>CommonJS</th><th>ESM</th></tr></thead><tbody>` +
      `<tr><td>Syntax</td><td>${k('require')}, ${k('module.exports')}</td><td>${k('import')}, ${k('export')}</td></tr>` +
      `<tr><td>Loading</td><td>Synchronous</td><td>Asynchronous, supports top-level ${k('await')}</td></tr>` +
      `<tr><td>Analysis</td><td>Runtime (dynamic)</td><td>Static (tree-shaking possible)</td></tr>` +
      `<tr><td>File name vars</td><td>${k('__dirname')}, ${k('__filename')}</td><td>${k('import.meta.dirname')}, ${k('import.meta.filename')}</td></tr>` +
      `<tr><td>Exports</td><td>A copy of the value (cached)</td><td>Live bindings</td></tr></tbody></table>`,
    keyPoints: [
      'CommonJS: require() and module.exports. ESM: import and export.',
      'package.json "type": "module" makes .js files ESM.',
      'ESM allows top-level await; CommonJS does not.',
      'Modules are cached: a file runs once, later requires get the same object.',
    ],
    tip: 'NestJS and most older Node code use CommonJS (compiled by TypeScript). New projects and libraries increasingly use ESM. Recent Node versions can even require() a synchronous ESM file.',
    qna: [
      { id: 'cjs-vs-esm', q: 'What is the difference between CommonJS and ES Modules?', a: `<p>CommonJS uses ${k('require()')} and ${k('module.exports')}, loads files synchronously and works at runtime. ES Modules use ${k('import')} / ${k('export')}, are the official JavaScript standard, are analysed statically (good for tree-shaking) and load asynchronously, so they allow top-level ${k('await')}.</p>` },
      { id: 'which-system', q: 'How does Node know whether a file is CommonJS or ESM?', a: `<p>By extension: ${k('.mjs')} is ESM, ${k('.cjs')} is CommonJS. For ${k('.js')} it reads ${k('"type"')} in the closest ${k('package.json')}: ${k('"module"')} means ESM, anything else means CommonJS.</p>` },
      { id: 'module-cache', q: 'What is the module cache?', a: `<p>The first time you ${k('require')} a file, Node runs it and stores the result in ${k('require.cache')}. Next time, it returns the same stored object without running the file again. That is why a module can hold shared state, like a single database connection.</p>` },
      { id: 'exports-vs-module-exports', q: 'What is the difference between exports and module.exports?', a: `<p>${k('exports')} is just a shortcut variable pointing to ${k('module.exports')}. You can add properties to it (${k('exports.a = 1')}), but if you <em>reassign</em> it (${k('exports = {...}')}) the link is broken and nothing is exported. To export one thing, always use ${k('module.exports = ...')}.</p>` },
      { id: 'dirname-esm', q: 'How do you get __dirname in an ES Module?', a: `<p>${k('__dirname')} does not exist in ESM. Use ${k('import.meta.dirname')} (Node 20.11+), or build it: ${k("path.dirname(fileURLToPath(import.meta.url))")}.</p>` },
      { id: 'circular', q: 'What happens with circular dependencies?', a: `<p>If A requires B and B requires A, one of them receives a <strong>partly finished</strong> export object (often empty) because the other file has not completed yet. It leads to confusing bugs. Fix by moving shared code to a third file or requiring inside the function.</p>` },
    ],
    quiz: [
      { q: 'Which syntax belongs to ES Modules?', options: ['const x = require("x")', 'module.exports = x', 'import x from "x"', 'exports.x = x'], answer: 2, explain: 'import / export is ESM. The other three are CommonJS.' },
      { q: 'Where can you use top-level await?', options: ['CommonJS only', 'ES Modules', 'Nowhere', 'Only inside functions'], answer: 1, explain: 'ES Modules load asynchronously, so top-level await is allowed. CommonJS cannot.' },
      { q: 'What does "type": "module" in package.json do?', options: ['Installs modules', 'Treats .js files as ES Modules', 'Disables npm', 'Turns on TypeScript'], answer: 1, explain: 'It tells Node to treat .js files in that package as ESM.' },
      { q: 'You write exports = { a: 1 } in a CommonJS file. What do other files get?', options: ['{ a: 1 }', 'An empty object {}', 'undefined error at require', 'A function'], answer: 1, explain: 'Reassigning exports breaks its link to module.exports, so the real export stays an empty object. Use module.exports = ... instead.' },
    ],
  }));

  /* ------------------------------------------------------------------ 4 */
  sections.push(mk('npm & package.json', {
    description: 'Installing packages, package.json fields, scripts, versions and lock files.',
    intro:
      `<p><strong>npm</strong> (Node Package Manager) installs libraries from the npm registry and runs project scripts. Every Node project has a ${k('package.json')}: the project's ID card.</p>` +
      c(`{
  "name": "my-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "node --test"
  },
  "dependencies": { "express": "^4.19.2" },
  "devDependencies": { "typescript": "~5.5.0" }
}`) +
      `<h3>Common commands</h3>` + c(`npm init -y                 # create package.json
npm install express         # add a dependency
npm install -D typescript   # add a dev dependency
npm install                 # install everything from package.json
npm run dev                 # run a script
npx tsc --init              # run a package without installing it globally
npm ci                      # clean, exact install from the lock file (CI)`) +
      `<h3>Version ranges</h3>` +
      `<ul><li>${k('^4.19.2')}: any <strong>4.x.x</strong> at or above 4.19.2 (minor + patch updates).</li><li>${k('~4.19.2')}: only <strong>4.19.x</strong> (patch updates).</li><li>${k('4.19.2')}: exactly this version.</li></ul>` +
      `<p>Semantic versioning is <strong>MAJOR.MINOR.PATCH</strong>: major = breaking change, minor = new feature, patch = bug fix.</p>`,
    keyPoints: [
      'package.json lists dependencies, scripts and project info.',
      'dependencies are needed at runtime; devDependencies only while developing.',
      'package-lock.json pins exact versions. Commit it.',
      'Use npm ci in CI/CD for repeatable installs.',
    ],
    tip: 'Never commit node_modules. Add it to .gitignore.',
    qna: [
      { id: 'dep-vs-dev', q: 'What is the difference between dependencies and devDependencies?', a: `<p><strong>dependencies</strong> are needed when the app runs (express, pg). <strong>devDependencies</strong> are only for development and build (typescript, eslint, jest). In production, ${k('npm install --omit=dev')} skips the dev ones to keep the image small.</p>` },
      { id: 'lock-file', q: 'What is package-lock.json and why commit it?', a: `<p>It records the <strong>exact version</strong> of every package (and sub-package) that was installed. With it, every developer and server gets identical dependencies. Without it, ${k('^')} ranges could install different versions on different days.</p>` },
      { id: 'caret-tilde', q: 'What do ^ and ~ mean in a version?', a: `<p>${k('^1.2.3')} allows updates that do not change the left-most non-zero number (1.x.x). ${k('~1.2.3')} allows only patch updates (1.2.x). Plain ${k('1.2.3')} is exact.</p>` },
      { id: 'npm-install-vs-ci', q: 'npm install vs npm ci?', a: `<p>${k('npm install')} can update the lock file and is meant for development. ${k('npm ci')} deletes node_modules and installs <strong>exactly</strong> what the lock file says; it fails if the lock file and package.json disagree. It is faster and safer for CI and Docker builds.</p>` },
      { id: 'npx', q: 'What does npx do?', a: `<p>${k('npx')} runs a command from a package, using the local copy in node_modules or downloading it temporarily. Example: ${k('npx create-next-app')}. It saves you from installing tools globally.</p>` },
      { id: 'scripts', q: 'How do npm scripts work?', a: `<p>Anything in the ${k('"scripts"')} field can be run with ${k('npm run name')}. ${k('start')} and ${k('test')} also work without ${k('run')}. npm adds ${k('node_modules/.bin')} to the PATH, so scripts can call locally installed tools directly.</p>` },
    ],
    quiz: [
      { q: 'Which command installs exactly what package-lock.json says?', options: ['npm install', 'npm update', 'npm ci', 'npm init'], answer: 2, explain: 'npm ci does a clean install from the lock file and is the right choice for CI.' },
      { q: 'What does "^2.3.4" allow?', options: ['Only 2.3.4', '2.3.x only', '2.x.x at or above 2.3.4', 'Any version'], answer: 2, explain: 'The caret allows minor and patch updates but not a new major version.' },
      { q: 'Where should a testing library like jest go?', options: ['dependencies', 'devDependencies', 'scripts', 'main'], answer: 1, explain: 'It is only needed during development, so it belongs in devDependencies.' },
      { q: 'In MAJOR.MINOR.PATCH, a breaking change bumps which number?', options: ['MAJOR', 'MINOR', 'PATCH', 'None'], answer: 0, explain: 'Semantic versioning: major for breaking changes, minor for features, patch for fixes.' },
    ],
  }));

  /* ------------------------------------------------------------------ 5 */
  sections.push(mk('Async Patterns: Callbacks, Promises, async/await', {
    description: 'Three ways to handle code that finishes later, and how to run tasks in parallel.',
    intro:
      `<p>Reading a file or calling a database takes time. Node does not wait; it lets you say "do this <em>when it is done</em>". There are three styles.</p>` +
      `<h3>1. Callbacks (oldest)</h3>` + c(`fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);   // error first
  console.log(data);
});`) +
      `<p>Many steps nested inside each other become unreadable: "callback hell".</p>` +
      `<h3>2. Promises</h3>` + c(`fs.promises.readFile('a.txt', 'utf8')
  .then((data) => console.log(data))
  .catch((err) => console.error(err));`) +
      `<h3>3. async / await (best for most code)</h3>` + c(`async function main() {
  try {
    const data = await fs.promises.readFile('a.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}`) +
      `<h3>Run things at the same time</h3>` + c(`// sequential: ~2 seconds
const a = await getUser();
const b = await getOrders();

// parallel: ~1 second (both start together)
const [user, orders] = await Promise.all([getUser(), getOrders()]);`) +
      `<p>Other helpers: ${k('Promise.allSettled')} (wait for all, never rejects), ${k('Promise.race')} (first to finish), ${k('Promise.any')} (first to succeed).</p>`,
    keyPoints: [
      'Callbacks are error-first: (err, data).',
      'A Promise has 3 states: pending, fulfilled, rejected.',
      'await only pauses the current function, not the whole program.',
      'Use Promise.all for independent tasks to run them in parallel.',
    ],
    tip: 'A common bug: using await inside forEach. forEach does not wait. Use a for...of loop, or Promise.all with map.',
    qna: [
      { id: 'callback-hell', q: 'What is callback hell and how do you avoid it?', a: `<p>Callback hell is deeply nested callbacks that make code hard to read and handle errors in. Avoid it by using Promises or async/await, naming functions instead of nesting anonymous ones, and splitting code into small functions.</p>` },
      { id: 'promise-states', q: 'What are the states of a Promise?', a: `<p><strong>Pending</strong> (still working), <strong>fulfilled</strong> (finished with a value) and <strong>rejected</strong> (failed with an error). Once fulfilled or rejected it never changes again (it is "settled").</p>` },
      { id: 'async-await', q: 'What does async/await do?', a: `<p>It is syntax on top of Promises that lets async code read like normal top-to-bottom code. An ${k('async')} function always returns a Promise. ${k('await')} pauses that function until the Promise settles and gives you the value (or throws the error, so you can use ${k('try/catch')}).</p>` },
      { id: 'promise-all', q: 'Promise.all vs Promise.allSettled vs Promise.race?', a: `<ul><li>${k('all')}: resolves when <em>all</em> succeed, rejects as soon as <em>one</em> fails.</li><li>${k('allSettled')}: waits for all and gives each result as ${k('{status, value|reason}')}. Never rejects.</li><li>${k('race')}: settles with the <em>first</em> promise to settle.</li><li>${k('any')}: resolves with the first <em>success</em>.</li></ul>` },
      { id: 'foreach-await', q: 'Why does await not work inside forEach?', a: `<p>${k('forEach')} ignores the Promise returned by its callback, so it does not wait; the code after it runs immediately. Use ${k('for (const x of list) { await ... }')} for one-by-one, or ${k('await Promise.all(list.map(async x => ...))')} for parallel.</p>` },
      { id: 'promisify', q: 'How do you turn a callback function into a Promise?', a: `<p>Use ${k("util.promisify(fn)")} for error-first callback functions, or wrap it by hand with ${k('new Promise((resolve, reject) => ...)')}. Many built-in modules already have promise versions: ${k("require('fs/promises')")}, ${k("require('timers/promises')")}.</p>` },
    ],
    quiz: [
      { q: 'What does an async function always return?', options: ['The raw value', 'undefined', 'A Promise', 'A callback'], answer: 2, explain: 'Even if you return a plain value, async wraps it in a Promise.' },
      { q: 'Two independent requests take 1 second each. How do you make both finish in about 1 second?', options: ['await one then the other', 'Promise.all([a(), b()])', 'Use setTimeout', 'Use forEach'], answer: 1, explain: 'Promise.all starts both at once and waits for both.' },
      { q: 'Which helper never rejects and reports every result?', options: ['Promise.all', 'Promise.race', 'Promise.allSettled', 'Promise.resolve'], answer: 2, explain: 'allSettled waits for every promise and returns status and value or reason for each.' },
      { q: 'What is the first argument of an error-first callback?', options: ['The data', 'The error (or null)', 'The next function', 'The file name'], answer: 1, explain: 'Node convention: callback(err, data). Always check err first.' },
      { q: 'Why is await inside array.forEach a problem?', options: ['It throws a syntax error', 'forEach does not wait for async callbacks', 'It is slower', 'It only works in ESM'], answer: 1, explain: 'forEach ignores returned Promises, so the loop does not pause. Use for...of or Promise.all.' },
    ],
  }));

  /* ------------------------------------------------------------------ 6 */
  sections.push(mk('Streams & Buffers', {
    description: 'Handling big data piece by piece, and what a Buffer really is.',
    intro:
      `<p>A <strong>Buffer</strong> is a fixed chunk of raw memory that holds bytes. Files, network data and images are all bytes. Strings are made from bytes with an encoding such as UTF-8.</p>` +
      c(`const buf = Buffer.from('Hi', 'utf8');
console.log(buf);              // <Buffer 48 69>
console.log(buf.toString());   // Hi
console.log(buf.toString('base64'));   // SGk=`) +
      `<p>A <strong>stream</strong> processes data <strong>in small chunks</strong> instead of loading everything into memory. Think of drinking from a tap instead of lifting the whole water tank.</p>` +
      c(`// Bad for a 5 GB file: loads it all in memory
const data = await fs.promises.readFile('big.csv');

// Good: constant memory
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

await pipeline(
  fs.createReadStream('big.csv'),
  zlib.createGzip(),
  fs.createWriteStream('big.csv.gz'),
);`) +
      `<h3>Four kinds of streams</h3>` +
      `<ul><li><strong>Readable</strong>: a source (file read, HTTP request)</li><li><strong>Writable</strong>: a destination (file write, HTTP response)</li><li><strong>Duplex</strong>: both (a TCP socket)</li><li><strong>Transform</strong>: changes data while passing it through (gzip)</li></ul>` +
      `<p><strong>Backpressure</strong> means a fast reader must slow down when the writer cannot keep up. ${k('pipeline')} handles this for you.</p>`,
    keyPoints: [
      'Buffer = raw bytes in memory. Stream = data in chunks over time.',
      'Streams keep memory low for big files.',
      'Types: Readable, Writable, Duplex, Transform.',
      'Prefer pipeline() over pipe(): it handles errors and cleanup.',
    ],
    tip: 'HTTP requests and responses in Node are streams. That is why you can stream a big file straight to the client with createReadStream(file).pipe(res).',
    qna: [
      { id: 'what-is-buffer', q: 'What is a Buffer in Node.js?', a: `<p>A Buffer is a fixed-size area of memory outside the JS heap that stores raw binary data. It is used for files, network packets, images and encodings (utf8, base64, hex). Create one with ${k('Buffer.from()')} or ${k('Buffer.alloc()')}.</p>` },
      { id: 'what-is-stream', q: 'What is a stream and why use it?', a: `<p>A stream is an object that moves data in small chunks. You use it so large data (big files, uploads, video) does not have to fit in memory, and so you can start processing before all the data has arrived. Result: lower memory and faster time to first byte.</p>` },
      { id: 'stream-types', q: 'What are the four types of streams?', a: `<p><strong>Readable</strong> (read from), <strong>Writable</strong> (write to), <strong>Duplex</strong> (both independently, like a socket) and <strong>Transform</strong> (a duplex that changes data, like gzip or a CSV parser).</p>` },
      { id: 'backpressure', q: 'What is backpressure?', a: `<p>When the data source is faster than the destination, chunks pile up in memory. Backpressure is the signal that tells the source to pause until the destination catches up. ${k('writable.write()')} returns ${k('false')} when its buffer is full; wait for the ${k("'drain'")} event. ${k('pipe')} and ${k('pipeline')} do this automatically.</p>` },
      { id: 'pipe-vs-pipeline', q: 'pipe() vs pipeline()?', a: `<p>${k('pipe')} connects streams but does not forward errors or destroy the other streams if one fails, which can leak file handles. ${k('pipeline')} (from ${k('stream/promises')}) forwards errors, cleans up everything and can be awaited. Prefer it.</p>` },
      { id: 'readfile-vs-stream', q: 'When would you use fs.readFile and when createReadStream?', a: `<p>${k('readFile')} is fine for small files (config, JSON) because it is simple. Use ${k('createReadStream')} for large files, or whenever you send the data somewhere else (HTTP response, upload, compression) so memory stays flat.</p>` },
    ],
    quiz: [
      { q: 'What is the main benefit of streams?', options: ['Faster CPU', 'Process big data in chunks with low memory', 'Automatic caching', 'Better security'], answer: 1, explain: 'Streams handle data piece by piece so you never load a huge file fully into memory.' },
      { q: 'Which stream type changes data as it passes through?', options: ['Readable', 'Writable', 'Transform', 'Buffer'], answer: 2, explain: 'A Transform stream reads, changes and outputs data, for example gzip compression.' },
      { q: 'What is backpressure?', options: ['A memory leak', 'Slowing the source when the destination is overloaded', 'A kind of error', 'Compression level'], answer: 1, explain: 'Backpressure keeps a fast producer from flooding a slow consumer.' },
      { q: 'What does Buffer.from("Hi") create?', options: ['A string', 'A chunk of raw bytes', 'A stream', 'A Promise'], answer: 1, explain: 'A Buffer holds raw bytes. Here the UTF-8 bytes of "Hi".' },
    ],
  }));

  /* ------------------------------------------------------------------ 7 */
  sections.push(mk('File System', {
    description: 'Reading, writing and managing files and folders with the fs module.',
    intro:
      `<p>The built-in ${k('fs')} module reads and writes files. It has three flavours: <strong>callbacks</strong>, <strong>synchronous</strong> (${k('...Sync')}, blocking) and <strong>promises</strong> (${k("fs/promises")}). In servers, use the promise version.</p>` +
      c(`import fs from 'node:fs/promises';
import path from 'node:path';

const file = path.join(import.meta.dirname, 'data.json');

// read
const text = await fs.readFile(file, 'utf8');
const data = JSON.parse(text);

// write (replaces the file)
await fs.writeFile(file, JSON.stringify(data, null, 2));

// append
await fs.appendFile('app.log', 'server started\\n');

// folders
await fs.mkdir('uploads/images', { recursive: true });
const names = await fs.readdir('uploads');

// check, delete
await fs.access(file);            // throws if it does not exist
await fs.rm('tmp', { recursive: true, force: true });`) +
      `<h3>Good habits</h3>` +
      `<ul><li>Build paths with ${k('path.join')} / ${k('path.resolve')}, never by gluing strings.</li><li>Do not use ${k('...Sync')} functions inside request handlers. They block everyone.</li><li>Use streams for big files.</li><li>Never trust a file name from a user: it could be ${k('../../etc/passwd')} (path traversal).</li></ul>`,
    keyPoints: [
      'Use fs/promises with async/await in servers.',
      '...Sync functions block the event loop. Fine for startup scripts only.',
      'path.join builds safe, cross-platform paths.',
      'Validate user-supplied file names (path traversal).',
    ],
    tip: 'To check if a file exists, just try to open it and handle the error. fs.exists is deprecated, and "check then use" has a race condition.',
    qna: [
      { id: 'sync-vs-async-fs', q: 'What is the difference between fs.readFile and fs.readFileSync?', a: `<p>${k('readFileSync')} blocks the event loop until the file is read, so no other request runs. ${k('readFile')} (callback or promise) hands the work to the thread pool and lets Node continue. Use the async version in servers; sync is acceptable only at startup.</p>` },
      { id: 'writefile-vs-append', q: 'writeFile vs appendFile?', a: `<p>${k('writeFile')} <strong>replaces</strong> the whole file (creating it if missing). ${k('appendFile')} <strong>adds</strong> to the end, which is what you want for logs.</p>` },
      { id: 'path-module', q: 'Why use the path module?', a: `<p>Operating systems use different separators (${k('/')} on Linux and Mac, ${k('\\')} on Windows). ${k('path.join')}, ${k('path.resolve')}, ${k('path.basename')} and ${k('path.extname')} handle that and clean up ${k('..')} segments, so your code works everywhere.</p>` },
      { id: 'path-traversal', q: 'What is a path traversal attack?', a: `<p>An attacker sends a file name like ${k('../../.env')} to read files outside the intended folder. Defend by resolving the final path and checking it still starts with your allowed folder, by using generated IDs instead of user file names, and by running the app with limited permissions.</p>` },
      { id: 'watch-files', q: 'How can you react when a file changes?', a: `<p>Use ${k('fs.watch')} (low level, differs by OS) or a library like chokidar. For development restarts, Node has ${k('node --watch app.js')} built in.</p>` },
    ],
    quiz: [
      { q: 'Which fs call is dangerous inside a busy request handler?', options: ['fs.promises.readFile', 'fs.readFileSync', 'fs.createReadStream', 'fs.readFile'], answer: 1, explain: 'Sync calls block the event loop, so every other request waits.' },
      { q: 'Which function adds text to the end of an existing file?', options: ['writeFile', 'appendFile', 'readFile', 'mkdir'], answer: 1, explain: 'appendFile adds to the end. writeFile replaces the file.' },
      { q: 'Why use path.join instead of joining with "/"?', options: ['It is faster', 'It works on every operating system', 'It encrypts paths', 'It is required by fs'], answer: 1, explain: 'path.join uses the right separator for the OS and normalises the path.' },
      { q: 'Which option creates nested folders in one call?', options: ['fs.mkdir(p, { recursive: true })', 'fs.mkdir(p)', 'fs.readdir(p)', 'fs.rm(p)'], answer: 0, explain: 'recursive: true creates missing parent folders and does not fail if the folder exists.' },
    ],
  }));

  /* ------------------------------------------------------------------ 8 */
  sections.push(mk('Events & EventEmitter', {
    description: 'The publish / subscribe pattern built into Node.js.',
    intro:
      `<p>Much of Node.js is event-based: an HTTP server emits a <em>request</em> event, a stream emits <em>data</em>, a process emits <em>exit</em>. The tool behind all this is ${k('EventEmitter')} from the ${k('events')} module.</p>` +
      `<p>The idea: one part of the code <strong>emits</strong> a named event, other parts <strong>listen</strong> for it. They do not need to know about each other.</p>` +
      c(`import { EventEmitter } from 'node:events';

const bus = new EventEmitter();

bus.on('order:created', (order) => {
  console.log('send email for', order.id);
});
bus.on('order:created', (order) => {
  console.log('update stock for', order.id);
});

bus.emit('order:created', { id: 42 });   // both listeners run, in order

bus.once('ready', () => console.log('only the first time'));`) +
      `<h3>Things to remember</h3>` +
      `<ul><li>Listeners run <strong>synchronously</strong>, in the order added.</li><li>Emitting <code>'error'</code> with no listener <strong>crashes</strong> the process. Always add an error listener.</li><li>Remove listeners you no longer need (${k('off')}) to avoid memory leaks. Node warns after 10 listeners on one event.</li><li>You can extend it: ${k('class Cart extends EventEmitter {}')}.</li></ul>`,
    keyPoints: [
      'on() adds a listener, emit() fires the event, once() listens one time.',
      'Listeners run synchronously in registration order.',
      'An unhandled "error" event throws and can crash the app.',
      'Remove listeners to avoid memory leaks.',
    ],
    tip: 'NestJS has an events module built on the same idea. This is the pattern behind "when X happens, also do Y and Z".',
    qna: [
      { id: 'event-emitter', q: 'What is EventEmitter?', a: `<p>A class from the ${k('events')} module that implements the publish/subscribe pattern. You register listeners with ${k('on')} and trigger them with ${k('emit')}. Many Node objects (streams, servers, processes) extend it.</p>` },
      { id: 'sync-or-async', q: 'Are EventEmitter listeners synchronous or asynchronous?', a: `<p><strong>Synchronous.</strong> ${k('emit')} calls each listener one after another, in the order they were added, before it returns. If you need async behaviour, use ${k('setImmediate')} inside the listener, or make the listener ${k('async')} (but note emit will not wait for it).</p>` },
      { id: 'error-event', q: 'What happens if an EventEmitter emits "error" and nobody listens?', a: `<p>Node <strong>throws</strong> the error and, if uncaught, the process crashes. "error" is special. Always attach ${k("emitter.on('error', handler)")} for emitters that can fail (streams, sockets).</p>` },
      { id: 'on-vs-once', q: 'on() vs once()?', a: `<p>${k('on')} keeps listening for every emit. ${k('once')} runs the listener only for the first emit and then removes itself.</p>` },
      { id: 'leak-warning', q: 'What does "MaxListenersExceededWarning" mean?', a: `<p>More than 10 listeners were added to one event on one emitter. It usually means a <strong>leak</strong>: code adds a listener on every request but never removes it. Fix the leak with ${k('off')}/${k('once')}. Only raise the limit (${k('setMaxListeners')}) if you really need many listeners.</p>` },
    ],
    quiz: [
      { q: 'Which method triggers an event?', options: ['on()', 'emit()', 'once()', 'listen()'], answer: 1, explain: 'emit(name, ...args) fires the event and calls every listener.' },
      { q: 'In what order do listeners for one event run?', options: ['Random', 'Last added first', 'The order they were added', 'In parallel'], answer: 2, explain: 'Listeners run synchronously in the order they were registered.' },
      { q: 'What happens when "error" is emitted and there is no error listener?', options: ['Nothing', 'It is logged only', 'It is thrown and can crash the process', 'It is retried'], answer: 2, explain: 'An unhandled error event throws. Always add an error listener.' },
      { q: 'Which method runs a listener only one time?', options: ['once()', 'on()', 'off()', 'prependListener()'], answer: 0, explain: 'once() removes the listener after the first call.' },
    ],
  }));

  /* ------------------------------------------------------------------ 9 */
  sections.push(mk('Worker Threads & Cluster', {
    description: 'Using more than one CPU core: worker threads for heavy tasks, cluster for many server processes.',
    intro:
      `<p>Node runs your JavaScript on one thread, so one CPU core. Two built-in tools let you use more cores.</p>` +
      `<h3>Worker Threads: for CPU-heavy tasks</h3>` +
      `<p>A worker is a separate thread with its own event loop and memory, inside the same process. Use it for work that would otherwise block the main thread (image resize, big calculation, parsing).</p>` +
      c(`// main.js
import { Worker } from 'node:worker_threads';

const worker = new Worker('./heavy.js', { workerData: { n: 45 } });
worker.on('message', (result) => console.log('result:', result));
worker.on('error', (err) => console.error(err));

// heavy.js
import { parentPort, workerData } from 'node:worker_threads';
const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
parentPort.postMessage(fib(workerData.n));`) +
      `<h3>Cluster: for scaling a server</h3>` +
      `<p>${k('cluster')} starts several copies of your app (child <strong>processes</strong>), usually one per CPU core. They all share the same port; the primary process spreads connections between them.</p>` +
      c(`import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());    // restart a dead worker
} else {
  http.createServer((req, res) => res.end('pid ' + process.pid)).listen(3000);
}`) +
      `<table><thead><tr><th></th><th>Worker threads</th><th>Cluster</th></tr></thead><tbody><tr><td>Unit</td><td>Thread</td><td>Process</td></tr><tr><td>Memory</td><td>Can share (SharedArrayBuffer)</td><td>Separate, no sharing</td></tr><tr><td>Best for</td><td>CPU-heavy jobs</td><td>Handling more requests</td></tr></tbody></table>`,
    keyPoints: [
      'Worker threads: heavy CPU work without blocking the main thread.',
      'Cluster: one process per core to serve more requests.',
      'Cluster processes do not share memory; use Redis or a database for shared state.',
      'In production, many teams run several containers or use PM2 instead of cluster.',
    ],
    tip: 'Worker threads do not make I/O faster. Node already does I/O without blocking. They only help with CPU work.',
    qna: [
      { id: 'worker-threads', q: 'What are worker threads and when do you use them?', a: `<p>Worker threads run JavaScript in a separate thread with its own event loop, inside the same process. Use them for <strong>CPU-intensive</strong> jobs such as image processing, encryption or large data parsing, so the main thread keeps answering requests. Talk to them with ${k('postMessage')}.</p>` },
      { id: 'cluster-what', q: 'What is the cluster module?', a: `<p>It forks your app into multiple <strong>processes</strong> (typically one per CPU core) that share one server port. It lets a single machine handle more concurrent requests and restart crashed workers.</p>` },
      { id: 'worker-vs-cluster', q: 'Worker threads vs cluster: what is the difference?', a: `<p><strong>Workers</strong> are threads inside one process, can share memory, and fix CPU-bound tasks. <strong>Cluster</strong> creates separate processes with separate memory, and scales a server across cores. Choose workers for "this one job is heavy", cluster for "I need more throughput".</p>` },
      { id: 'cluster-state', q: 'How do cluster workers share data, such as sessions?', a: `<p>They can't share memory. Put shared state outside the process: Redis, a database, or signed tokens (JWT). In-memory caches or counters will differ per worker.</p>` },
      { id: 'child-process', q: 'What is child_process?', a: `<p>A module to run other programs or scripts as separate processes (${k('spawn')}, ${k('exec')}, ${k('fork')}). It is for running shell commands or other executables, while worker threads are for running JavaScript in parallel.</p>` },
    ],
    quiz: [
      { q: 'Which tool is best for a CPU-heavy calculation that blocks requests?', options: ['cluster', 'Worker threads', 'More setTimeout', 'fs.promises'], answer: 1, explain: 'Worker threads move the heavy calculation off the main thread.' },
      { q: 'What does the cluster module create?', options: ['Threads', 'Child processes sharing a port', 'Databases', 'Docker containers'], answer: 1, explain: 'Cluster forks processes, usually one per core, that share the server port.' },
      { q: 'Do cluster workers share variables in memory?', options: ['Yes, always', 'No, each has its own memory', 'Only on Linux', 'Only for strings'], answer: 1, explain: 'They are separate processes. Use Redis or a database for shared state.' },
      { q: 'How do the main thread and a worker thread communicate?', options: ['Global variables', 'Messages (postMessage)', 'Files only', 'They cannot'], answer: 1, explain: 'They send messages with postMessage and receive them with the message event.' },
    ],
  }));

  /* ------------------------------------------------------------------ 10 */
  sections.push(mk('process & Environment Variables', {
    description: 'The global process object, reading config from the environment and keeping secrets safe.',
    intro:
      `<p>${k('process')} is a global object that describes the running Node program: its arguments, environment, memory, and lifecycle.</p>` +
      c(`process.argv        // ['node', '/path/app.js', ...your arguments]
process.env         // environment variables (all values are strings)
process.cwd()       // current working directory
process.pid         // process id
process.platform    // 'linux', 'win32', 'darwin'
process.uptime()    // seconds since start
process.memoryUsage()
process.exit(1)     // stop now. 0 = success, non-zero = error`) +
      `<h3>Environment variables</h3>` +
      `<p>Config that changes between machines (ports, database URLs, API keys) should live in <strong>environment variables</strong>, not in code.</p>` +
      c(`const port = Number(process.env.PORT) || 3000;
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is missing');

// .env file (never commit it!)
// PORT=4000
// DATABASE_URL=postgres://user:pass@localhost:5432/app

// Node 20.6+ can read it without any library:
// node --env-file=.env app.js`) +
      `<p>Environment variables are always <strong>strings</strong>: ${k('process.env.DEBUG = false')} becomes the string ${k('"false"')}, which is truthy. Convert them yourself.</p>`,
    keyPoints: [
      'process.env holds environment variables; values are always strings.',
      'Keep secrets and config out of code. Use .env locally and real env vars in production.',
      'node --env-file=.env loads a .env file with no extra package.',
      'Exit code 0 means success, anything else means failure.',
    ],
    tip: 'Add .env to .gitignore and commit a .env.example that lists the variable names without real values.',
    qna: [
      { id: 'process-env', q: 'What is process.env?', a: `<p>An object with all environment variables of the process. Use it to read config such as ${k('PORT')} or ${k('DATABASE_URL')}. Values are always strings, so convert numbers and booleans yourself.</p>` },
      { id: 'why-env', q: 'Why use environment variables for config?', a: `<p>The same code must run in development, testing and production with different settings and secrets. Environment variables keep secrets out of the repository, make config changes possible without a new build, and follow the "twelve-factor app" rules.</p>` },
      { id: 'dotenv', q: 'How do you load a .env file?', a: `<p>Use the ${k('dotenv')} package (${k("import 'dotenv/config'")}), or in Node 20.6+ run ${k('node --env-file=.env app.js')}. Frameworks like NestJS have a ConfigModule that does the same and adds validation.</p>` },
      { id: 'argv', q: 'How do you read command-line arguments?', a: `<p>${k('process.argv')} is an array: the first two items are the node path and script path; the rest are your arguments. For nicer parsing use ${k('util.parseArgs')} (built in) or libraries like commander.</p>` },
      { id: 'exit-codes', q: 'What is the difference between process.exit(0) and process.exit(1)?', a: `<p>The number is the exit code. <strong>0</strong> means success. <strong>Non-zero</strong> means failure, and tools such as CI, Docker and shell scripts use it to know if your program worked. Prefer setting ${k('process.exitCode')} and letting the app finish cleanly over calling ${k('process.exit()')}, which can cut off pending writes.</p>` },
    ],
    quiz: [
      { q: 'What type are values in process.env?', options: ['Numbers', 'Booleans', 'Strings', 'Mixed'], answer: 2, explain: 'Everything in process.env is a string. "false" is a truthy string, so convert it yourself.' },
      { q: 'Which flag loads a .env file in modern Node without extra packages?', options: ['--load', '--env-file=.env', '--dotenv', '--config'], answer: 1, explain: 'Node 20.6+ supports node --env-file=.env app.js.' },
      { q: 'What exit code means success?', options: ['0', '1', '-1', '200'], answer: 0, explain: 'Exit code 0 is success; any other number signals an error.' },
      { q: 'What should you do with your .env file?', options: ['Commit it', 'Add it to .gitignore', 'Put it in public/', 'Send it in API responses'], answer: 1, explain: '.env holds secrets. Keep it out of git and share only a .env.example.' },
    ],
  }));

  /* ------------------------------------------------------------------ 11 */
  sections.push(mk('Error Handling & Process Events', {
    description: 'Operational vs programmer errors, try/catch for async code, and the last-resort process events.',
    intro:
      `<p>Errors fall into two groups:</p>` +
      `<ul><li><strong>Operational errors</strong>: expected problems at runtime. A database is down, a file is missing, user input is bad, a request times out. Handle them: retry, return a 4xx/5xx, log.</li><li><strong>Programmer errors</strong>: bugs, like reading a property of ${k('undefined')}. You cannot recover safely. Log and restart.</li></ul>` +
      `<h3>Handling in each style</h3>` +
      c(`// callbacks: check err first
fs.readFile(f, (err, data) => { if (err) return handle(err); });

// promises
doWork().catch(handle);

// async/await
try {
  await doWork();
} catch (err) {
  handle(err);
}`) +
      `<h3>Custom errors</h3>` +
      c(`class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
throw new NotFoundError('User not found');`) +
      `<h3>Last-resort process events</h3>` +
      c(`process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);          // state may be broken: exit, let a supervisor restart
});
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));   // graceful shutdown
});`),
    keyPoints: [
      'Handle operational errors; fix programmer errors.',
      'Use try/catch with await. A rejected promise with no catch is an unhandled rejection.',
      'Always throw Error objects (with a stack), never plain strings.',
      'After uncaughtException, log and exit. Let PM2, Docker or Kubernetes restart the app.',
    ],
    tip: 'Handle SIGTERM and SIGINT to shut down gracefully: stop accepting requests, finish the running ones, close the database, then exit.',
    qna: [
      { id: 'operational-vs-programmer', q: 'What is the difference between operational and programmer errors?', a: `<p><strong>Operational</strong> errors come from the outside world and can be expected: network failures, invalid input, missing files. You handle them. <strong>Programmer</strong> errors are bugs in your code (TypeError, wrong argument). The program is in an unknown state, so you fix the code and restart.</p>` },
      { id: 'try-catch-async', q: 'Does try/catch catch errors in callbacks and promises?', a: `<p>Not by itself. ${k('try/catch')} only catches errors thrown <em>synchronously</em> in its block. Inside an ${k('async')} function, <strong>await</strong> turns a rejected promise into a thrown error, so ${k('try { await x } catch {}')} works. A plain callback that throws later is outside the try block.</p>` },
      { id: 'unhandled-rejection', q: 'What is an unhandled promise rejection?', a: `<p>A Promise was rejected and no ${k('.catch')} or ${k('try/catch')} handled it. Since Node 15 the default is to <strong>crash the process</strong>. Listen to ${k("process.on('unhandledRejection')")} to log it, but the real fix is to handle every promise.</p>` },
      { id: 'uncaught-exception', q: 'Should you keep the app running after uncaughtException?', a: `<p>No. After an uncaught exception the app may be in a broken state (half-written data, leaked resources). Log the error, close what you can, and <strong>exit</strong>. Let a process manager restart it.</p>` },
      { id: 'graceful-shutdown', q: 'What is a graceful shutdown?', a: `<p>On ${k('SIGTERM')} (sent by Docker, Kubernetes or PM2 when stopping), you stop accepting new connections (${k('server.close()')}), let current requests finish, close database connections, then exit. It avoids dropped requests during deploys.</p>` },
      { id: 'error-cause', q: 'How do you keep the original error when wrapping it?', a: `<p>Use the ${k('cause')} option: ${k("throw new Error('Could not save order', { cause: err })")}. The original stack stays attached and shows in logs.</p>` },
    ],
    quiz: [
      { q: 'Which is an operational error?', options: ['Calling undefined()', 'Database connection refused', 'A typo in a variable name', 'Wrong function argument in code'], answer: 1, explain: 'A database being unreachable is an expected runtime problem you can handle (retry, return 503).' },
      { q: 'Inside an async function, how do you catch a rejected promise from await?', options: ['try / catch', 'if / else', 'switch', 'You cannot'], answer: 0, explain: 'await throws the rejection reason, so a normal try/catch works.' },
      { q: 'What should you do after an uncaughtException?', options: ['Ignore it and continue', 'Log, then exit and let a supervisor restart', 'Call the same function again', 'Delete node_modules'], answer: 1, explain: 'The app state may be corrupted. Exit cleanly and restart.' },
      { q: 'Which signal do Docker and Kubernetes send to ask your app to stop?', options: ['SIGTERM', 'SIGPLAY', 'SIGHELP', 'SIGMEM'], answer: 0, explain: 'SIGTERM requests shutdown. Handle it to finish work gracefully.' },
    ],
  }));

  /* ------------------------------------------------------------------ 12 */
  sections.push(mk('Built-in Modules', {
    description: 'The most useful modules that ship with Node.js, and the modern built-in tools.',
    intro:
      `<p>Node comes with many modules, no install needed. Import them with the ${k('node:')} prefix so it is clear they are built in.</p>` +
      `<table><thead><tr><th>Module</th><th>Use it for</th></tr></thead><tbody>` +
      `<tr><td>${k('node:fs')}</td><td>Read and write files</td></tr>` +
      `<tr><td>${k('node:path')}</td><td>Build and clean file paths</td></tr>` +
      `<tr><td>${k('node:http')} / ${k('node:https')}</td><td>Create servers and make requests</td></tr>` +
      `<tr><td>${k('node:os')}</td><td>CPU count, memory, hostname</td></tr>` +
      `<tr><td>${k('node:crypto')}</td><td>Hashing, random bytes, UUIDs, encryption</td></tr>` +
      `<tr><td>${k('node:events')}</td><td>EventEmitter</td></tr>` +
      `<tr><td>${k('node:stream')}</td><td>Streams and pipeline</td></tr>` +
      `<tr><td>${k('node:util')}</td><td>promisify, format, parseArgs</td></tr>` +
      `<tr><td>${k('node:url')}</td><td>URL and URLSearchParams</td></tr>` +
      `<tr><td>${k('node:zlib')}</td><td>gzip, deflate, brotli</td></tr>` +
      `<tr><td>${k('node:child_process')}</td><td>Run other programs</td></tr>` +
      `<tr><td>${k('node:test')}</td><td>Built-in test runner</td></tr></tbody></table>` +
      `<h3>A tiny HTTP server with no framework</h3>` +
      c(`import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true }));
  }
  res.writeHead(404).end('Not found');
});
server.listen(3000, () => console.log('http://localhost:3000'));`) +
      `<h3>Handy examples</h3>` +
      c(`import crypto from 'node:crypto';
crypto.randomUUID();                          // unique id
crypto.createHash('sha256').update('hi').digest('hex');

const res = await fetch('https://api.github.com');   // global fetch (Node 18+)
const json = await res.json();

// built-in test runner:  node --test
import test from 'node:test';
import assert from 'node:assert';
test('adds', () => assert.strictEqual(1 + 2, 3));`),
    keyPoints: [
      'Built-in modules need no install. Import them as node:fs, node:path, etc.',
      'http is the base that Express and NestJS are built on.',
      'Modern Node has global fetch, a test runner (node:test), --watch and --env-file.',
      'Use crypto for hashing and random values, never Math.random for security.',
    ],
    tip: 'Passwords need a slow, salted hash: use bcrypt or argon2 (or crypto.scrypt), not a plain sha256.',
    qna: [
      { id: 'http-module', q: 'What is the http module and how does Express relate to it?', a: `<p>${k('node:http')} lets you create a server and read requests and responses at a low level. Express (and NestJS with its Express adapter) is a library <em>on top of</em> http that adds routing, middleware and helpers, so you write less code.</p>` },
      { id: 'crypto-uses', q: 'What is the crypto module used for?', a: `<p>Hashing (${k('createHash')}), HMAC signatures (${k('createHmac')}), secure random values (${k('randomBytes')}, ${k('randomUUID')}), password hashing (${k('scrypt')}) and encryption (${k('createCipheriv')}).</p>` },
      { id: 'fetch-built-in', q: 'Do you need axios to make HTTP requests in Node?', a: `<p>No. Node 18+ includes the global ${k('fetch')} (the same API as the browser, built on undici). Libraries like axios still offer extras (interceptors, automatic JSON errors), but simple calls work with ${k('fetch')} alone. Note: ${k('fetch')} does not throw on a 404 or 500; check ${k('res.ok')}.</p>` },
      { id: 'node-prefix', q: 'Why write node:fs instead of fs?', a: `<p>The ${k('node:')} prefix makes it clear this is a built-in module and not an npm package of the same name. It also cannot be shadowed by a package in node_modules.</p>` },
      { id: 'node-test', q: 'Does Node have a built-in test runner?', a: `<p>Yes. ${k('node:test')} with ${k('node:assert')}. Run ${k('node --test')}. It supports ${k('describe')}/${k('it')}, mocks, and coverage (${k('--experimental-test-coverage')}). It is a lightweight alternative to Jest for small projects.</p>` },
      { id: 'util-promisify', q: 'What are util.promisify and util.parseArgs?', a: `<p>${k('promisify')} converts an error-first callback function to one that returns a Promise. ${k('parseArgs')} parses command-line flags without an extra library.</p>` },
    ],
    quiz: [
      { q: 'Which module creates the base HTTP server that Express builds on?', options: ['node:net only', 'node:http', 'node:fs', 'node:os'], answer: 1, explain: 'Express is a layer over node:http that adds routing and middleware.' },
      { q: 'Which is the right way to make a random unique ID?', options: ['Math.random()', 'crypto.randomUUID()', 'Date.now() only', 'process.pid'], answer: 1, explain: 'crypto.randomUUID() gives a secure, unique UUID.' },
      { q: 'You call fetch() and the server replies 404. What happens?', options: ['fetch throws an error', 'The promise resolves and res.ok is false', 'The app crashes', 'fetch retries'], answer: 1, explain: 'fetch only rejects on network failure. For HTTP 4xx/5xx it resolves, so check res.ok.' },
      { q: 'How do you run Node\'s built-in tests?', options: ['node --test', 'npm test only', 'node --jest', 'node run tests'], answer: 0, explain: 'node --test runs files that use node:test.' },
    ],
  }));

  mod.sections = sections;
})();
