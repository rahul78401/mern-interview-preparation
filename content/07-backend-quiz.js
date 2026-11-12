/* Backend Quiz module.
   Quiz 1: 46 basic backend / API questions (quiz tab + Q&A tab with easy explanations).
   Quiz 2: build a small, simple REST API step by step (Node.js + Express). */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'backend-quiz');
  if (!mod) return;
  mod.unlocked = true;
  const K = Learn.sqlKit;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* =====================================================================
     QUIZ 1: concept questions.  [question, right answer, wrong, wrong, wrong, explanation]
     The right answer is moved to a different slot for every question.
     ===================================================================== */
  const Q = [
    ['What is an API?',
      'A set of rules that lets one program talk to another program',
      'A database that stores user data', 'A design tool for making web pages', 'A type of web browser',
      '<p>API means <strong>Application Programming Interface</strong>. Think of a waiter in a restaurant: you (the client) tell the waiter what you want, the waiter goes to the kitchen (the server), and brings the food back. You never enter the kitchen.</p><p>An API works the same way. A mobile app asks the API for data, the API talks to the database, and sends the answer back.</p>'],
    ['What is a REST API?',
      'An API that uses normal HTTP methods (GET, POST, PUT, DELETE) on resources like /users',
      'An API that can only be used while the server is sleeping', 'An API that only returns images', 'An API that must be written in Java',
      '<p>REST is a simple style for building APIs over HTTP. Everything is a <strong>resource</strong> (a user, an order, a task) with its own URL, and the HTTP method tells the server what to do.</p><p>Example: <code>GET /users</code> reads users, <code>POST /users</code> creates one, <code>DELETE /users/5</code> deletes user 5.</p>'],
    ['What is a DTO?',
      'An object that describes the exact shape of data going in or out of the API',
      'A database table', 'A special HTTP status code', 'A tool that restarts the server',
      '<p>DTO means <strong>Data Transfer Object</strong>. It is a simple object (or class) that says: "this is the data I accept, or send back, and nothing more".</p><p>Example: a <code>CreateUserDto</code> has only <code>name</code> and <code>email</code>. Even if a hacker sends <code>role: "admin"</code>, it is ignored, because it is not in the DTO.</p><p>Why use it? (1) You validate input in one place. (2) You never leak private fields like <code>password</code>. (3) The database can change without breaking the API.</p>'],
    ['Why do we use a DTO instead of using the database model directly?',
      'To control and validate what comes in and goes out, and hide private fields',
      'Because the database cannot store objects', 'Because DTOs make the server run twice as fast', 'Because HTTP only allows DTOs',
      '<p>A database model (entity) matches your <strong>table</strong>. It has everything: <code>id</code>, <code>password</code>, <code>createdAt</code>, internal flags.</p><p>If you send it straight to the client, you may leak the password hash. If you accept it straight from the client, a user could set <code>isAdmin: true</code>. A DTO is a small gate that only lets the right fields pass.</p>'],
    ['Which HTTP method is normally used to READ data without changing it?',
      'GET',
      'POST', 'DELETE', 'PUT',
      '<p><code>GET</code> is for reading. It should never change anything on the server. That is why it is called <strong>safe</strong>, and why browsers and caches can repeat it freely.</p>'],
    ['Which HTTP method is normally used to CREATE a new resource?',
      'POST',
      'GET', 'HEAD', 'OPTIONS',
      '<p><code>POST /tasks</code> with a JSON body creates a new task. The server decides the new id and usually answers <code>201 Created</code>.</p><p>Sending the same POST twice usually creates two items, so POST is <strong>not idempotent</strong>.</p>'],
    ['What is the difference between PUT and PATCH?',
      'PUT replaces the whole resource, PATCH changes only some fields',
      'PUT deletes, PATCH creates', 'They are exactly the same', 'PUT is for reading, PATCH is for writing',
      '<p>Imagine a task: <code>{ title: "Buy milk", done: false }</code>.</p><ul><li><strong>PUT</strong> sends the full object: <code>{ title: "Buy milk", done: true }</code>. Missing fields are treated as missing or reset.</li><li><strong>PATCH</strong> sends only the change: <code>{ done: true }</code>. The rest stays the same.</li></ul>'],
    ['What does "idempotent" mean for an API method?',
      'Calling it many times gives the same final result as calling it once',
      'It can only be called one time ever', 'It always returns status 200', 'It never needs a body',
      '<p>Example: <code>DELETE /tasks/5</code>. After the first call, task 5 is gone. Calling it again does not change anything more: task 5 is still gone. So DELETE is idempotent.</p><p><code>GET</code>, <code>PUT</code> and <code>DELETE</code> are idempotent. <code>POST</code> is not, because calling it twice creates two things.</p><p>Why do we care? If the network fails and the client retries, an idempotent call is safe to repeat.</p>'],
    ['What does status code 200 mean?',
      'OK: the request worked',
      'The resource was not found', 'The server crashed', 'You are not logged in',
      '<p>Status codes are grouped by their first digit:</p><ul><li><strong>2xx</strong> success</li><li><strong>3xx</strong> redirect</li><li><strong>4xx</strong> the client made a mistake</li><li><strong>5xx</strong> the server made a mistake</li></ul><p>200 is the normal "everything is fine" answer.</p>'],
    ['Which status code should an API return after successfully creating a resource?',
      '201 Created',
      '204 No Content', '301 Moved Permanently', '404 Not Found',
      '<p><code>201 Created</code> tells the client: "I made the new thing". It is good practice to send the created object (with its new <code>id</code>) in the response body.</p>'],
    ['Which status code means "success, but there is nothing to send back"?',
      '204 No Content',
      '200 OK with a long message', '400 Bad Request', '502 Bad Gateway',
      '<p>A successful <code>DELETE</code> often returns <code>204</code>. The delete worked, and there is no body to show. The response is empty.</p>'],
    ['The client sends invalid data (for example, a missing required field). Which status fits best?',
      '400 Bad Request',
      '200 OK', '500 Internal Server Error', '301 Moved Permanently',
      '<p>400 means: "your request is wrong, fix it and try again". The mistake is on the <strong>client</strong> side, so it must be a 4xx code, not 5xx.</p><p>Some teams use <code>422 Unprocessable Entity</code> for validation errors (the JSON is fine, but the values are not allowed). Both are accepted; just be consistent.</p>'],
    ['What is the difference between 401 and 403?',
      '401: we do not know who you are (not logged in). 403: we know you, but you are not allowed.',
      '401: server crashed. 403: page not found.', '401: wrong URL. 403: wrong method.', 'They mean the same thing',
      '<p>Simple memory trick:</p><ul><li><strong>401 Unauthorized</strong> = "Who are you? Please log in." (really means <em>unauthenticated</em>)</li><li><strong>403 Forbidden</strong> = "I know who you are, but you cannot do this."</li></ul><p>Example: a normal user calling <code>DELETE /users/9</code> that only admins can use gets 403.</p>'],
    ['When should an API return 404?',
      'When the requested resource or route does not exist',
      'When the password is wrong', 'When the server has a bug', 'When the request was successful',
      '<p>Example: <code>GET /tasks/9999</code> and there is no task with id 9999. The server answers <code>404 Not Found</code> with a message like <code>{ "error": "Task not found" }</code>.</p>'],
    ['What does status code 500 mean?',
      'Internal Server Error: something broke on the server',
      'The client sent bad data', 'The user must log in', 'The resource moved to a new URL',
      '<p>500 means a bug or crash in <em>your</em> code (for example, reading a property of <code>undefined</code>). The client did nothing wrong.</p><p>Never send the real error details to the client. Log them on the server and reply with a short, safe message.</p>'],
    ['Which part of an HTTP request carries the JSON data when you create something?',
      'The request body',
      'The status code', 'The response header only', 'The port number',
      '<p>A request has: a <strong>method</strong> (POST), a <strong>URL</strong>, <strong>headers</strong> (extra info like <code>Content-Type</code>) and an optional <strong>body</strong> (the data). For POST and PUT, the JSON goes in the body.</p>'],
    ['What is the "Content-Type: application/json" header for?',
      'It tells the receiver that the body is JSON',
      'It makes the request faster', 'It logs the user in', 'It encrypts the data',
      '<p>Headers are labels on the request. This label says "the body is JSON". Without it, many servers (like Express) will not parse the body, and <code>req.body</code> stays empty.</p>'],
    ['In the URL /users/42?role=admin, what is "42" and what is "role=admin"?',
      '42 is a path (route) parameter, role=admin is a query parameter',
      '42 is a header, role=admin is the body', '42 is the query, role=admin is the path', 'Both are path parameters',
      '<ul><li><strong>Path parameter</strong> (<code>/users/:id</code>): picks one specific thing. Here, user 42.</li><li><strong>Query parameter</strong> (after <code>?</code>): optional filters, search, sort, page. Here, only admins.</li></ul><p>In Express: <code>req.params.id</code> and <code>req.query.role</code>.</p>'],
    ['What is an endpoint?',
      'A URL plus a method where the API can be called, like GET /tasks',
      'The last line of a function', 'The end of a database table', 'A way to shut the server down',
      '<p>An endpoint is one "door" of your API. <code>GET /tasks</code> and <code>POST /tasks</code> are two different endpoints, even though the URL is the same, because the method is different.</p>'],
    ['What does CRUD stand for?',
      'Create, Read, Update, Delete',
      'Connect, Run, Upload, Download', 'Copy, Rename, Undo, Deploy', 'Cache, Route, Use, Debug',
      '<p>These are the four basic things you do with data. They map nicely to HTTP:</p><table><thead><tr><th>CRUD</th><th>HTTP</th></tr></thead><tbody><tr><td>Create</td><td>POST</td></tr><tr><td>Read</td><td>GET</td></tr><tr><td>Update</td><td>PUT / PATCH</td></tr><tr><td>Delete</td><td>DELETE</td></tr></tbody></table>'],
    ['What does "stateless" mean in a REST API?',
      'The server does not remember the client between requests, so each request carries everything needed',
      'The server has no database', 'The API never returns errors', 'The API only works without internet',
      '<p>In a stateless API, request #2 does not depend on the server remembering request #1. If login is needed, the client sends a <strong>token</strong> with every request.</p><p>Benefit: you can run 10 copies of the server behind a load balancer, and any copy can answer any request.</p>'],
    ['What is JSON?',
      'A simple text format for data, made of keys and values',
      'A programming language', 'A kind of database', 'A web server',
      '<p>JSON looks like a JavaScript object, written as text:</p><pre><code>{ "name": "Asha", "age": 25, "skills": ["sql", "node"] }</code></pre><p>Almost every API uses it because every language can read and write it.</p>'],
    ['What is the difference between authentication and authorization?',
      'Authentication = who are you? Authorization = what are you allowed to do?',
      'Authentication = what you can do. Authorization = who you are.', 'They are the same thing', 'Authentication is only for databases',
      '<p>At an airport: showing your passport is <strong>authentication</strong> (proving who you are). Your ticket decides which plane you may board: that is <strong>authorization</strong>.</p><p>In an API: login = authentication. "Only admins can delete users" = authorization.</p>'],
    ['What is a JWT?',
      'A signed token the client sends to prove it is logged in',
      'A type of database index', 'A JavaScript testing tool', 'A way to compress images',
      '<p>JWT = <strong>JSON Web Token</strong>. After login, the server gives the client a token like <code>xxxxx.yyyyy.zzzzz</code>. The client sends it in the header <code>Authorization: Bearer &lt;token&gt;</code> with each request.</p><p>The token is <strong>signed</strong>, so the server can detect if someone changed it. It is not secret, so never put passwords inside.</p>'],
    ['How should passwords be stored in the database?',
      'As a salted hash (for example with bcrypt)',
      'As plain text, so we can send them by email', 'Encrypted with a key stored in the same table', 'In the browser cookie',
      '<p>A <strong>hash</strong> is a one-way scramble: you can turn a password into a hash, but never back. At login, we hash what the user typed and compare it with the saved hash.</p><p>If the database leaks, attackers still do not have the real passwords. <code>bcrypt</code> or <code>argon2</code> add a random <em>salt</em> and are slow on purpose, which makes guessing hard.</p>'],
    ['What is CORS?',
      'A browser rule that decides which websites may call your API from JavaScript',
      'A database backup tool', 'A password rule', 'A type of API response',
      '<p>If your website is on <code>app.com</code> and your API is on <code>api.com</code>, the browser blocks the call unless the API says "app.com is allowed" using CORS headers.</p><p>CORS is a <strong>browser</strong> rule. Tools like Postman and curl ignore it. In Express you enable it with the <code>cors</code> package.</p>'],
    ['What is middleware in Express?',
      'A function that runs between the request and the final route handler',
      'A database driver', 'The last function that sends the response, only', 'A type of HTTP method',
      '<p>A request passes through a line of functions. Each one can look at the request, change it, stop it, or call <code>next()</code> to pass it along.</p><p>Common uses: logging, reading JSON (<code>express.json()</code>), checking login, handling errors.</p><pre><code>app.use((req, res, next) =&gt; {\n  console.log(req.method, req.url);\n  next();\n});</code></pre>'],
    ['What happens if middleware does not call next() and does not send a response?',
      'The request hangs until it times out',
      'Express sends 200 OK for you', 'The server restarts', 'The next route runs anyway',
      '<p>Each request must end with a response. If a middleware neither calls <code>next()</code> nor sends something like <code>res.json()</code>, nobody answers, and the client waits forever. This is a very common beginner bug.</p>'],
    ['Why must you validate input on the server, even if the frontend already validates it?',
      'Because anyone can skip the frontend and call the API directly',
      'Because browsers do not support validation', 'Because the frontend is always wrong', 'Because validation is only for GET requests',
      '<p>Frontend validation is for a nice user experience. It is not security. A person can use Postman, curl or a script and send anything.</p><p>The server is the last guard: <strong>never trust the client</strong>.</p>'],
    ['What is pagination, and why is it used?',
      'Returning a big list in small pages, to keep responses fast and small',
      'Adding page numbers to a PDF', 'Encrypting a list', 'Sorting a list alphabetically',
      '<p>If you have 1 million orders, <code>GET /orders</code> cannot send all of them. Instead use <code>GET /orders?page=2&amp;limit=20</code> and return only 20 items per call.</p><p>Common styles: <strong>page + limit</strong> (simple) and <strong>cursor</strong> (better for big, changing data).</p>'],
    ['What is rate limiting?',
      'Limiting how many requests a client can make in a time window',
      'Making the database slower', 'Charging users money per row', 'Reducing the size of JSON',
      '<p>Example: "100 requests per minute per IP". It protects your server from abuse, bots and accidental loops. When the limit is crossed, the API returns <code>429 Too Many Requests</code>.</p>'],
    ['Why do we keep secrets like database passwords in environment variables?',
      'So they stay out of the source code and can differ per environment',
      'Because environment variables are faster', 'Because Git requires it', 'Because JSON cannot hold text',
      '<p>If you write a password inside your code and push to GitHub, everyone can see it. Instead put it in a <code>.env</code> file (which is <strong>not</strong> committed) and read it with <code>process.env.DB_PASSWORD</code>.</p><p>It also lets you use a different value for development and production without changing code.</p>'],
    ['What is SQL injection?',
      'An attack where user input is treated as part of the SQL command',
      'A way to speed up queries', 'A database backup method', 'A SQL function to insert rows',
      '<p>Bad idea: <code>"SELECT * FROM users WHERE name = \'" + name + "\'"</code>. If the user types <code>\' OR \'1\'=\'1</code>, they read every user.</p><p>Fix: use <strong>parameterized queries</strong> (<code>WHERE name = $1</code>) or an ORM. The database then treats input only as data, never as code.</p>'],
    ['Why is HTTPS important?',
      'It encrypts data between client and server so others cannot read or change it',
      'It makes the API faster', 'It replaces the need for passwords', 'It removes the need for validation',
      '<p>With plain HTTP, anyone on the same Wi-Fi network can read passwords and tokens. HTTPS wraps the traffic in encryption (TLS). Always use it in production.</p>'],
    ['What is the usual job of a Controller, a Service and a Repository?',
      'Controller handles the HTTP request, Service holds business rules, Repository talks to the database',
      'Controller talks to the database, Repository handles HTTP', 'They all do exactly the same job', 'Service only draws the UI',
      '<p>Splitting code into layers keeps each file small and easy to test:</p><ul><li><strong>Controller</strong>: reads the request, calls the service, sends the response.</li><li><strong>Service</strong>: the real logic ("a user cannot order if the cart is empty").</li><li><strong>Repository</strong>: the only place that writes SQL or uses the ORM.</li></ul>'],
    ['What is an ORM?',
      'A tool that lets you use database tables as objects in your code, instead of writing raw SQL',
      'A tool that draws charts', 'A kind of web server', 'A password manager',
      '<p>ORM = Object Relational Mapper. Examples: Prisma, TypeORM, Sequelize. Instead of <code>SELECT * FROM users WHERE id = 1</code> you write <code>userRepo.findOne({ id: 1 })</code>.</p><p>It saves time and helps against SQL injection, but you should still understand SQL for slow or complex queries.</p>'],
    ['What is the difference between a query parameter and a request body?',
      'Query parameters go in the URL (small filters), the body carries the main data (larger, hidden from the URL)',
      'Query parameters are encrypted, the body is not', 'The body goes in the URL, query goes in the header', 'There is no difference',
      '<p>Use the <strong>query</strong> to filter or search: <code>GET /tasks?done=true</code>. Use the <strong>body</strong> to send the thing you are creating or updating. Never put passwords in the URL, because URLs end up in logs and browser history.</p>'],
    ['What is a webhook?',
      'A URL on your server that another service calls when something happens',
      'A tool that blocks websites', 'A way to hook the database', 'A kind of cookie',
      '<p>Instead of asking Stripe every minute "was the payment done?", you give Stripe a URL. When the payment finishes, Stripe calls <strong>your</strong> URL with the news. It is "don\'t call us, we\'ll call you".</p>'],
    ['What is the main difference between REST and GraphQL?',
      'REST has many URLs with fixed responses. GraphQL has one URL and the client asks for exactly the fields it wants.',
      'REST is only for mobile, GraphQL only for web', 'GraphQL does not use a server', 'REST cannot return JSON',
      '<p>With REST you might call <code>/users/1</code> and <code>/users/1/orders</code>. With GraphQL you send one query: "give me the user name and the last 3 order totals". It avoids getting too much or too little data, but it is more complex to set up and cache.</p>'],
    ['What is API versioning (like /v1/users)?',
      'Keeping old behaviour working for existing clients while you release a changed API',
      'Saving the API in Git', 'Counting how many users call the API', 'Compressing the API',
      '<p>If you rename a field, old mobile apps that are still installed will break. By keeping <code>/v1/users</code> as it is and adding <code>/v2/users</code>, old apps keep working while new apps use the new shape.</p>'],
    ['Why should an API return clear error messages with a proper status code?',
      'So the client can understand what went wrong and react correctly',
      'Because errors make the server faster', 'Because status codes are optional decoration', 'Because browsers need them to draw colors',
      '<p>Bad: <code>200 OK</code> with <code>{ "success": false }</code>. Tools, caches and monitoring all believe 200 means fine.</p><p>Good: <code>404</code> with <code>{ "error": "Task not found" }</code>. Short, honest, and no secret details like stack traces.</p>'],
    ['What does "async/await" help with in a Node.js API?',
      'Waiting for slow things like database or network calls without blocking the server',
      'Making CPU math faster', 'Turning JavaScript into SQL', 'Removing the need for error handling',
      '<p>Node.js runs your JavaScript on one thread. If you wait for the database in a blocking way, no other request can be served. With <code>await</code>, Node pauses only <em>this</em> function, and handles other requests meanwhile.</p><p>Remember to wrap awaited code in <code>try/catch</code> (or use an error-handling middleware).</p>'],
    ['What is a good way to identify a single resource in a REST URL?',
      'GET /users/42',
      'GET /getUserById?id=42&amp;action=read', 'POST /deleteUser42', 'GET /doEverything',
      '<p>REST URLs use <strong>nouns</strong> (users, tasks), not verbs (get, delete). The HTTP method already tells the action. So we write <code>GET /users/42</code> and <code>DELETE /users/42</code>, not <code>/getUser</code> and <code>/deleteUser</code>.</p>'],
    ['What is caching in an API, in simple words?',
      'Saving an answer for a while, so the next request does not repeat the slow work',
      'Deleting old data', 'Encrypting a response', 'Splitting a response into pieces',
      '<p>If 1000 people ask for the same product list every minute, why query the database 1000 times? Save the answer in memory (for example Redis) for 60 seconds and serve it from there. It is much faster and takes load off the database.</p><p>The hard part: knowing when to throw the saved copy away when the real data changes.</p>'],
    ['Where do you normally send a JWT token when calling a protected API?',
      'In the Authorization header: Bearer <token>',
      'In the URL as the file name', 'In the status code', 'In the HTML title',
      '<p>Standard form: <code>Authorization: Bearer eyJhbGciOi...</code>. The server reads that header in a middleware, checks the signature, and then allows or blocks the request.</p>'],
    ['What is the best reason to split your project into modules/folders (users, orders, products)?',
      'It keeps related code together, so it is easier to find, test and change',
      'It makes JavaScript run on more CPU cores', 'Node.js refuses to run single files', 'It removes the need for a database',
      '<p>When all routes sit in one 2000-line file, every change is risky. With modules like <code>users/</code> (routes, service, dto) and <code>orders/</code>, a developer can work on one area without touching others.</p>'],
  ];

  const letters = ['A', 'B', 'C', 'D'];
  const quiz1 = Q.map(([q, right, w1, w2, w3, explain], i) => {
    const wrong = [w1, w2, w3];
    const pos = i % 4;                                  // slot of the right answer
    const options = [...wrong.slice(0, pos), right, ...wrong.slice(pos)];
    return { q, options, answer: pos, explain: `${explain}`.replace(/^/, '') };
  });
  const clean = (t) => t.replace(/&amp;/g, '&');
  quiz1.forEach((x) => { x.options = x.options.map(clean); });

  const qna1 = quiz1.map((x, i) => ({
    id: 'bq' + (i + 1),
    q: x.q,
    a: `<p><strong>Answer: ${esc(x.options[x.answer])}</strong></p>${x.explain}`,
  }));

  const section1 = {
    id: 'backend-quiz-1',
    title: 'Quiz 1: Backend Basics',
    description: '46 easy questions on APIs, HTTP, status codes, DTOs, auth and more. Every answer is explained in plain English.',
    intro:
      `<div class="doc"><p class="lead">These are the questions interviewers love to start with. Open the <strong>Quiz</strong> tab to test yourself one question at a time, or open the <strong>Q&amp;A</strong> tab to read the answers with simple explanations, like a small book.</p>` +
      `<h3>What this quiz covers</h3><ul><li>What an API, REST and an endpoint are</li><li>DTO, JSON, request body, headers, query and path parameters</li><li>HTTP methods, idempotency, PUT vs PATCH</li><li>Status codes: 200, 201, 204, 400, 401, 403, 404, 500</li><li>Authentication, authorization, JWT, password hashing, CORS, HTTPS</li><li>Middleware, validation, pagination, rate limiting, caching</li><li>Layers (controller, service, repository), ORM, SQL injection, versioning</li></ul>` +
      `<div class="callout green"><div class="callout-title">How to answer in an interview</div><p>Say it in one simple sentence first, then give a tiny example. For DTO: "It is an object that defines what data goes in or out of the API. For example, CreateUserDto accepts only name and email."</p></div></div>`,
    keyPoints: [
      'GET reads, POST creates, PUT replaces, PATCH changes a part, DELETE removes',
      '2xx = success, 4xx = client mistake, 5xx = server mistake',
      '401 = not logged in, 403 = logged in but not allowed',
      'A DTO controls and validates the shape of data in and out of the API',
      'Never trust the client: always validate on the server',
    ],
    tip: 'If you do not know an answer, explain the idea with a real-life example (waiter, airport, post office). Interviewers like clear thinking more than perfect words.',
    qna: qna1,
    quiz: quiz1,
  };

  /* =====================================================================
     QUIZ 2: build simple APIs (Node.js + Express), step by step
     ===================================================================== */
  const SERVER = "const express = require('express');\nconst app = express();\n\napp.use(express.json());                       // read JSON bodies\n\n// Step 10: logger middleware\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();\n});\n\n// Our \"database\": a plain array\nlet tasks = [\n  { id: 1, title: 'Learn Node.js', done: true },\n  { id: 2, title: 'Build an API', done: false },\n];\nlet nextId = 3;\n\n// Step 1: health check\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\n// Steps 2 + 8 + 9: list, filter and search\napp.get('/tasks', (req, res) => {\n  let result = tasks;\n  if (req.query.done !== undefined) {\n    result = result.filter((t) => String(t.done) === req.query.done);\n  }\n  if (req.query.search) {\n    const word = req.query.search.toLowerCase();\n    result = result.filter((t) => t.title.toLowerCase().includes(word));\n  }\n  res.json(result);\n});\n\n// Step 3: get one\napp.get('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  res.json(task);\n});\n\n// Step 4: create\napp.post('/tasks', (req, res) => {\n  const { title } = req.body;\n  if (!title || typeof title !== 'string') {\n    return res.status(400).json({ error: 'title is required' });\n  }\n  const task = { id: nextId++, title, done: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});\n\n// Step 5: replace (PUT)\napp.put('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  const { title, done } = req.body;\n  if (!title || typeof done !== 'boolean') {\n    return res.status(400).json({ error: 'title and done are required' });\n  }\n  task.title = title;\n  task.done = done;\n  res.json(task);\n});\n\n// Step 6: change some fields (PATCH)\napp.patch('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  if (req.body.title !== undefined) task.title = req.body.title;\n  if (req.body.done !== undefined) task.done = req.body.done;\n  res.json(task);\n});\n\n// Step 7: delete\napp.delete('/tasks/:id', (req, res) => {\n  const index = tasks.findIndex((t) => t.id === Number(req.params.id));\n  if (index === -1) return res.status(404).json({ error: 'Task not found' });\n  tasks.splice(index, 1);\n  res.status(204).send();\n});\n\n// Step 11: unknown route + error handler (keep these LAST)\napp.use((req, res) => {\n  res.status(404).json({ error: 'Route not found' });\n});\napp.use((err, req, res, next) => {\n  if (err.type === 'entity.parse.failed') {      // body was not valid JSON\n    return res.status(400).json({ error: 'Invalid JSON' });\n  }\n  console.error(err);\n  res.status(500).json({ error: 'Something went wrong' });\n});\n\napp.listen(3000, () => console.log('API running on http://localhost:3000'));\n";

  const step = (n, title, task, hint, solution, test, result) =>
    K.sec('api-step-' + n, n, title, task,
      `<div class="jcard"><h4>Your goal</h4><p>${hint}</p>` +
      `<details class="qz-setup"><summary>Show solution code</summary>${K.code(solution)}</details>` +
      `<h4 style="margin-top:14px">Test it</h4>${K.code(test)}` +
      `<p class="jnote">Expected response:</p>${K.code(result)}</div>`);

  const H = '-H "Content-Type: application/json"';
  const steps = [
    step(1, 'Health check', 'The simplest route there is. Used by servers to check "are you alive?".',
      'Create <code>GET /health</code> that answers with <code>{ "status": "ok" }</code>.',
      `app.get('/health', (req, res) => {\n  res.json({ status: 'ok' });\n});`,
      `curl http://localhost:3000/health`, `200 OK\n{ "status": "ok" }`),
    step(2, 'List all tasks (GET)', 'Read many items. Our "database" is just an array in memory.',
      'Make an array called <code>tasks</code> and create <code>GET /tasks</code> that returns all of them.',
      `let tasks = [\n  { id: 1, title: 'Learn Node.js', done: true },\n  { id: 2, title: 'Build an API', done: false },\n];\nlet nextId = 3;\n\napp.get('/tasks', (req, res) => {\n  res.json(tasks);\n});`,
      `curl http://localhost:3000/tasks`, `200 OK\n[\n  { "id": 1, "title": "Learn Node.js", "done": true },\n  { "id": 2, "title": "Build an API", "done": false }\n]`),
    step(3, 'Get one task (route parameter)', 'Read one item by its id from the URL. Handle the "not found" case.',
      'Create <code>GET /tasks/:id</code>. If the task does not exist return status 404 with <code>{ "error": "Task not found" }</code>. Hint: <code>req.params.id</code> is a <em>string</em>, so use <code>Number()</code>.',
      `app.get('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  res.json(task);\n});`,
      `curl http://localhost:3000/tasks/1\ncurl http://localhost:3000/tasks/99`, `200 OK\n{ "id": 1, "title": "Learn Node.js", "done": true }\n\n404 Not Found\n{ "error": "Task not found" }`),
    step(4, 'Create a task (POST + validation)', 'Receive JSON in the body, check it, save it.',
      'First add <code>app.use(express.json())</code> at the top, so Express can read JSON bodies. Then create <code>POST /tasks</code>. Require a text <code>title</code> (else 400). New tasks start with <code>done: false</code> and the reply is <code>201</code>.',
      `app.use(express.json());   // put this near the top, before your routes\n\napp.post('/tasks', (req, res) => {\n  const { title } = req.body;\n  if (!title || typeof title !== 'string') {\n    return res.status(400).json({ error: 'title is required' });\n  }\n  const task = { id: nextId++, title, done: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});`,
      `curl -X POST http://localhost:3000/tasks ${H} -d '{"title":"Write tests"}'\ncurl -X POST http://localhost:3000/tasks ${H} -d '{}'`, `201 Created\n{ "id": 3, "title": "Write tests", "done": false }\n\n400 Bad Request\n{ "error": "title is required" }`),
    step(5, 'Replace a task (PUT)', 'PUT sends the whole object, so both fields are required.',
      'Create <code>PUT /tasks/:id</code>. Return 404 if the task is missing, 400 if <code>title</code> or <code>done</code> is missing or wrong, otherwise update and return the task.',
      `app.put('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  const { title, done } = req.body;\n  if (!title || typeof done !== 'boolean') {\n    return res.status(400).json({ error: 'title and done are required' });\n  }\n  task.title = title;\n  task.done = done;\n  res.json(task);\n});`,
      `curl -X PUT http://localhost:3000/tasks/3 ${H} -d '{"title":"Write more tests","done":true}'`, `200 OK\n{ "id": 3, "title": "Write more tests", "done": true }`),
    step(6, 'Change part of a task (PATCH)', 'PATCH changes only the fields that were sent.',
      'Create <code>PATCH /tasks/:id</code>. Only update <code>title</code> or <code>done</code> if they are in the body.',
      `app.patch('/tasks/:id', (req, res) => {\n  const task = tasks.find((t) => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: 'Task not found' });\n  if (req.body.title !== undefined) task.title = req.body.title;\n  if (req.body.done !== undefined) task.done = req.body.done;\n  res.json(task);\n});`,
      `curl -X PATCH http://localhost:3000/tasks/3 ${H} -d '{"done":false}'`, `200 OK\n{ "id": 3, "title": "Write more tests", "done": false }`),
    step(7, 'Delete a task (DELETE)', 'Remove an item. A successful delete has no body.',
      'Create <code>DELETE /tasks/:id</code>. Return 404 if missing, otherwise remove it and return <code>204</code>. Hint: <code>findIndex</code> and <code>splice</code>.',
      `app.delete('/tasks/:id', (req, res) => {\n  const index = tasks.findIndex((t) => t.id === Number(req.params.id));\n  if (index === -1) return res.status(404).json({ error: 'Task not found' });\n  tasks.splice(index, 1);\n  res.status(204).send();\n});`,
      `curl -i -X DELETE http://localhost:3000/tasks/3`, `204 No Content\n(empty body)`),
    step(8, 'Filter with a query parameter', 'Query parameters are optional filters after the <code>?</code> in the URL.',
      'Change <code>GET /tasks</code> so that <code>/tasks?done=true</code> returns only finished tasks. Hint: <code>req.query.done</code> is the string <code>"true"</code> or <code>"false"</code>.',
      `app.get('/tasks', (req, res) => {\n  let result = tasks;\n  if (req.query.done !== undefined) {\n    result = result.filter((t) => String(t.done) === req.query.done);\n  }\n  res.json(result);\n});`,
      `curl "http://localhost:3000/tasks?done=true"`, `200 OK\n[ { "id": 1, "title": "Learn Node.js", "done": true } ]`),
    step(9, 'Search by text', 'A second filter on the same route: search inside the title.',
      'Extend <code>GET /tasks</code> so <code>/tasks?search=api</code> returns tasks whose title contains "api" (ignore upper and lower case).',
      `if (req.query.search) {\n  const word = req.query.search.toLowerCase();\n  result = result.filter((t) => t.title.toLowerCase().includes(word));\n}\n// add this inside GET /tasks, before res.json(result)`,
      `curl "http://localhost:3000/tasks?search=api"`, `200 OK\n[ { "id": 2, "title": "Build an API", "done": false } ]`),
    step(10, 'Add a logger (middleware)', 'Middleware runs for every request before your routes.',
      'Add a middleware that prints the method and URL of each request, then continues. Put it <strong>above</strong> your routes.',
      `app.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();   // do not forget this, or the request hangs\n});`,
      `curl http://localhost:3000/tasks`, `Terminal where the server runs prints:\nGET /tasks`),
    step(11, 'Unknown routes and errors', 'Always answer clearly when a route does not exist, or something breaks.',
      'At the <strong>very bottom</strong> add (1) a catch-all that returns 404 JSON, and (2) an error handler with four arguments. Bonus: return 400 when the client sends broken JSON.',
      `// 404 for any route that did not match\napp.use((req, res) => {\n  res.status(404).json({ error: 'Route not found' });\n});\n\n// error handler: it has 4 arguments\napp.use((err, req, res, next) => {\n  if (err.type === 'entity.parse.failed') {      // body was not valid JSON\n    return res.status(400).json({ error: 'Invalid JSON' });\n  }\n  console.error(err);\n  res.status(500).json({ error: 'Something went wrong' });\n});`,
      `curl http://localhost:3000/nope\ncurl -X POST http://localhost:3000/tasks ${H} -d '{bad'`, `404 Not Found\n{ "error": "Route not found" }\n\n400 Bad Request\n{ "error": "Invalid JSON" }`),
  ];

  const setup = K.sec('api-setup', 'S', 'Setup (2 minutes)', 'You only need Node.js. Everything is saved in a plain array, so there is no database to install.',
    `<div class="jcard"><h4>Create the project</h4>${K.code('mkdir my-api\ncd my-api\nnpm init -y\nnpm install express')}` +
    `<h4 style="margin-top:14px">Create <code>server.js</code> with the starter code</h4>${K.code(`const express = require('express');\nconst app = express();\n\n// ---- routes will go here ----\n\napp.listen(3000, () => console.log('API running on http://localhost:3000'));`)}` +
    `<h4 style="margin-top:14px">Run it</h4>${K.code('node server.js')}<p class="jnote">After every change, stop the server (Ctrl + C) and start it again. Or run <code>node --watch server.js</code> and it restarts for you. Test with curl, Postman, or the Thunder Client extension in VS Code.</p></div>`);

  const full = K.sec('api-full', 12, 'The finished server.js', 'If you get stuck, compare your file with this complete, working version. It has every step above in the right order.',
    `<details class="qz-setup"><summary>Show the full server.js (about 100 lines)</summary>${K.code(SERVER)}</details>` +
    `<div class="callout green"><div class="callout-title">Ideas to go further</div><ul><li>Split the routes into <code>routes/tasks.js</code> using <code>express.Router()</code>.</li><li>Replace the array with a real database (SQLite, PostgreSQL, MongoDB).</li><li>Add pagination: <code>/tasks?page=1&amp;limit=10</code>.</li><li>Add login with JWT and protect POST, PUT, PATCH and DELETE.</li><li>Write a DTO-like validation function (or use the <code>zod</code> package) so validation lives in one place.</li></ul></div>`);

  const section2 = {
    id: 'backend-quiz-2',
    title: 'Quiz 2: Build Simple APIs',
    description: 'Build a small Tasks API step by step with Node.js and Express: GET, POST, PUT, PATCH, DELETE, filters, middleware and errors.',
    intro: `<div class="doc jwide">` +
      K.hero({ level: 'Quiz 2', title: 'Build a Tasks API', intro: 'Eleven small steps. Read the goal, try to write the route yourself, then open the solution to compare. Every route is tested with a curl command and you can see the exact response to expect.',
        items: ['11 small steps', 'GET, POST, PUT, PATCH, DELETE', 'Route and query parameters', 'Validation and status codes', 'Middleware and error handling', 'No database needed']}) +
      K.nav([['api-setup', 'Setup'], ...Array.from({ length: 11 }, (_, i) => ['api-step-' + (i + 1), 'Step ' + (i + 1)]), ['api-full', 'Full code']]) +
      setup + steps.join('') + full + `</div>`,
  };

  mod.sections.push({ qna: [], notes: [], quiz: [], ...section1 }, { qna: [], notes: [], quiz: [], ...section2 });
})();
