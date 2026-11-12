/* Backend module: 13 sub-modules.
   Fills the (empty) "backend" module registered in 02-outline.js. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'backend');
  if (!mod) return;
  mod.unlocked = true;   // modules are locked by default (see app.js)

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const h = (t) => `<h4>${t}</h4>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const ia = (t) => `<div class="callout green"><div class="callout-title">Interview answer</div>${p(t)}</div>`;
  const rem = (t) => `<div class="callout amber"><div class="callout-title">Remember</div>${p(t)}</div>`;

  const sections = [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'important-concepts',
      title: 'Important Concepts',
      description: 'The ideas every backend developer must explain: HTTP, REST, status codes, JSON, auth, JWT, CORS, idempotency, pagination and caching.',
      intro:
        p('A <strong>backend</strong> is the part of an application that runs on a server. It receives requests (from a browser or a mobile app), talks to the database, applies the business rules, and sends back a response. Before any framework, you must be comfortable with a few core ideas.') +
        h('HTTP in one minute') +
        p('HTTP is the language of the web. The client sends a <strong>request</strong> (method + URL + headers + optional body). The server sends a <strong>response</strong> (status code + headers + optional body). HTTP is <strong>stateless</strong>: the server does not remember you between two requests unless you send something (a token or a cookie) that proves who you are.') +
        code('GET /users/5 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <token>\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{ "id": 5, "name": "Asha" }') +
        h('REST and the common methods') +
        p('REST is a style for designing APIs around <strong>resources</strong> (things like users or orders). The URL names the thing, the method says what to do with it.') +
        table(['Method', 'Meaning', 'Example', 'Safe?', 'Idempotent?'], [
          ['GET', 'Read', 'GET /users', 'Yes', 'Yes'],
          ['POST', 'Create', 'POST /users', 'No', 'No'],
          ['PUT', 'Replace whole thing', 'PUT /users/5', 'No', 'Yes'],
          ['PATCH', 'Change some fields', 'PATCH /users/5', 'No', 'Not guaranteed'],
          ['DELETE', 'Remove', 'DELETE /users/5', 'No', 'Yes'],
        ]) +
        h('Status codes you must know') +
        table(['Code', 'Name', 'When to use'], [
          ['200', 'OK', 'Request worked, body has the result'],
          ['201', 'Created', 'A new resource was created (POST)'],
          ['204', 'No Content', 'Worked, nothing to send back (often DELETE)'],
          ['400', 'Bad Request', 'Client sent invalid data'],
          ['401', 'Unauthorized', 'Not logged in / bad token'],
          ['403', 'Forbidden', 'Logged in, but not allowed'],
          ['404', 'Not Found', 'Resource does not exist'],
          ['409', 'Conflict', 'Clash, such as a duplicate email'],
          ['422', 'Unprocessable Entity', 'Data is well-formed but fails validation'],
          ['429', 'Too Many Requests', 'Rate limit hit'],
          ['500', 'Internal Server Error', 'Bug or crash on the server'],
        ]) +
        h('Authentication vs authorization') +
        ul([
          '<strong>Authentication</strong> answers "Who are you?" (login with email and password).',
          '<strong>Authorization</strong> answers "What are you allowed to do?" (only admins can delete users).',
        ]) +
        h('Sessions vs JWT') +
        p('With a <strong>session</strong>, the server stores the login state (in memory or Redis) and gives the browser a session id in a cookie. With a <strong>JWT</strong> (JSON Web Token), the server signs a small token that contains the user id and an expiry. The client sends it on every request, and the server only checks the signature, so no lookup is needed.') +
        code('// A JWT has 3 parts separated by dots\nheader.payload.signature\n// payload example\n{ "sub": "5", "role": "admin", "exp": 1767225600 }') +
        h('CORS, idempotency, pagination, caching') +
        ul([
          '<strong>CORS</strong>: browsers block a page on <code>site-a.com</code> from calling an API on <code>site-b.com</code> unless the API replies with headers like <code>Access-Control-Allow-Origin</code>.',
          '<strong>Idempotent</strong>: doing the same request many times gives the same final state as doing it once. It makes retries safe.',
          '<strong>Pagination</strong>: never return 1 million rows. Return a page at a time (<code>?page=2&amp;limit=20</code>, or a cursor).',
          '<strong>Caching</strong>: keep a copy of an expensive result (in Redis, a CDN, or the browser) so the next request is fast.',
        ]) +
        h('DTO basics') +
        p('A <strong>DTO</strong> (Data Transfer Object) is a plain object that describes the shape of data moving in or out of your API. It lets you validate input and hide fields you do not want to expose, such as <code>passwordHash</code>.'),
      keyPoints: [
        'HTTP is stateless: every request must carry what the server needs to know you.',
        'Pick the method by meaning (GET read, POST create, PUT replace, PATCH update, DELETE remove) and the status code by result.',
        '401 means "who are you?", 403 means "I know you, but no".',
        'Idempotent requests are safe to retry; POST is the usual exception.',
      ],
      tip: 'In an interview, always add one real example: "PUT /users/5 twice leaves the same data, but POST /users twice creates two users."',
      qna: [
        {
          id: 'what-is-rest',
          q: 'What is REST?',
          a: p('REST is a way of designing web APIs around <strong>resources</strong>. Each resource has a URL (<code>/users/5</code>), and you use standard HTTP methods to act on it. REST APIs are stateless, usually exchange JSON, and use status codes to tell the result.') + ia('REST is an architectural style where resources are identified by URLs and manipulated through standard HTTP methods. It is stateless, so each request carries all the information needed to process it.'),
        },
        {
          id: 'put-vs-patch',
          q: 'What is the difference between PUT and PATCH?',
          a: p('<strong>PUT</strong> replaces the whole resource. You send every field, and missing fields may be wiped. <strong>PATCH</strong> changes only the fields you send.') + code('PUT   /users/5  { "name": "Asha", "email": "a@x.com", "age": 30 }\nPATCH /users/5  { "age": 31 }') + p('PUT is idempotent by definition. PATCH can be, but is not guaranteed to be.'),
        },
        {
          id: '401-vs-403',
          q: 'What is the difference between 401 and 403?',
          a: p('<strong>401 Unauthorized</strong> means the server does not know who you are (missing or invalid token). <strong>403 Forbidden</strong> means it knows who you are, but you do not have permission.') + rem('Despite its name, 401 is about authentication, not authorization.'),
        },
        {
          id: 'session-vs-jwt',
          q: 'Sessions vs JWT: what is the difference and the trade-off?',
          a: p('A session keeps state <strong>on the server</strong> and the client holds only an id. A JWT keeps the state <strong>inside the token</strong> and the server just verifies the signature.') + ul(['Session: easy to revoke (delete it), but needs shared storage when you scale to many servers.', 'JWT: no lookup, scales easily, but hard to revoke before it expires. Use short expiry plus refresh tokens.']),
        },
        {
          id: 'what-is-cors',
          q: 'What is CORS and why does it exist?',
          a: p('Browsers follow the <strong>same-origin policy</strong>: a script from one origin cannot read responses from another origin. CORS is the way a server says "this other origin is allowed". The server sends <code>Access-Control-Allow-Origin</code> and related headers. For some requests the browser first sends an <code>OPTIONS</code> "preflight" request to ask permission.') + rem('CORS is enforced by the browser. Tools like curl and Postman ignore it.'),
        },
        {
          id: 'what-is-idempotent',
          q: 'What does idempotent mean? Give an example.',
          a: p('An operation is idempotent if repeating it gives the same final result as doing it once. <code>DELETE /users/5</code> is idempotent: after the first call the user is gone, and later calls leave things the same. <code>POST /payments</code> is not, because each call can create a new payment. That is why payment APIs accept an <strong>idempotency key</strong>.'),
        },
      ],
      quiz: [
        { q: 'Which status code should a successful POST that creates a resource return?', options: ['200 OK', '201 Created', '204 No Content', '302 Found'], answer: 1, explain: '201 Created tells the client that a new resource now exists. 200 works but is less precise.' },
        { q: 'A logged-in normal user calls an admin-only endpoint. What should the API return?', options: ['401', '403', '404', '500'], answer: 1, explain: 'The user is authenticated (the server knows them) but not allowed. That is 403 Forbidden.' },
        { q: 'Which method is idempotent?', options: ['POST', 'PUT', 'None of them', 'Only GET'], answer: 1, explain: 'PUT replaces a resource with the same data each time, so repeating it changes nothing more. GET and DELETE are idempotent too.' },
        { q: 'Why is HTTP called stateless?', options: ['It never uses a database', 'The server keeps no memory of earlier requests by default', 'It only supports GET', 'It cannot send cookies'], answer: 1, explain: 'Each request stands alone. Tokens or cookies are added by us to carry identity across requests.' },
        { q: 'Where is CORS enforced?', options: ['By the database', 'By the browser', 'By the operating system', 'By curl'], answer: 1, explain: 'The browser blocks the response unless the server sends the right CORS headers. Non-browser clients do not enforce it.' },
      ],
    },

    /* ------------------------------------------------------------ 2 */
    {
      id: 'backend-frameworks',
      title: 'Backend Frameworks',
      description: 'What a framework gives you over raw Node.js, and how Express, Fastify, NestJS and others compare.',
      intro:
        p('You can build a server with plain Node.js (<code>http.createServer</code>), but you would have to parse URLs, read bodies, handle errors and organise code all by yourself. A <strong>framework</strong> gives you these pieces ready-made.') +
        h('What a framework usually provides') +
        ul(['Routing (which function handles which URL)', 'Middleware (steps that run before your handler)', 'Request body parsing and validation', 'Error handling', 'Structure for your code']) +
        h('Popular Node.js frameworks') +
        table(['Framework', 'Style', 'Good for'], [
          ['Express', 'Minimal, unopinionated', 'Small APIs, learning, huge ecosystem'],
          ['Fastify', 'Fast, schema-based, plugins', 'High-performance APIs'],
          ['Koa', 'Tiny core by Express authors, async/await first', 'Custom lightweight setups'],
          ['NestJS', 'Opinionated, modules + DI + decorators, TypeScript', 'Large, long-lived apps and teams'],
          ['Hapi', 'Configuration driven', 'Enterprise-style APIs'],
        ]) +
        h('Same hello world, three ways') +
        code("// Raw Node\nrequire('http').createServer((req, res) => {\n  res.end('hello');\n}).listen(3000);\n\n// Express\nconst app = require('express')();\napp.get('/', (req, res) => res.send('hello'));\napp.listen(3000);") +
        h('Other languages') +
        p('The same ideas exist everywhere: Spring Boot (Java), Django and FastAPI (Python), Laravel (PHP), Rails (Ruby), ASP.NET (C#), Gin (Go).') +
        h('Minimal vs opinionated') +
        p('<strong>Minimal</strong> frameworks (Express) let you decide everything, which is flexible but can turn messy as a team grows. <strong>Opinionated</strong> frameworks (NestJS, Spring) give a standard structure, so new developers find things quickly.'),
      keyPoints: [
        'A framework saves you from rewriting routing, parsing and error handling.',
        'Express is minimal and flexible; NestJS is structured and opinionated.',
        'NestJS runs on top of Express (or Fastify) under the hood.',
        'Choose by team size, project size and performance needs, not by hype.',
      ],
      tip: 'If asked "Why NestJS?", answer: structure, dependency injection, TypeScript and built-in tools for validation, auth and testing.',
      qna: [
        {
          id: 'why-framework',
          q: 'Why use a framework instead of plain Node.js?',
          a: p('Plain Node gives you only a low-level HTTP server. A framework adds routing, middleware, body parsing, error handling and a project structure, so you write business logic instead of plumbing. It also keeps a team consistent.'),
        },
        {
          id: 'express-vs-nest',
          q: 'Express vs NestJS: what is the difference?',
          a: p('<strong>Express</strong> is a thin layer. It has routes and middleware, and you choose the folder structure yourself. <strong>NestJS</strong> is a full framework built with TypeScript. It uses modules, controllers, services, dependency injection and decorators, and it can run on top of Express.') + ia('Express is minimal and flexible, NestJS is opinionated and structured. For small APIs I would pick Express; for a big team project I prefer NestJS.'),
        },
        {
          id: 'express-vs-fastify',
          q: 'Why is Fastify often faster than Express?',
          a: p('Fastify uses JSON schemas to compile fast serializers and validators, has a lightweight plugin system and a very efficient router. Express stays simple and does less optimisation by default.'),
        },
        {
          id: 'unopinionated',
          q: 'What does "unopinionated" mean?',
          a: p('The framework does not force a way of organising your code. Express lets you put routes, logic and DB calls anywhere. This is freedom, but also a risk of inconsistency.'),
        },
      ],
      quiz: [
        { q: 'Which framework is built around modules, dependency injection and decorators?', options: ['Express', 'Koa', 'NestJS', 'Hapi'], answer: 2, explain: 'NestJS is inspired by Angular and uses modules, providers (DI) and decorators.' },
        { q: 'Which is the best description of Express?', options: ['A database', 'A minimal, unopinionated web framework', 'A frontend library', 'A testing tool'], answer: 1, explain: 'Express is a small web framework offering routing and middleware without forcing a structure.' },
        { q: 'What do most backend frameworks give you that raw Node http does not?', options: ['A faster CPU', 'Routing and middleware', 'A free database', 'Automatic UI'], answer: 1, explain: 'Routing, middleware, parsing and error handling are what frameworks add on top of the raw server.' },
      ],
    },

    /* ------------------------------------------------------------ 3 */
    {
      id: 'event-loop',
      title: 'Event Loop',
      description: 'How Node.js handles thousands of requests on a single thread, and what blocks it.',
      intro:
        p('JavaScript runs your code on <strong>one thread</strong>. So how can Node.js serve thousands of users at once? The answer is the <strong>event loop</strong> and <strong>non-blocking I/O</strong>.') +
        h('The idea') +
        p('When you start a slow job such as reading a file, calling the database or making an HTTP call, Node does not wait. It hands the job to the operating system (or a thread pool through libuv) and keeps running other code. When the job finishes, its callback is put in a queue, and the event loop runs it as soon as the main thread is free.') +
        code("console.log('1 start');\nsetTimeout(() => console.log('3 timeout'), 0);\nPromise.resolve().then(() => console.log('2 promise'));\nconsole.log('1b end');\n// Output: 1 start, 1b end, 2 promise, 3 timeout") +
        h('Phases of the loop (simplified)') +
        ul(['<strong>Timers</strong>: <code>setTimeout</code>, <code>setInterval</code>', '<strong>Poll</strong>: I/O callbacks (network, files)', '<strong>Check</strong>: <code>setImmediate</code>', '<strong>Close callbacks</strong>', 'Between steps Node runs the <strong>microtask queue</strong>: <code>process.nextTick</code> first, then Promise callbacks']) +
        h('What blocks the loop?') +
        p('Any long synchronous work: a huge <code>for</code> loop, <code>JSON.parse</code> of a giant string, heavy crypto or <code>fs.readFileSync</code>. While it runs, <strong>no other request is served</strong>.') +
        code("// BAD: blocks every user for seconds\napp.get('/slow', (req, res) => {\n  let n = 0;\n  for (let i = 0; i < 5e9; i++) n += i;\n  res.send(String(n));\n});") +
        p('Fix it by moving CPU-heavy work to a <strong>worker thread</strong>, a separate process, or a queue.'),
      keyPoints: [
        'Node runs JavaScript on a single thread but delegates I/O, so it stays responsive.',
        'Promises (microtasks) run before timers when both are ready.',
        'Never block the loop with heavy synchronous work.',
        'CPU-heavy tasks belong in worker threads, child processes or a job queue.',
      ],
      tip: 'The classic question is the output order of setTimeout, Promise and console.log. Remember: sync code, then microtasks, then timers.',
      qna: [
        {
          id: 'what-is-event-loop',
          q: 'What is the event loop?',
          a: p('The event loop is the mechanism that lets Node.js do non-blocking work on a single thread. It keeps checking queues: when the call stack is empty it takes the next finished callback and runs it.') + ia('The event loop continuously checks the call stack and the callback queues. When the stack is empty, it moves the next callback in, which is how Node handles many concurrent I/O operations on one thread.'),
        },
        {
          id: 'single-thread-concurrency',
          q: 'If Node is single-threaded, how does it handle many requests?',
          a: p('Most of a request is <strong>waiting</strong> (database, network, disk). Node starts that I/O, does not wait, and serves other requests. When the I/O completes, the callback runs. Under the hood libuv uses the OS and a small thread pool for the waiting part.'),
        },
        {
          id: 'nexttick-vs-promise-vs-timeout',
          q: 'What is the order of process.nextTick, Promise.then, setTimeout and setImmediate?',
          a: p('After the current synchronous code: <code>process.nextTick</code> first, then Promise callbacks (microtasks), then timers (<code>setTimeout</code>), and <code>setImmediate</code> runs in the check phase. Between <code>setTimeout(0)</code> and <code>setImmediate</code> the order from the main module can vary.'),
        },
        {
          id: 'blocking-vs-nonblocking',
          q: 'What is blocking vs non-blocking code?',
          a: p('<strong>Blocking</strong> code stops everything until it finishes (<code>fs.readFileSync</code>). <strong>Non-blocking</strong> code starts work and continues, getting the result later via a callback or Promise (<code>fs.promises.readFile</code>).') + code("// blocking\nconst data = fs.readFileSync('a.txt');\n// non-blocking\nconst data2 = await fs.promises.readFile('a.txt');"),
        },
        {
          id: 'cpu-heavy-tasks',
          q: 'How do you handle CPU-heavy work in Node.js?',
          a: p('Move it away from the main thread: use <strong>worker threads</strong>, a <strong>child process</strong>, or push it into a <strong>queue</strong> (like BullMQ) processed by separate workers. You can also scale with the <code>cluster</code> module.'),
        },
      ],
      quiz: [
        { q: 'What is the output order? console.log("A"); setTimeout(()=>console.log("B"),0); Promise.resolve().then(()=>console.log("C")); console.log("D");', options: ['A B C D', 'A D C B', 'A C D B', 'A D B C'], answer: 1, explain: 'Sync code runs first (A, D), then the microtask (C), then the timer (B).' },
        { q: 'Which of these will block the event loop?', options: ['await fetch(url)', 'fs.promises.readFile', 'A synchronous loop running 5 billion times', 'setTimeout'], answer: 2, explain: 'Heavy synchronous computation keeps the single thread busy, so no other request can be served.' },
        { q: 'Which solution suits a CPU-heavy task like resizing many images?', options: ['More await keywords', 'Worker threads or a job queue', 'Using console.log', 'Using a bigger variable'], answer: 1, explain: 'Heavy CPU work should run off the main thread so the loop stays free.' },
        { q: 'Who actually performs async I/O work behind the scenes in Node?', options: ['The browser', 'libuv (OS and thread pool)', 'The garbage collector', 'The package manager'], answer: 1, explain: 'libuv provides the event loop and delegates I/O to the OS or its thread pool.' },
      ],
    },

    /* ------------------------------------------------------------ 4 */
    {
      id: 'request-and-response-lifecycle',
      title: 'Request & Response Lifecycle',
      description: 'The journey of one HTTP request from the browser to your code and back.',
      intro:
        p('Understanding the full journey of a request helps you debug problems and explain how a backend works.') +
        h('Step by step') +
        ul([
          '<strong>1. DNS</strong>: the browser turns <code>api.example.com</code> into an IP address.',
          '<strong>2. Connection</strong>: a TCP connection (and TLS for HTTPS) is opened.',
          '<strong>3. Request sent</strong>: method, path, headers and body travel to the server.',
          '<strong>4. Reverse proxy / load balancer</strong> (like Nginx) forwards it to one of your app servers.',
          '<strong>5. Your framework</strong> parses the request, runs middleware, finds the matching route.',
          '<strong>6. Controller / handler</strong> calls a service, which uses the database.',
          '<strong>7. Response built</strong>: status code, headers, JSON body.',
          '<strong>8. Response travels back</strong> to the client, which renders or uses it.',
        ]) +
        h('Inside the server') +
        code("request\n  -> logger middleware\n  -> body parser\n  -> auth middleware\n  -> route match: POST /orders\n  -> validation\n  -> controller -> service -> database\n  -> response\n(any step can stop early and send an error)") +
        h('What a request contains') +
        ul(['<strong>Method</strong> and <strong>URL</strong> (path + query string)', '<strong>Headers</strong>: metadata like <code>Content-Type</code>, <code>Authorization</code>', '<strong>Body</strong>: data for POST, PUT, PATCH']) +
        h('What a response contains') +
        ul(['<strong>Status code</strong> (200, 404...)', '<strong>Headers</strong>: <code>Content-Type</code>, <code>Set-Cookie</code>, cache headers', '<strong>Body</strong>: usually JSON']) +
        rem('A handler must send exactly one response. Sending two causes the error "Cannot set headers after they are sent".'),
      keyPoints: [
        'Request path: DNS, TCP/TLS, proxy, framework, middleware, route, handler, database, response.',
        'Any middleware can end the cycle early (for example, auth returning 401).',
        'Each request must get exactly one response.',
        'Headers carry metadata, the body carries data.',
      ],
      tip: 'Draw the flow on paper in the interview: client, DNS, load balancer, server, DB, and back. It shows you see the whole picture.',
      qna: [
        {
          id: 'what-happens-url',
          q: 'What happens when you type a URL and press enter?',
          a: p('The browser resolves the domain through DNS, opens a TCP connection (plus a TLS handshake for HTTPS), sends an HTTP request, the server processes it and returns a response, and the browser renders the result and loads extra files like CSS and JS.'),
        },
        {
          id: 'query-vs-params-vs-body',
          q: 'What is the difference between query params, route params and the body?',
          a: code('GET  /users/5?role=admin\n          ^route    ^query\nPOST /users   body: { "name": "Asha" }') + ul(['<strong>Route param</strong> (<code>/users/:id</code>): identifies one resource.', '<strong>Query param</strong> (<code>?role=admin</code>): filters, sorting, pagination.', '<strong>Body</strong>: the data you create or update, sent as JSON.']),
        },
        {
          id: 'headers-purpose',
          q: 'What are HTTP headers used for? Name a few.',
          a: p('Headers are key-value metadata about the request or response. Examples: <code>Content-Type</code> (format of the body), <code>Authorization</code> (credentials), <code>Accept</code> (what the client wants back), <code>Cache-Control</code>, <code>Set-Cookie</code>.'),
        },
        {
          id: 'reverse-proxy',
          q: 'What is a reverse proxy and why use one?',
          a: p('A reverse proxy (Nginx, for example) sits in front of your app servers. It can terminate HTTPS, balance load between servers, serve static files, cache responses and hide the internal servers.'),
        },
        {
          id: 'headers-already-sent',
          q: 'What does "Cannot set headers after they are sent" mean?',
          a: p('Your code tried to send a second response for the same request. Typical cause: missing <code>return</code> after <code>res.send()</code> in an <code>if</code> block.') + code("if (!user) {\n  return res.status(404).json({ message: 'Not found' }); // return!\n}\nres.json(user);"),
        },
      ],
      quiz: [
        { q: 'Which part of the request identifies ONE specific resource?', options: ['Query string', 'Route parameter such as /users/5', 'User-Agent header', 'Cookie'], answer: 1, explain: 'A route parameter like :id points to a single resource. Query strings usually filter or sort lists.' },
        { q: 'What does a reverse proxy like Nginx NOT typically do?', options: ['Terminate HTTPS', 'Balance load', 'Write your business logic', 'Serve static files'], answer: 2, explain: 'Business logic lives in your application. The proxy handles traffic concerns.' },
        { q: 'You see "Cannot set headers after they are sent". Most likely cause?', options: ['Database is down', 'Sending two responses for one request', 'Wrong port', 'Missing npm package'], answer: 1, explain: 'A handler responded twice, often because a return is missing after an early response.' },
      ],
    },

    /* ------------------------------------------------------------ 5 */
    {
      id: 'routing',
      title: 'Routing',
      description: 'Mapping a method and URL to the function that handles it, with clean REST naming.',
      intro:
        p('<strong>Routing</strong> decides which piece of code runs for a given HTTP method and URL path. A route is: <em>method + path + handler</em>.') +
        code("// Express\napp.get('/users', listUsers);\napp.get('/users/:id', getUser);\napp.post('/users', createUser);\napp.put('/users/:id', replaceUser);\napp.patch('/users/:id', updateUser);\napp.delete('/users/:id', deleteUser);") +
        h('Reading data from the URL') +
        code("app.get('/users/:id', (req, res) => {\n  req.params.id;      // '5'   from /users/5\n  req.query.role;     // 'admin' from ?role=admin\n});\napp.post('/users', (req, res) => {\n  req.body;           // parsed JSON body\n});") +
        h('RESTful naming rules') +
        ul([
          'Use <strong>nouns, plural</strong>: <code>/users</code>, not <code>/getUsers</code>.',
          'The <strong>method</strong> carries the action, not the URL.',
          'Nest only when it makes sense: <code>/users/5/orders</code>.',
          'Use lowercase and hyphens: <code>/order-items</code>.',
          'Version your API: <code>/api/v1/users</code>.',
        ]) +
        table(['Bad', 'Good'], [
          ['POST /createUser', 'POST /users'],
          ['GET /getOrderById?id=3', 'GET /orders/3'],
          ['POST /deleteUser/5', 'DELETE /users/5'],
        ]) +
        h('Grouping routes with a router') +
        code("const router = require('express').Router();\nrouter.get('/', listUsers);\nrouter.get('/:id', getUser);\napp.use('/api/v1/users', router);") +
        rem('Order matters. Put specific routes (<code>/users/me</code>) before dynamic ones (<code>/users/:id</code>), or "me" will be treated as an id.'),
      keyPoints: [
        'A route = HTTP method + path + handler.',
        'Route params identify a resource, query params filter it, body carries the data.',
        'Use plural nouns in URLs and let the method describe the action.',
        'Order of routes matters: specific before dynamic.',
      ],
      tip: 'Be ready to fix a bad URL like POST /deleteUser/5 into DELETE /users/5. It is a favourite interview question.',
      qna: [
        {
          id: 'what-is-routing',
          q: 'What is routing in a backend framework?',
          a: p('Routing is the process of matching an incoming request (method and path) to the handler function that should respond. The framework keeps a table of routes and picks the first one that matches.'),
        },
        {
          id: 'rest-url-design',
          q: 'How do you design clean REST URLs?',
          a: ul(['Use plural nouns for resources: <code>/products</code>.', 'Identify one item with an id: <code>/products/12</code>.', 'Use methods for actions, not verbs in URLs.', 'Use query strings for filtering, sorting and paging: <code>/products?category=books&amp;page=2</code>.', 'Prefix with a version: <code>/api/v1</code>.']),
        },
        {
          id: 'route-order',
          q: 'Why does route order matter?',
          a: p('Frameworks check routes top to bottom. If <code>/users/:id</code> comes first, a request to <code>/users/me</code> matches it with <code>id = "me"</code>. Declare <code>/users/me</code> first.'),
        },
        {
          id: 'api-versioning',
          q: 'Why version an API and how?',
          a: p('So you can change behaviour without breaking existing clients. The most common way is in the path (<code>/v1/users</code>). Other ways: a header (<code>Accept-Version</code>) or a query parameter.'),
        },
        {
          id: 'not-found-route',
          q: 'How do you handle an unknown route?',
          a: p('Add a catch-all handler at the end that returns a 404 JSON response.') + code("app.use((req, res) => {\n  res.status(404).json({ message: 'Route not found' });\n});"),
        },
      ],
      quiz: [
        { q: 'Which is the best RESTful way to delete user 5?', options: ['POST /deleteUser/5', 'GET /users/delete?id=5', 'DELETE /users/5', 'PUT /users/5/delete'], answer: 2, explain: 'The URL names the resource and the method DELETE carries the action.' },
        { q: 'In /products?category=books&page=2, what is "category=books"?', options: ['Route param', 'Query parameter', 'Header', 'Body field'], answer: 1, explain: 'Everything after the ? is the query string, used for filtering, sorting and paging.' },
        { q: 'Why declare GET /users/me before GET /users/:id?', options: ['Alphabetical order', 'Otherwise "me" would match :id', 'It is faster', 'Express requires it for security'], answer: 1, explain: 'Routes match top to bottom, and :id matches any text, including "me".' },
        { q: 'Which is the usual way to version an API?', options: ['/v1/users in the path', 'Renaming the server', 'Changing the database name', 'Using a different port only'], answer: 0, explain: 'A version in the path is simple, visible and the most common choice.' },
      ],
    },

    /* ------------------------------------------------------------ 6 */
    {
      id: 'middleware',
      title: 'Middleware',
      description: 'Small functions that run between the request and your handler: logging, auth, parsing, errors.',
      intro:
        p('<strong>Middleware</strong> is a function that sits between the incoming request and your final route handler. It can read or change the request and response, end the request early, or pass control to the next step by calling <code>next()</code>.') +
        code("// logger middleware\nfunction logger(req, res, next) {\n  console.log(req.method, req.url);\n  next();                 // go to the next step\n}\napp.use(logger);\n\n// auth middleware\nfunction auth(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ message: 'Login required' });\n  }\n  next();\n}\napp.get('/profile', auth, (req, res) => res.json({ ok: true }));") +
        h('The chain') +
        code("request -> logger -> json parser -> auth -> handler -> response") +
        p('Middleware runs <strong>in the order you register it</strong>. If a middleware neither calls <code>next()</code> nor sends a response, the request hangs forever.') +
        h('Common uses') +
        ul(['Logging requests', 'Parsing JSON bodies (<code>express.json()</code>)', 'Authentication and authorization', 'CORS headers', 'Rate limiting', 'Compression and security headers (helmet)', 'Error handling']) +
        h('Error-handling middleware') +
        p('In Express an error handler has <strong>four</strong> parameters. It must be registered last.') +
        code("app.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ message: 'Something went wrong' });\n});") +
        rem('In NestJS the same ideas are split into Middleware, Guards, Interceptors, Pipes and Exception Filters, each with a clear job.'),
      keyPoints: [
        'Middleware = function(req, res, next) that runs before the handler.',
        'Call next() to continue, or send a response to stop.',
        'Order of registration is the order of execution.',
        'Error middleware has 4 arguments and goes last.',
      ],
      tip: 'A request that "hangs" often means a middleware forgot to call next() or send a response.',
      qna: [
        {
          id: 'what-is-middleware',
          q: 'What is middleware?',
          a: p('Middleware is code that runs between receiving the request and sending the response. It can modify the request, check something (like a token), or stop the flow. It keeps shared logic out of every route.') + ia('Middleware is a function with access to the request, response and the next function. It runs in sequence and either passes control with next() or ends the cycle by responding.'),
        },
        {
          id: 'what-does-next-do',
          q: 'What does next() do? What if you forget it?',
          a: p('<code>next()</code> passes control to the next middleware or route handler. If you forget it, and also do not send a response, the request is left hanging and the client times out.'),
        },
        {
          id: 'middleware-order',
          q: 'Why does the order of middleware matter?',
          a: p('They run top to bottom. For example, the JSON body parser must come <em>before</em> routes that read <code>req.body</code>, and an auth middleware must come before the routes it protects.'),
        },
        {
          id: 'global-vs-route-middleware',
          q: 'What is the difference between global and route-level middleware?',
          a: p('Global middleware (<code>app.use(fn)</code>) runs for every request. Route-level middleware is attached to specific routes (<code>app.get("/admin", auth, handler)</code>) and runs only there.'),
        },
        {
          id: 'error-middleware',
          q: 'How do error-handling middleware work in Express?',
          a: p('They take four arguments <code>(err, req, res, next)</code>. When any handler calls <code>next(err)</code> or throws, Express skips to the error middleware. It should be registered after all routes.'),
        },
      ],
      quiz: [
        { q: 'What are the arguments of a normal Express middleware?', options: ['(err, req, res)', '(req, res, next)', '(req, next)', '(res, next)'], answer: 1, explain: 'Normal middleware receives the request, the response and the next function.' },
        { q: 'A middleware neither calls next() nor sends a response. What happens?', options: ['Express sends 404', 'The request hangs', 'The server restarts', 'Next middleware runs anyway'], answer: 1, explain: 'Nothing continues the chain and nothing responds, so the client waits until timeout.' },
        { q: 'Where should the error-handling middleware be registered?', options: ['First', 'In the middle', 'After all routes', 'It does not matter'], answer: 2, explain: 'It must come last so errors from earlier routes and middleware reach it.' },
        { q: 'Which is a good use for middleware?', options: ['Checking the auth token for many routes', 'Defining a database table', 'Compiling TypeScript', 'Installing packages'], answer: 0, explain: 'Shared cross-cutting logic like auth, logging and parsing is exactly what middleware is for.' },
      ],
    },

    /* ------------------------------------------------------------ 7 */
    {
      id: 'validation-and-dtos',
      title: 'Validation & DTOs',
      description: 'Never trust user input: check it, shape it with DTOs, and hide fields you should not expose.',
      intro:
        p('Anything coming from a client can be wrong, missing or even malicious. <strong>Validation</strong> checks the data before your logic uses it. A <strong>DTO</strong> (Data Transfer Object) describes the allowed shape of that data.') +
        h('What is a DTO?') +
        p('A DTO is a simple object (no behaviour) that defines the fields moving into or out of your API. Typically you have one for <em>input</em> (create/update) and one for <em>output</em> (response).') +
        code("// Input DTO: what a client may send\nclass CreateUserDto {\n  name: string;\n  email: string;\n  password: string;\n}\n\n// Output DTO: what we send back (no password!)\nclass UserResponseDto {\n  id: number;\n  name: string;\n  email: string;\n}") +
        h('Why use DTOs?') +
        ul(['Validate input in one place', 'Stop clients from sending extra fields (like <code>isAdmin: true</code>)', 'Hide private fields such as <code>passwordHash</code>', 'Keep the API stable even if the database changes', 'Give clear documentation of the API']) +
        h('Validation example (NestJS style)') +
        code("import { IsEmail, IsString, MinLength } from 'class-validator';\n\nexport class CreateUserDto {\n  @IsString()\n  name: string;\n\n  @IsEmail()\n  email: string;\n\n  @MinLength(8)\n  password: string;\n}") +
        h('Validation by hand (plain Express)') +
        code("app.post('/users', (req, res) => {\n  const { name, email } = req.body;\n  if (!name || !email) {\n    return res.status(400).json({ message: 'name and email are required' });\n  }\n  // ...create user\n});") +
        h('Good practices') +
        ul(['Validate <strong>on the server</strong>, even if the frontend validates too.', 'Whitelist fields: drop anything not in the DTO.', 'Return <strong>400</strong> (or 422) with clear messages.', 'Validate types, ranges, formats and lengths.', 'Use parameterised queries to prevent SQL injection.']),
      keyPoints: [
        'A DTO defines the shape of data entering or leaving the API.',
        'Always validate on the server; frontend checks can be bypassed.',
        'Whitelist fields to prevent mass assignment, such as a user setting isAdmin.',
        'Use separate response DTOs to hide sensitive fields.',
      ],
      tip: 'Explain the difference: DTO is about data shape between layers, while an Entity maps to a database table.',
      qna: [
        {
          id: 'what-is-dto',
          q: 'What is a DTO?',
          a: p('DTO stands for <strong>Data Transfer Object</strong>. It is a plain object that defines what data goes into or comes out of an API endpoint. It has fields only, no business logic.') + ia('A DTO is an object that carries data between processes or layers. In an API it defines the request and response shapes, enabling validation and preventing leaking internal fields.'),
        },
        {
          id: 'dto-vs-entity',
          q: 'What is the difference between a DTO and an Entity?',
          a: p('An <strong>Entity</strong> represents a row in the database and may have fields like <code>passwordHash</code> and <code>createdAt</code>. A <strong>DTO</strong> represents what the API accepts or returns. Keeping them separate lets you change the database without breaking clients.'),
        },
        {
          id: 'why-validate-server',
          q: 'Why validate on the server if the frontend already validates?',
          a: p('Frontend checks are for user comfort only. Anyone can call your API with curl or Postman and skip the UI. The server is the last line of defence and must check everything.'),
        },
        {
          id: 'mass-assignment',
          q: 'What is mass assignment and how do DTOs help?',
          a: p('It is when you copy the whole request body into your model, letting a client set fields they should not, like <code>role: "admin"</code>. With a DTO whitelist, only the fields you declared are accepted and the rest are removed or rejected.'),
        },
        {
          id: '400-vs-422',
          q: 'Should validation errors return 400 or 422?',
          a: p('Both are used. <strong>400</strong> is a general "bad request" (malformed JSON, missing fields). <strong>422</strong> means the request is well-formed but the values are invalid. Pick one and be consistent, and always return a helpful message listing the problems.'),
        },
      ],
      quiz: [
        { q: 'What does DTO stand for?', options: ['Data Table Output', 'Data Transfer Object', 'Direct Transfer Operation', 'Database Type Object'], answer: 1, explain: 'A Data Transfer Object carries data in a defined shape between layers or across the API.' },
        { q: 'Why should a response DTO exclude passwordHash?', options: ['It saves memory', 'To avoid leaking sensitive data', 'Because JSON cannot hold it', 'It is not needed in the database'], answer: 1, explain: 'Response DTOs choose exactly which fields are exposed, so private fields never leave the server.' },
        { q: 'Where must input validation always happen?', options: ['Only in the browser', 'Only in the database', 'On the server', 'Nowhere if the UI is good'], answer: 2, explain: 'Clients can be bypassed, so the server must validate every request.' },
        { q: 'A client sends { "name": "A", "role": "admin" } to a create-user endpoint whose DTO has only name. Best behaviour?', options: ['Save role as admin', 'Strip or reject the unknown field', 'Crash the server', 'Ignore the name'], answer: 1, explain: 'Whitelisting removes or rejects unexpected fields, preventing privilege escalation.' },
      ],
    },

    /* ------------------------------------------------------------ 8 */
    {
      id: 'error-handling-and-logging',
      title: 'Error Handling & Logging',
      description: 'Return useful errors to clients, keep details for yourself, and log so problems can be traced.',
      intro:
        p('Things go wrong: invalid input, missing records, database outages, bugs. Good error handling means the client gets a <strong>clear, safe</strong> message and you get <strong>enough detail</strong> to fix the problem.') +
        h('Two kinds of errors') +
        ul(['<strong>Operational errors</strong> (expected): invalid input, record not found, timeout. Handle them and respond properly.', '<strong>Programmer errors</strong> (bugs): undefined variable, wrong logic. Log them, return 500, fix the code.']) +
        h('A consistent error response') +
        code('{\n  "statusCode": 404,\n  "message": "User 5 not found",\n  "error": "Not Found"\n}') +
        h('Central error handling (Express)') +
        code("class AppError extends Error {\n  constructor(message, status) {\n    super(message);\n    this.status = status;\n  }\n}\n\napp.get('/users/:id', async (req, res, next) => {\n  try {\n    const user = await db.find(req.params.id);\n    if (!user) throw new AppError('User not found', 404);\n    res.json(user);\n  } catch (err) {\n    next(err);          // send to the central handler\n  }\n});\n\napp.use((err, req, res, next) => {\n  const status = err.status || 500;\n  const message = status === 500 ? 'Internal server error' : err.message;\n  res.status(status).json({ message });\n});") +
        h('Logging') +
        p('A <strong>log</strong> is a record of what happened. Use levels so you can filter noise:') +
        table(['Level', 'Use for'], [['error', 'Something failed'], ['warn', 'Odd but not failing'], ['info', 'Normal events (server started, order created)'], ['debug', 'Detail for developers']]) +
        ul(['Use a library (pino, winston) instead of <code>console.log</code>.', 'Log as <strong>JSON</strong> so tools can search it.', 'Add a <strong>request id</strong> to every log line to trace one request across services.', '<strong>Never log</strong> passwords, tokens or card numbers.']) +
        rem('Do not send stack traces to the client in production. Log them on the server and send a short safe message.'),
      keyPoints: [
        'Handle expected errors with proper status codes; log unexpected ones and return 500.',
        'Use one central error handler and one consistent error format.',
        'Never leak stack traces or secrets to the client.',
        'Use log levels, structured JSON logs and request ids.',
      ],
      tip: 'Mention unhandled rejections: in async code always catch errors (or use a wrapper) so one failed Promise does not crash the process.',
      qna: [
        {
          id: 'why-central-handler',
          q: 'Why use a central error handler?',
          a: p('It avoids repeating try/catch response logic in every route. All errors flow to one place where you decide the status code, the message and what to log, so responses stay consistent.'),
        },
        {
          id: 'operational-vs-programmer',
          q: 'What is the difference between operational and programmer errors?',
          a: p('<strong>Operational</strong> errors come from the outside world and can be expected (bad input, network down). You handle them. <strong>Programmer</strong> errors are bugs in your code. You cannot recover gracefully, so you log them and fix the code.'),
        },
        {
          id: 'what-to-log',
          q: 'What should and should not be logged?',
          a: p('Log: requests (method, path, status, duration), errors with stack traces, important business events and a request id. Do <strong>not</strong> log passwords, tokens, API keys or personal data like card numbers.'),
        },
        {
          id: 'log-levels',
          q: 'What are log levels?',
          a: p('Levels classify messages by importance: <code>error</code>, <code>warn</code>, <code>info</code>, <code>debug</code>. In production you usually show info and above; in development you may turn on debug.'),
        },
        {
          id: 'unhandled-rejection',
          q: 'What happens with an unhandled Promise rejection in Node?',
          a: p('In modern Node, an unhandled rejection can crash the process. Always <code>await</code> inside try/catch (or pass errors to <code>next(err)</code>) and consider listening to <code>process.on("unhandledRejection")</code> for logging before exiting.'),
        },
      ],
      quiz: [
        { q: 'What should a client receive for an unexpected bug in production?', options: ['The full stack trace', 'A short generic 500 message', 'The database password', 'No response at all'], answer: 1, explain: 'Keep details in your logs and send only a safe, generic message to the client.' },
        { q: 'Which log level suits "Server started on port 3000"?', options: ['error', 'warn', 'info', 'fatal'], answer: 2, explain: 'Normal lifecycle events are info.' },
        { q: 'Which should NEVER appear in logs?', options: ['Request path', 'Response status', 'User password', 'Request duration'], answer: 2, explain: 'Passwords, tokens and secrets must never be logged.' },
        { q: 'Why add a request id to log lines?', options: ['To make logs longer', 'To trace everything that happened for one request', 'To encrypt logs', 'To speed up the server'], answer: 1, explain: 'A shared id lets you filter all lines (even across services) that belong to one request.' },
      ],
    },

    /* ------------------------------------------------------------ 9 */
    {
      id: 'configuration-and-environments',
      title: 'Configuration & Environments',
      description: 'Keep secrets and settings out of your code and run the same app in dev, test and production.',
      intro:
        p('The same code runs in different places: your laptop (development), a test server, and production. What changes between them (database URL, API keys, port) is <strong>configuration</strong>. It should live <strong>outside the code</strong>.') +
        h('Environment variables') +
        p('Environment variables are key-value settings given to the process by the operating system. In Node you read them with <code>process.env</code>.') +
        code("// .env file (never commit this)\nPORT=3000\nDATABASE_URL=postgres://user:pass@localhost:5432/app\nJWT_SECRET=change-me\nNODE_ENV=development\n\n// code\nrequire('dotenv').config();\nconst port = process.env.PORT || 3000;") +
        h('Rules') +
        ul(['<strong>Never commit secrets</strong> to Git. Add <code>.env</code> to <code>.gitignore</code>.', 'Commit a <code>.env.example</code> with fake values so others know what is needed.', 'Use a secrets manager (AWS Secrets Manager, Vault) in production.', '<strong>Validate</strong> config at startup and crash early if something is missing.', 'Keep one codebase and change only the config per environment.']) +
        h('Typical environments') +
        table(['Environment', 'Purpose'], [['development', 'Your laptop, debug logs, local DB'], ['test', 'Automated tests, throw-away DB'], ['staging', 'Copy of production for final checks'], ['production', 'Real users, real data, strict security']]) +
        h('Config validation example') +
        code("const required = ['DATABASE_URL', 'JWT_SECRET'];\nfor (const key of required) {\n  if (!process.env[key]) {\n    throw new Error('Missing env var: ' + key);\n  }\n}") +
        rem('Environment variables are always strings. Convert them: <code>Number(process.env.PORT)</code>.'),
      keyPoints: [
        'Config belongs in environment variables, not in code.',
        'Never commit .env files or secrets; commit .env.example instead.',
        'Validate required config on startup and fail fast.',
        'Environment variables are strings; convert types yourself.',
      ],
      tip: 'The 12-factor app rule is: store config in the environment. Quote it, and it signals you know modern practice.',
      qna: [
        {
          id: 'why-env-vars',
          q: 'Why use environment variables instead of hard-coding values?',
          a: p('Secrets in code can leak through Git, and the same build must work in many environments. Environment variables let you change database URLs, keys and ports per environment without changing or rebuilding code.'),
        },
        {
          id: 'env-in-git',
          q: 'Should .env be committed to Git?',
          a: p('No. It contains secrets. Add it to <code>.gitignore</code> and commit a <code>.env.example</code> with placeholder values instead. If a secret was committed by mistake, treat it as leaked and rotate it.'),
        },
        {
          id: 'node-env',
          q: 'What is NODE_ENV?',
          a: p('A convention variable (<code>development</code>, <code>test</code>, <code>production</code>) that libraries and your code use to switch behaviour, such as caching templates, verbose errors or logging level.'),
        },
        {
          id: 'fail-fast',
          q: 'What does "fail fast" mean for configuration?',
          a: p('Check all required settings when the app starts. If one is missing, stop immediately with a clear error instead of crashing later in the middle of a user request.'),
        },
        {
          id: 'secrets-prod',
          q: 'How do you manage secrets in production?',
          a: p('Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, cloud provider secrets) or your platform\'s encrypted env settings. Limit who can read them, and rotate them regularly.'),
        },
      ],
      quiz: [
        { q: 'Where do you read an environment variable in Node.js?', options: ['process.env', 'global.config', 'window.env', 'os.vars'], answer: 0, explain: 'process.env holds all environment variables as strings.' },
        { q: 'Which file should be listed in .gitignore?', options: ['.env', '.env.example', 'package.json', 'README.md'], answer: 0, explain: '.env holds real secrets. The .env.example with fake values is safe to commit.' },
        { q: 'process.env.PORT is "3000". What type is it?', options: ['number', 'string', 'boolean', 'object'], answer: 1, explain: 'All environment variables are strings, so convert with Number() when needed.' },
      ],
    },

    /* ------------------------------------------------------------ 10 */
    {
      id: 'file-uploads',
      title: 'File Uploads',
      description: 'How files travel in a request, how to receive them safely, and where to store them.',
      intro:
        p('JSON cannot carry big binary files comfortably. For uploads, the browser sends <code>multipart/form-data</code>, a body made of several "parts", each part being a field or a file.') +
        code("<form method=\"POST\" action=\"/upload\" enctype=\"multipart/form-data\">\n  <input type=\"file\" name=\"avatar\">\n  <button>Send</button>\n</form>") +
        h('Receiving files in Express with multer') +
        code("const multer = require('multer');\nconst upload = multer({\n  dest: 'uploads/',\n  limits: { fileSize: 2 * 1024 * 1024 },   // 2 MB\n  fileFilter: (req, file, cb) => {\n    const ok = ['image/png', 'image/jpeg'].includes(file.mimetype);\n    cb(ok ? null : new Error('Only PNG or JPEG'), ok);\n  },\n});\n\napp.post('/upload', upload.single('avatar'), (req, res) => {\n  res.status(201).json({ file: req.file.filename });\n});") +
        h('Where to store files') +
        table(['Option', 'Pros', 'Cons'], [
          ['Local disk', 'Simple', 'Lost when the server is replaced, hard to scale'],
          ['Object storage (S3, GCS)', 'Scalable, cheap, durable', 'Extra setup'],
          ['Database (BLOB)', 'One place', 'Heavy and slow for big files'],
        ]) +
        p('Best practice: store the <strong>file in object storage</strong> and keep only its <strong>URL or key</strong> in the database.') +
        h('Pre-signed URLs') +
        p('Instead of passing large files through your server, the backend creates a short-lived <strong>pre-signed URL</strong>. The client uploads directly to S3 with it. Your server stays light.') +
        h('Security checklist') +
        ul(['Limit file size.', 'Allow only expected types, and check the real content, not only the extension.', 'Rename files (random names) to avoid overwriting and path tricks.', 'Never serve uploads from a folder that can execute code.', 'Scan for viruses if files are shared with others.']),
      keyPoints: [
        'Files are sent as multipart/form-data, not JSON.',
        'Use a library like multer to parse them and set size and type limits.',
        'Store files in object storage; keep only the URL in the database.',
        'Pre-signed URLs let clients upload directly to storage.',
      ],
      tip: 'Mention validating the MIME type and size on the server. Client-side checks are easily bypassed.',
      qna: [
        {
          id: 'multipart-form-data',
          q: 'What is multipart/form-data?',
          a: p('It is a request format that splits the body into parts separated by a boundary. Each part can be a text field or a file with its own headers. Browsers use it for file uploads.'),
        },
        {
          id: 'store-db-or-s3',
          q: 'Should you store uploaded files in the database?',
          a: p('Usually not. Large binary data makes the database heavy and slow. Store files in object storage like S3 and save only the path or URL in the database.'),
        },
        {
          id: 'presigned-url',
          q: 'What is a pre-signed URL?',
          a: p('A temporary URL, created by your backend with its storage credentials, that lets a client upload (or download) one specific file straight to the storage service. It expires after a short time, so it is safe and avoids sending big files through your server.'),
        },
        {
          id: 'upload-security',
          q: 'How do you make file uploads secure?',
          a: ul(['Set a maximum size.', 'Whitelist allowed MIME types and check actual content.', 'Generate your own file names.', 'Store outside the web root or in object storage.', 'Authenticate the user and rate-limit uploads.', 'Scan for malware when needed.']),
        },
        {
          id: 'large-files',
          q: 'How do you handle very large files?',
          a: p('Use <strong>streams</strong> so the file is never fully loaded in memory, and consider <strong>chunked or resumable uploads</strong> plus direct-to-storage uploads with pre-signed URLs.'),
        },
      ],
      quiz: [
        { q: 'Which content type is used for browser file uploads?', options: ['application/json', 'text/plain', 'multipart/form-data', 'image/png only'], answer: 2, explain: 'multipart/form-data lets a request carry files and fields together.' },
        { q: 'Best place to keep user-uploaded images in a scalable app?', options: ['Inside the source code folder', 'Object storage such as S3', 'In a cookie', 'In the .env file'], answer: 1, explain: 'Object storage is durable and scalable. The database keeps just the file URL or key.' },
        { q: 'Why check file type on the server?', options: ['Client checks are easy to bypass', 'It speeds up uploads', 'Browsers cannot read types', 'It is required by HTTP'], answer: 0, explain: 'Anyone can send a request without your UI, so the server must enforce rules.' },
      ],
    },

    /* ------------------------------------------------------------ 11 */
    {
      id: 'real-time-and-websockets',
      title: 'Real-time & WebSockets',
      description: 'Pushing data to clients instantly: WebSockets, Server-Sent Events, polling and Socket.IO.',
      intro:
        p('Normal HTTP is <strong>request then response</strong>: the client always asks first. For chat, live scores, notifications or dashboards, the server must be able to <strong>push</strong> data the moment it happens.') +
        h('Ways to get live data') +
        table(['Technique', 'How it works', 'Use when'], [
          ['Short polling', 'Client asks every few seconds', 'Simple, low-frequency updates'],
          ['Long polling', 'Server holds the request until there is news', 'Fallback when WebSockets are not possible'],
          ['Server-Sent Events (SSE)', 'One-way stream from server to browser over HTTP', 'Notifications, live feeds'],
          ['WebSockets', 'One persistent, two-way connection', 'Chat, games, collaboration'],
        ]) +
        h('How a WebSocket starts') +
        p('The client sends a normal HTTP request with <code>Upgrade: websocket</code>. If the server agrees (status <strong>101 Switching Protocols</strong>), the same TCP connection stays open and both sides can send messages at any time with very little overhead.') +
        code("// server (ws library)\nconst { WebSocketServer } = require('ws');\nconst wss = new WebSocketServer({ port: 8080 });\nwss.on('connection', (socket) => {\n  socket.on('message', (msg) => {\n    // broadcast to everyone\n    wss.clients.forEach((c) => c.send(msg.toString()));\n  });\n});\n\n// browser\nconst ws = new WebSocket('ws://localhost:8080');\nws.onmessage = (e) => console.log(e.data);\nws.send('hello');") +
        h('Socket.IO') +
        p('A popular library on top of WebSockets. It adds <strong>rooms</strong>, automatic reconnection, fallbacks and event names, so you write <code>socket.emit("chat", data)</code> instead of handling raw messages.') +
        h('Scaling challenges') +
        ul(['Each connection stays open, so memory per server matters.', 'With many servers, a message from user A on server 1 must reach user B on server 2. Use a shared pub/sub such as <strong>Redis</strong>.', 'Authenticate during the handshake (token), not after.', 'Handle disconnects and reconnects (heartbeat/ping).']),
      keyPoints: [
        'HTTP is client-initiated; WebSockets keep a two-way connection open.',
        'SSE is simpler when only the server needs to push.',
        'A WebSocket starts with an HTTP upgrade (101 Switching Protocols).',
        'Scaling to many servers needs a pub/sub layer like Redis.',
      ],
      tip: 'If the interviewer asks "WebSocket or SSE?", ask whether the client also needs to send data in real time. If not, SSE is often enough.',
      qna: [
        {
          id: 'what-is-websocket',
          q: 'What is a WebSocket?',
          a: p('A protocol that gives you a single, long-lived, <strong>two-way</strong> connection between client and server. After an HTTP handshake, either side can send messages at any time with low overhead.') + ia('WebSocket is a full-duplex communication protocol over a persistent TCP connection, started through an HTTP upgrade, ideal for real-time features like chat.'),
        },
        {
          id: 'websocket-vs-http',
          q: 'WebSocket vs HTTP: what is the difference?',
          a: p('HTTP is request-response and stateless: the client must ask every time, and each request has header overhead. A WebSocket stays open, so the server can push data instantly and messages are tiny.'),
        },
        {
          id: 'sse-vs-websocket',
          q: 'SSE vs WebSocket?',
          a: p('<strong>SSE</strong> is one-way (server to client) over plain HTTP, auto-reconnects, and is easy to use. <strong>WebSockets</strong> are two-way and better for chat or games where the client also sends often.'),
        },
        {
          id: 'polling',
          q: 'What is polling and what is its drawback?',
          a: p('Polling means the client repeatedly asks "anything new?". It is simple but wasteful: many requests return nothing, and updates arrive with a delay equal to the polling interval.'),
        },
        {
          id: 'scale-websockets',
          q: 'How do you scale WebSockets across multiple servers?',
          a: p('Put a load balancer in front (with sticky sessions if needed) and connect the servers through a <strong>pub/sub</strong> system like Redis. When one server receives a message, it publishes it, and every server forwards it to its own connected users.'),
        },
      ],
      quiz: [
        { q: 'Which status code confirms a WebSocket upgrade?', options: ['200', '101', '301', '204'], answer: 1, explain: '101 Switching Protocols means the server agreed to change from HTTP to WebSocket.' },
        { q: 'Which technique is one-way from server to browser over plain HTTP?', options: ['WebSocket', 'Server-Sent Events', 'FTP', 'SMTP'], answer: 1, explain: 'SSE streams events from the server to the client only.' },
        { q: 'Why is Redis often used with WebSockets at scale?', options: ['To store images', 'As pub/sub so messages reach users on other servers', 'To compile code', 'To replace HTTP'], answer: 1, explain: 'Pub/sub lets one server broadcast an event to all servers that hold connected clients.' },
        { q: 'Which feature suits WebSockets best?', options: ['A static blog page', 'A live chat application', 'A nightly report', 'A file download'], answer: 1, explain: 'Chat needs instant two-way messaging, which is what WebSockets provide.' },
      ],
    },

    /* ------------------------------------------------------------ 12 */
    {
      id: 'monolith-vs-microservices',
      title: 'Monolith vs Microservices',
      description: 'One big app or many small services: trade-offs, communication styles and when to choose each.',
      intro:
        p('There are two broad ways to organise a backend.') +
        h('Monolith') +
        p('The whole application (users, orders, payments, emails) is <strong>one codebase</strong>, built and deployed as <strong>one unit</strong>, usually with one database.') +
        h('Microservices') +
        p('The application is split into <strong>small independent services</strong>, each owning one business area and often its own database. They talk over the network (HTTP/REST, gRPC, or messages).') +
        code("Monolith:        [ users + orders + payments ] -> one DB\n\nMicroservices:   [users] -> users DB\n                 [orders] -> orders DB\n                 [payments] -> payments DB\n                 (talk via HTTP or message queue)") +
        table(['', 'Monolith', 'Microservices'], [
          ['Deploy', 'All at once', 'Each service separately'],
          ['Scaling', 'Scale the whole app', 'Scale only the busy service'],
          ['Complexity', 'Simple to start', 'Hard: network, tracing, many deployments'],
          ['Data consistency', 'Easy (one DB, transactions)', 'Hard (eventual consistency)'],
          ['Team size', 'Good for small teams', 'Good for many independent teams'],
          ['Failure', 'One bug can take all down', 'Failures can be isolated'],
          ['Tech choice', 'One stack', 'Different stacks per service'],
        ]) +
        h('How services talk') +
        ul(['<strong>Synchronous</strong>: REST or gRPC. Simple, but the caller waits and a slow service slows everyone.', '<strong>Asynchronous</strong>: message queue or event bus (RabbitMQ, Kafka, SQS). Services are decoupled and more resilient.']) +
        h('Common supporting pieces') +
        ul(['<strong>API Gateway</strong>: single entry point for clients', '<strong>Service discovery</strong> and load balancing', '<strong>Distributed tracing</strong> and central logging', '<strong>Circuit breaker</strong>: stop calling a failing service']) +
        rem('Start with a well-structured (modular) monolith. Split into microservices only when scale or team size truly demands it.'),
      keyPoints: [
        'Monolith: one deployable unit, simple, great for starting out.',
        'Microservices: independent services, scalable per part, but operationally complex.',
        'Services communicate with REST/gRPC or asynchronous messages.',
        'Do not adopt microservices without a real need.',
      ],
      tip: 'A strong answer: "I would start with a modular monolith and extract services when a clear boundary and scaling need appears."',
      qna: [
        {
          id: 'what-is-monolith',
          q: 'What is a monolith?',
          a: p('A single application where all features live in one codebase and are deployed together. It is simple to develop, test and deploy at first, but a big monolith can become hard to change and scale.'),
        },
        {
          id: 'what-are-microservices',
          q: 'What are microservices?',
          a: p('An architecture where the system is a set of small, independently deployable services, each focused on one business capability and usually owning its data. They communicate over the network.') + ia('Microservices split an application into small, loosely coupled services that can be developed, deployed and scaled independently.'),
        },
        {
          id: 'when-microservices',
          q: 'When should you choose microservices?',
          a: ul(['Many teams need to work and deploy independently.', 'Parts of the system have very different scaling needs.', 'You need fault isolation between areas.', 'The domain boundaries are already clear.']) + p('For a small team or a new product, a monolith is usually the better start.'),
        },
        {
          id: 'microservice-challenges',
          q: 'What are the challenges of microservices?',
          a: p('Network failures and latency, data consistency across databases, debugging across services (need tracing), many deployments to manage, API versioning between services, and higher infrastructure cost.'),
        },
        {
          id: 'sync-vs-async-comm',
          q: 'Synchronous vs asynchronous service communication?',
          a: p('<strong>Synchronous</strong> (REST/gRPC): the caller waits for the answer, easy to understand, but tightly coupled in time. <strong>Asynchronous</strong> (queues, events): the caller sends a message and moves on, which is more resilient and decoupled but harder to follow.'),
        },
        {
          id: 'circuit-breaker',
          q: 'What is a circuit breaker?',
          a: p('A pattern that stops calling a service that keeps failing. After too many failures the circuit "opens" and requests fail fast (or use a fallback). After a pause it tests again. This prevents one failing service from dragging down all others.'),
        },
      ],
      quiz: [
        { q: 'Which statement about a monolith is true?', options: ['It is always bad', 'It is one deployable unit', 'It must use many databases', 'It cannot scale'], answer: 1, explain: 'A monolith is built and deployed as one unit. It is often the right choice at the start.' },
        { q: 'A main benefit of microservices is:', options: ['No network calls', 'Scaling and deploying parts independently', 'Easier transactions', 'No need for monitoring'], answer: 1, explain: 'Each service can be scaled and released on its own, at the cost of more complexity.' },
        { q: 'Which is a hard problem in microservices?', options: ['Writing a for loop', 'Data consistency across services', 'Using JSON', 'Naming variables'], answer: 1, explain: 'With separate databases you lose simple transactions and must handle eventual consistency.' },
        { q: 'What is the purpose of a message queue between services?', options: ['To decouple them and add resilience', 'To style the UI', 'To compile code', 'To replace the database'], answer: 0, explain: 'The sender does not wait for the receiver, so slow or temporarily failing services do not block others.' },
      ],
    },

    /* ------------------------------------------------------------ 13 */
    {
      id: 'clean-architecture-and-layers',
      title: 'Clean Architecture & Layers',
      description: 'Organise code into controller, service and repository layers so it stays easy to test and change.',
      intro:
        p('When all code sits in route handlers, it becomes hard to read, test and change. <strong>Layered architecture</strong> gives each part one job.') +
        h('The three common layers') +
        table(['Layer', 'Job', 'Knows about'], [
          ['Controller', 'Receive the request, validate input, return the response', 'HTTP (req, res), DTOs'],
          ['Service', 'Business rules and logic', 'Nothing about HTTP or SQL'],
          ['Repository', 'Talk to the database', 'Queries and the ORM'],
        ]) +
        code("Client -> Controller -> Service -> Repository -> Database\n          (HTTP)       (rules)     (data access)") +
        code("// controller\nasync create(req, res) {\n  const user = await userService.register(req.body);\n  res.status(201).json(user);\n}\n\n// service\nasync register(dto) {\n  const exists = await userRepo.findByEmail(dto.email);\n  if (exists) throw new AppError('Email already used', 409);\n  const hash = await bcrypt.hash(dto.password, 10);\n  return userRepo.create({ ...dto, password: hash });\n}\n\n// repository\ncreate(data) { return db.users.insert(data); }\nfindByEmail(email) { return db.users.findOne({ email }); }") +
        h('Why layers help') +
        ul(['<strong>Testing</strong>: test business rules without a web server or a real database.', '<strong>Changing</strong>: swap the database or framework with small impact.', '<strong>Readability</strong>: you always know where to look.', '<strong>Reuse</strong>: the same service can serve REST, a CLI or a queue worker.']) +
        h('Clean architecture and key principles') +
        p('Clean (or hexagonal) architecture takes this further: the <strong>business core</strong> sits in the middle and does not depend on frameworks, databases or the web. Outer layers depend on inner layers, never the opposite (the <strong>dependency rule</strong>).') +
        ul(['<strong>Separation of concerns</strong>: each piece has one job.', '<strong>SOLID</strong> principles, especially single responsibility and dependency inversion.', '<strong>Dependency injection</strong>: pass dependencies in (usually as interfaces) instead of creating them inside, so you can replace them with fakes in tests.', '<strong>DRY</strong>: do not repeat yourself, but do not over-abstract either.']) +
        rem('Do not put database queries in controllers, or HTTP details (req, res) in services. That mixing is what layers are meant to prevent.'),
      keyPoints: [
        'Controller handles HTTP, service holds business logic, repository handles data.',
        'Dependencies point inward: business logic must not depend on frameworks or the database.',
        'Dependency injection makes code replaceable and easy to test.',
        'Layers improve testability, readability and maintainability.',
      ],
      tip: 'Use a concrete example: "My service takes a repository interface, so in unit tests I pass a fake repository and need no database."',
      qna: [
        {
          id: 'controller-service-repo',
          q: 'What are the roles of controller, service and repository?',
          a: ul(['<strong>Controller</strong>: reads the request, calls the service, sends the response.', '<strong>Service</strong>: contains the business rules.', '<strong>Repository</strong>: reads and writes data in the database.']) + ia('Controllers deal with HTTP, services with business logic and repositories with data access. Separating them keeps code testable and easier to change.'),
        },
        {
          id: 'what-is-di',
          q: 'What is dependency injection and why use it?',
          a: p('Instead of a class creating the things it needs (<code>new UserRepository()</code>), those dependencies are <strong>given</strong> to it from outside, usually through the constructor. This lowers coupling and lets you pass fakes during tests.') + code("class UserService {\n  constructor(userRepo) { this.userRepo = userRepo; }\n}\nconst service = new UserService(fakeRepo); // in tests"),
        },
        {
          id: 'separation-of-concerns',
          q: 'What is separation of concerns?',
          a: p('Splitting a program so each part handles one concern (HTTP, business rules, data). A change in one area then rarely breaks the others.'),
        },
        {
          id: 'solid',
          q: 'What does SOLID stand for?',
          a: ul(['<strong>S</strong>ingle responsibility: one reason to change.', '<strong>O</strong>pen/closed: open for extension, closed for modification.', '<strong>L</strong>iskov substitution: subtypes can replace their base types.', '<strong>I</strong>nterface segregation: small, focused interfaces.', '<strong>D</strong>ependency inversion: depend on abstractions, not concrete classes.']),
        },
        {
          id: 'dependency-rule',
          q: 'What is the dependency rule in clean architecture?',
          a: p('Source code dependencies must point <strong>inward</strong>. The business core knows nothing about the web framework or database; the outer layers know about the core. This keeps the core stable when technology changes.'),
        },
      ],
      quiz: [
        { q: 'Which layer should contain business rules like "an email must be unique"?', options: ['Controller', 'Service', 'Router', 'Database driver'], answer: 1, explain: 'The service layer holds business logic. Controllers handle HTTP and repositories handle data access.' },
        { q: 'Which is a code smell in a layered design?', options: ['Service calling a repository', 'Controller writing SQL queries', 'Controller calling a service', 'Repository returning data'], answer: 1, explain: 'SQL belongs in the repository. A controller with queries mixes HTTP and data access.' },
        { q: 'What is the main benefit of dependency injection?', options: ['Smaller files', 'Easier testing and swapping of parts', 'Faster CPU', 'Automatic documentation'], answer: 1, explain: 'Injected dependencies can be replaced by fakes in tests or different implementations later.' },
        { q: 'In clean architecture, the dependency rule says dependencies point:', options: ['Outward to frameworks', 'Inward toward the business core', 'Randomly', 'Only to the database'], answer: 1, explain: 'The core is independent of details; details (framework, DB) depend on the core.' },
      ],
    },
  ];

  mod.sections = sections.map((s) => ({ notes: [], ...s }));
})();
