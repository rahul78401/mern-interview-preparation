/* Module 1: Introduction */
(() => {
  const F = Learn.fig;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const p = (t) => `<p>${t}</p>`;
  const ul = (a) => `<ul>${a.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  const h = (t) => `<h4>${t}</h4>`;
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const ia = (t) => `<div class="callout green"><div class="callout-title">Interview answer</div>${p(t)}</div>`;
  const rem = (t) => `<div class="callout amber"><div class="callout-title">Remember</div>${p(t)}</div>`;
  const src = (t) => `<p class="source">Source: ${t}</p>`;

  Learn.register({
    id: 'introduction',
    order: 1,
    title: 'Introduction',
    summary: 'How the web actually works, explained simply, before touching any framework.',
    added: '2026-10-08',

    sections: [
      {
        id: 'understanding-the-web',
        title: 'Basic Understanding',
        description: 'The basic building blocks every software developer is expected to explain: internet, frontend, backend, database, API, HTTP and more.',

        intro:
          p('Before learning frameworks like React, Angular, Node.js, Spring Boot or Django, you should understand how the web actually works.') +
          p('The basic flow is:') +
          F.wrap(
            F.flow([{ t: 'User' }, { t: 'Browser', c: 'green' }, { t: 'Frontend', c: 'green' }, { t: 'API' }, { t: 'Backend', c: 'amber' }, { t: 'Database', c: 'gray' }], { bidir: true }),
            'The request goes right, and the response comes back the same way.'
          ) +
          p('For example, when you open an e-commerce website:') +
          ul([
            'Your browser acts as the <strong>client</strong>.',
            'It sends a request to a server.',
            'The server runs backend code.',
            'The backend may communicate with a database.',
            'The database returns data.',
            'The backend sends a response.',
            'The frontend displays the result.',
          ]) +
          p('Once you understand this flow, concepts like APIs, HTTP, authentication, databases and backend development become much easier.'),

        keyPoints: [
          'Internet ≠ Web. The Internet is the network, the Web is a service that runs on it.',
          'Frontend = what the user sees. Backend = logic + data processing. Database = long-term memory.',
          'Never trust the client, so the frontend never talks to the database directly.',
          'An API is the controlled doorway between clients and the backend.',
          'HTTP is a request-response protocol; HTTPS is HTTP over TLS.',
          'Authentication = who are you? Authorization = what can you do?',
          'A port identifies the service on a machine, the IP address identifies the machine.',
        ],

        qna: [
          {
            id: 'what-is-internet',
            q: '1. What is the Internet?',
            a:
              h('Simple explanation') +
              p('The Internet is a huge network of connected computers and devices that communicate with each other. Your laptop, phone, servers and routers all talk through standardized protocols.') +
              p('For web development, the key point is: <strong>your browser communicates with web servers over the Internet.</strong>') +
              F.wrap(F.flow([{ t: 'Your device', s: 'Laptop / phone', c: 'green' }, { t: 'The Internet', s: 'Network' }, { t: 'Web server', s: "Google's servers", c: 'amber' }], { bidir: true, w: 130 })) +
              h('Example') +
              p('When you open <code>https://google.com</code>, your computer communicates with Google\'s servers and receives the resources needed to display the website.') +
              ia('The Internet is a global network of interconnected computers and devices that communicate using standardized networking protocols. The Web is one of the services that runs on top of the Internet.') +
              rem('<strong>Internet ≠ Web.</strong> The Internet is the infrastructure/network. The Web is a service that uses that network.') +
              src('MDN — How the Web works'),
          },
          {
            id: 'static-vs-dynamic',
            q: '2. What is the difference between a static and a dynamic website?',
            a:
              h('Static website') +
              p('A static website sends pre-created files to the browser, such as <code>index.html</code>, <code>style.css</code> and <code>script.js</code>. The server sends these files as they are.') +
              p('Example: a simple portfolio with About, Skills, Projects and Contact can be completely static.') +
              h('Dynamic website') +
              p('A dynamic website generates or retrieves content based on the request, the user, the database, etc. Amazon, Facebook, Instagram and banking applications need this dynamic behaviour.') +
              F.group([
                ['Static', F.flow([{ t: 'Browser', c: 'green' }, { t: 'Web server', s: 'Ready-made files' }], { bidir: true, w: 130 })],
                ['Dynamic', F.flow([{ t: 'Browser', c: 'green' }, { t: 'Backend', s: 'Runs code', c: 'amber' }, { t: 'Database', s: 'Product #123', c: 'gray' }], { bidir: true, w: 130 })],
              ]) +
              ia('A static website serves pre-created files with little or no server-side processing, while a dynamic website generates or retrieves content based on user requests, application logic, or database data.') +
              src('MDN — Static vs Dynamic Websites'),
          },
          {
            id: 'what-is-frontend',
            q: '3. What is the frontend?',
            a:
              p('The frontend is the part of an application that the user interacts with. It runs primarily in the user\'s browser.') +
              h('Common frontend technologies') +
              `<table><thead><tr><th>Technology</th><th>Role</th></tr></thead><tbody>
                <tr><td>HTML</td><td>Structure</td></tr>
                <tr><td>CSS</td><td>Styling</td></tr>
                <tr><td>JavaScript</td><td>Behavior</td></tr>
                <tr><td>React / Angular / Vue</td><td>Application UI</td></tr></tbody></table>` +
              h('Example') +
              p('On a shopping website, the product cards, search bar, login form, buttons, navigation and product images are all part of the frontend.') +
              ia('Frontend development focuses on the user-facing part of an application. It handles the UI, user interactions and communication with backend services.') +
              rem('Frontend = what the user sees and interacts with.') +
              src('MDN — Web standards model'),
          },
          {
            id: 'what-is-backend',
            q: '4. What is the backend?',
            a:
              p('The backend is the server-side part of an application. It handles:') +
              ul(['Business logic', 'Authentication and authorization', 'Database operations', 'APIs and validation', 'Payments', 'Background jobs', 'Processing requests']) +
              p('Common backend technologies: Node.js, Python, Java, C#, Go, PHP, Ruby.') +
              h('Example: clicking "Buy Now"') +
              p('The frontend sends a request to the backend. The backend might:') +
              F.wrap(F.flow(['Check user', 'Check product', 'Check inventory', 'Calculate price', 'Create order', 'Save in database', 'Return result'].map((t, i) => ({ t: `${i + 1}. ${t}`, c: i === 6 ? 'green' : '' })), { dir: 'v', w: 220, gap: 22 })) +
              ia('Backend development handles server-side application logic, data processing, authentication, database communication and APIs.') +
              rem('Frontend = presentation. Backend = logic + data processing.'),
          },
          {
            id: 'what-is-database',
            q: '5. What is a database?',
            a:
              p('A database is a system used to store and retrieve data in an organized way. A website might store users, products, orders, payments, messages and reviews.') +
              h('Example') +
              p('A <code>users</code> table might contain:') +
              `<table><thead><tr><th>id</th><th>name</th><th>email</th></tr></thead><tbody>
                <tr><td>1</td><td>Rahul</td><td>rahul@email.com</td></tr>
                <tr><td>2</td><td>Amit</td><td>amit@email.com</td></tr></tbody></table>` +
              p('The backend can query this database whenever it needs information.') +
              ia('A database is a system used to persist, organize, retrieve and manage application data.') +
              rem('Think of the database as the application\'s long-term memory.'),
          },
          {
            id: 'sql-vs-nosql',
            q: '6. What is the difference between SQL and NoSQL?',
            a:
              h('SQL') +
              p('SQL databases are generally relational. Examples: PostgreSQL, MySQL, SQL Server, Oracle. Data is organized into tables, rows and columns, and relationships connect the tables.') +
              `<table><thead><tr><th>Users</th><th>Orders</th></tr></thead><tbody>
                <tr><td>id</td><td>id</td></tr><tr><td>name</td><td>user_id</td></tr><tr><td>email</td><td>amount</td></tr></tbody></table>` +
              h('NoSQL') +
              p('NoSQL databases use other data models such as documents, key-value pairs, graphs, etc. Example: MongoDB. A user may look like:') +
              code('{\n  "name": "Rahul",\n  "email": "rahul@email.com",\n  "skills": ["Node.js", "PostgreSQL"]\n}') +
              h('Basic difference') +
              `<table><thead><tr><th>SQL</th><th>NoSQL</th></tr></thead><tbody>
                <tr><td>Usually relational</td><td>Often non-relational</td></tr>
                <tr><td>Tables</td><td>Documents / key-value / other models</td></tr>
                <tr><td>Structured schema is common</td><td>Often more flexible schema</td></tr>
                <tr><td>SQL queries</td><td>Database-specific query APIs/languages</td></tr>
                <tr><td>Excellent for relational data</td><td>Useful for many flexible/high-scale data models</td></tr></tbody></table>` +
              ia('SQL databases are generally relational and store structured data in tables with relationships, while NoSQL databases use other models such as documents or key-value structures and are often chosen when flexible data models or particular scalability requirements are important.') +
              `<div class="callout amber"><div class="callout-title">Important</div><p>Don't say "SQL is always better" or "NoSQL is always faster". The correct database depends on the application's requirements.</p></div>`,
          },
          {
            id: 'frontend-vs-database',
            q: "7. Why can't the frontend directly use the database?",
            a:
              p('This is a very important interview question.') +
              p('Imagine your frontend directly connects to PostgreSQL. You would have to expose the database address, username, password and structure to the browser. That is extremely dangerous, because the frontend runs on the user\'s device and cannot be trusted.') +
              F.group([
                ['Not safe', F.flow([{ t: 'Frontend', c: 'green' }, { t: 'Database', c: 'gray' }], { blocked: [0], w: 130, gap: 80 })],
                ['Safe', F.flow([{ t: 'Frontend', c: 'green' }, { t: 'API' }, { t: 'Backend', c: 'amber' }, { t: 'Database', c: 'gray' }], { bidir: true })],
              ]) +
              p('The backend acts as a controlled layer between the user and the database. It can:') +
              ul(['Validate input', 'Authenticate users', 'Check permissions', 'Apply business rules', 'Prevent unauthorized queries', 'Hide database credentials', 'Control what data is returned']) +
              ia('The frontend should not directly access the database because the client is untrusted and exposing database credentials or unrestricted database access would create serious security and data-integrity problems. The backend provides a controlled layer for authentication, authorization, validation and business logic.') +
              rem('Never trust the client.'),
          },
          {
            id: 'what-is-api',
            q: '8. What is an API?',
            a:
              p('API stands for <strong>Application Programming Interface</strong>. In web development, an API commonly provides a way for one application or component to communicate with another.') +
              F.wrap(F.flow([{ t: 'Frontend', c: 'green' }, { t: 'GET /api/products', s: 'Request' }, { t: 'Backend', c: 'amber' }, { t: 'Database', c: 'gray' }], { bidir: true, w: 130 }), 'The backend returns a JSON response to the frontend.') +
              p('Example response:') +
              code('{\n  "id": 101,\n  "name": "Laptop",\n  "price": 50000\n}') +
              ia('An API is an interface that defines how different software components can communicate with each other.') +
              h('Simple analogy: a restaurant') +
              F.wrap(F.flow([{ t: 'You', s: 'Customer', c: 'green' }, { t: 'Waiter', s: 'API' }, { t: 'Kitchen', s: 'Backend', c: 'amber' }, { t: 'Storage', s: 'Database', c: 'gray' }], { bidir: true, w: 120 })) +
              p('You don\'t enter the kitchen yourself. You communicate through the waiter.'),
          },
          {
            id: 'why-apis',
            q: '9. Why do we need APIs?',
            a:
              p('APIs provide a controlled communication layer between systems. The same backend can serve multiple clients.') +
              F.wrap(F.fanIn()) +
              h('Example') +
              p('A food delivery company could have a customer app, restaurant app, delivery app, website and admin dashboard. All of them communicate with the same backend APIs.') +
              ia('APIs provide a standardized and controlled way for different applications or components to communicate and exchange data.'),
          },
          {
            id: 'what-is-http',
            q: '10. What is HTTP?',
            a:
              p('HTTP stands for <strong>HyperText Transfer Protocol</strong>. It is one of the main protocols used for communication between web clients and servers.') +
              F.wrap(F.duplex({ t: 'Client', s: 'Browser', c: 'green' }, { t: 'Server', s: 'Backend', c: 'amber' }, 'GET /products', '200 OK + data')) +
              h('Example') +
              p('Browser sends:') + code('GET /products') +
              p('Server replies:') + code('200 OK\n\n[\n  {\n    "id": 1,\n    "name": "Laptop"\n  }\n]') +
              p('HTTP is fundamentally a <strong>request-response</strong> protocol.') +
              ia('HTTP is an application-layer protocol used for communication between clients and servers on the Web. Clients send HTTP requests and servers return HTTP responses.') +
              src('MDN — HTTP Overview'),
          },
          {
            id: 'http-request',
            q: '11. What is an HTTP request?',
            a:
              p('An HTTP request is a message sent by a client to a server asking it to perform an operation or return a resource. A request can contain a method, a URL, headers and a body.') +
              code('POST /api/users\nContent-Type: application/json\n\n{\n  "name": "Rahul",\n  "email": "rahul@example.com"\n}') +
              h('Main parts') +
              `<table><thead><tr><th>Part</th><th>Question it answers</th><th>Example</th></tr></thead><tbody>
                <tr><td><strong>Method</strong></td><td>What operation do you want?</td><td>GET, POST, PUT, PATCH, DELETE</td></tr>
                <tr><td><strong>URL</strong></td><td>Where should the request go?</td><td><code>/api/users</code></td></tr>
                <tr><td><strong>Headers</strong></td><td>Additional information about the request</td><td><code>Content-Type: application/json</code><br><code>Authorization: Bearer token</code></td></tr>
                <tr><td><strong>Body</strong></td><td>Data sent to the server (usually with POST, PUT, PATCH)</td><td>JSON payload</td></tr></tbody></table>` +
              ia('An HTTP request is a message sent from a client to a server containing information such as the HTTP method, URL, headers and optionally a request body.'),
          },
          {
            id: 'http-methods',
            q: '12. What are the HTTP methods?',
            a:
              p('HTTP methods tell the server what the client wants to do.') +
              `<table><thead><tr><th>Method</th><th>Purpose</th><th>Example</th></tr></thead><tbody>
                <tr><td><strong>GET</strong></td><td>Retrieve data. "Give me the users."</td><td><code>GET /users</code></td></tr>
                <tr><td><strong>POST</strong></td><td>Create/send data. "Create a new user."</td><td><code>POST /users</code></td></tr>
                <tr><td><strong>PUT</strong></td><td>Replace/update a resource</td><td><code>PUT /users/10</code></td></tr>
                <tr><td><strong>PATCH</strong></td><td>Partially update a resource</td><td><code>PATCH /users/10</code></td></tr>
                <tr><td><strong>DELETE</strong></td><td>Delete a resource</td><td><code>DELETE /users/10</code></td></tr></tbody></table>` +
              h('Easy memory trick') +
              code('GET     → Get\nPOST    → Create\nPUT     → Replace\nPATCH   → Partially update\nDELETE  → Delete') +
              h('Interview question: what is the difference between PUT and PATCH?') +
              ia('PUT is generally used to replace the target resource with the provided representation, while PATCH is used to apply a partial modification.'),
          },
          {
            id: 'what-is-https',
            q: '13. What is HTTPS?',
            a:
              p('HTTPS means <strong>HTTP Secure</strong>. It uses TLS encryption to protect communication between the client and server. Without encryption, someone who can intercept network traffic could potentially read sensitive information.') +
              F.wrap(F.flow([{ t: 'Browser', c: 'green' }, { t: '🔐 Encrypted', s: 'TLS connection' }, { t: 'Server', c: 'amber' }], { bidir: true, w: 130 })) +
              h('HTTPS provides') +
              ul(['Encryption', 'Server authentication', 'Data integrity']) +
              p('<code>http://example.com</code> is plain HTTP. <code>https://example.com</code> uses HTTPS.') +
              ia('HTTPS is HTTP communicated over TLS. It protects data exchanged between the client and server through encryption and provides authentication and integrity protections.') +
              `<div class="callout amber"><div class="callout-title">Important</div><p>HTTPS does not mean the website itself is trustworthy. It means the connection is protected by TLS.</p></div>`,
          },
          {
            id: 'what-is-client',
            q: '14. What is a client?',
            a:
              p('A client is a device or software that makes requests to a server.') +
              p('Examples: Chrome, Firefox, a mobile application, a desktop application, or another backend service. For a normal website, <strong>browser = client</strong>.') +
              h('Example') +
              p('You open <code>google.com</code>. Your browser sends requests to Google\'s servers.') +
              ia('A client is a software application or device that initiates communication with a server to request resources or services.'),
          },
          {
            id: 'what-is-server',
            q: '15. What is a server?',
            a:
              p('A server is a system/software that receives requests and provides resources or services. For example, a backend server may:') +
              F.wrap(F.flow(['Receive request', 'Validate request', 'Run business logic', 'Query database', 'Return response'].map((t, i) => ({ t: `${i + 1}. ${t}`, c: i === 4 ? 'green' : '' })), { dir: 'v', w: 220, gap: 22 })) +
              p('A server doesn\'t necessarily mean one physical computer. Modern applications can involve many machines and services.') +
              ia('A server is a system that listens for requests from clients and provides resources, data or services in response.'),
          },
          {
            id: 'client-server-architecture',
            q: '16. What is client–server architecture?',
            a:
              p('The client-server model separates responsibilities.') +
              F.wrap(F.flow([{ t: 'Client', s: 'Browser', c: 'green' }, { t: 'Server', s: 'Backend', c: 'amber' }, { t: 'Database', s: 'Data', c: 'gray' }], { bidir: true, w: 130 }), 'HTTP request goes in, data comes back, and the server sends the HTTP response.') +
              h('Example: opening your profile page') +
              F.wrap(F.flow([{ t: 'Browser', s: 'GET /profile', c: 'green' }, { t: 'Backend', s: 'Checks login', c: 'amber' }, { t: 'Database', s: 'User info', c: 'gray' }], { bidir: true, w: 130 }), 'The backend returns the result to the browser as JSON.') +
              h('Why separate them?') +
              p('Because each layer has a different responsibility:') +
              ul(['Frontend → UI', 'Backend → Logic', 'Database → Data']) +
              ia('Client-server architecture separates the application into clients that request services and servers that process those requests and provide responses.'),
          },
          {
            id: 'type-a-url',
            q: '17. What happens when you type a website URL in the browser?',
            a:
              p('This is one of the most important interview questions. Suppose you type <code>https://example.com</code>. A simplified flow:') +
              F.wrap(F.flow([
                { t: '1. Read the URL', s: 'Protocol + domain', c: 'green' },
                { t: '2. DNS lookup', s: 'Domain → IP address' },
                { t: '3. Connection', s: 'Network + TLS for HTTPS' },
                { t: '4. HTTP request', s: 'GET / (Host: example.com)' },
                { t: '5. Server processes', s: 'File, code, database or service', c: 'amber' },
                { t: '6. Server responds', s: '200 OK + HTML', c: 'amber' },
                { t: '7. Browser processes', s: 'Parses HTML, loads CSS, JS, images, fonts' },
                { t: '8. Page rendered', s: 'The page is displayed', c: 'green' },
              ], { dir: 'v', w: 300, gap: 20 })) +
              ia('When a user enters a URL, the browser resolves the domain to an IP address, establishes a connection with the server, performs TLS negotiation for HTTPS, sends an HTTP request, receives a response, downloads required resources, and renders the page.') +
              `<div class="callout amber"><div class="callout-title">Important</div><p>Don't memorize this as only "DNS → HTTP → HTML". Understanding the overall flow is more important.</p></div>`,
          },
          {
            id: 'authn-vs-authz',
            q: '18. What is the difference between authentication and authorization?',
            a:
              p('Another very common interview question.') +
              F.wrap(F.flow([{ t: 'Login', s: 'Email + password' }, { t: 'Authentication', s: 'Who are you?', c: 'green' }, { t: 'Authorization', s: 'What can you do?', c: 'amber' }, { t: 'Access', s: 'Allowed or denied' }], { w: 130 })) +
              h('Authentication: who are you?') +
              p('Example: email + password → login → user verified. You are authenticated.') +
              h('Authorization: what are you allowed to do?') +
              p('Example: Rahul is an Admin, so he may create users, delete users and view reports. A normal user might only view and edit their profile.') +
              h('Example: logging into Instagram') +
              ul(['<strong>Authentication:</strong> are you actually Rahul?', '<strong>Authorization:</strong> can Rahul access this particular resource?']) +
              ia('Authentication verifies the identity of a user or system, while authorization determines what that authenticated identity is allowed to access or perform.') +
              rem('Authentication = who are you? Authorization = what can you do?'),
          },
          {
            id: 'what-is-port',
            q: '19. What is a port?',
            a:
              p('A port identifies a particular network service on a device. Think of an IP address as identifying a building and the port as identifying a particular door/service.') +
              F.wrap(F.ports()) +
              h('Example') +
              p('In <code>localhost:3000</code>, <code>localhost</code> is the machine and <code>3000</code> is the port. Another app can run on <code>localhost:5000</code> on the same computer because it listens on a different port.') +
              h('Common ports') +
              code('80   → HTTP\n443  → HTTPS\n22   → SSH') +
              ia('A port is a logical endpoint used to identify a particular network service or application on a host.') +
              `<div class="callout amber"><div class="callout-title">Important</div><p>A port is not the same thing as an IP address. IP address → which machine? Port → which service?</p></div>`,
          },
          {
            id: 'what-is-github',
            q: '20. What is GitHub, and how is it different from Git?',
            a:
              p('GitHub is a platform for hosting and collaborating on software projects using Git. First understand Git.') +
              h('Git') +
              p('Git is a version control system. It tracks changes to your code, so you can see what changed and return to previous versions.') +
              F.wrap(F.flow([{ t: 'Version 1' }, { t: 'Version 2' }, { t: 'Version 3', c: 'green' }], { w: 120 })) +
              h('GitHub') +
              p('GitHub provides a platform where Git repositories can be hosted and shared. Developers use it for:') +
              ul(['Code hosting', 'Collaboration', 'Pull requests', 'Code reviews', 'Issues', 'Project management', 'CI/CD', 'Open-source projects']) +
              F.wrap(F.flow([{ t: 'Git', s: 'Version control tool', c: 'green' }, { t: 'GitHub', s: 'Platform built around Git', c: 'amber' }], { w: 180, gap: 50, bidir: true })) +
              ia('Git is a distributed version control system used to track changes in source code, while GitHub is a platform that hosts Git repositories and provides collaboration, code review, project management and development workflow features.') +
              src('GitHub Docs — What is GitHub?'),
          },
        ],

        notes: [
          {
            id: 'quick-flow',
            title: 'Quick note: the whole web flow in one line',
            date: '2026-10-08',
            body:
              p('<strong>User → Browser → Frontend → API → Backend → Database → Backend → API → Frontend → User</strong>') +
              ul(['Frontend = presentation', 'Backend = logic + data', 'Database = long-term memory', 'API = the controlled doorway between them']) +
              p('If you can explain this line with one example (like clicking "Buy Now"), you can answer most questions in this module.'),
          },
          {
            id: 'quick-mnemonics',
            title: 'Quick note: memory tricks',
            date: '2026-10-08',
            body:
              code('GET     → Get\nPOST    → Create\nPUT     → Replace\nPATCH   → Partially update\nDELETE  → Delete') +
              ul(['Authentication = <strong>who</strong> are you? Authorization = <strong>what</strong> can you do?', 'IP address = which <strong>machine</strong>? Port = which <strong>service</strong>?', 'Git = the tool. GitHub = the platform built around it.', 'Internet = the network. Web = a service on it.']),
          },
          {
            id: 'quick-ports-status',
            title: 'Quick note: ports to remember',
            date: '2026-10-08',
            body:
              `<table><thead><tr><th>Port</th><th>Used for</th></tr></thead><tbody><tr><td>80</td><td>HTTP</td></tr><tr><td>443</td><td>HTTPS</td></tr><tr><td>22</td><td>SSH</td></tr><tr><td>3000 / 5000</td><td>Common local development apps</td></tr></tbody></table>`,
          },
          {
            id: 'quick-dont-say',
            title: 'Quick note: things not to say in an interview',
            date: '2026-10-08',
            body:
              ul(['"SQL is always better" or "NoSQL is always faster". It depends on the requirements.', '"HTTPS means the website is trustworthy". It only means the connection is encrypted.', '"The URL flow is just DNS → HTTP → HTML". Explain the whole flow.', '"The frontend can call the database directly". Never trust the client.']),
          },
        ],

        quiz: [
          { q: 'What is the relationship between the Internet and the Web?', options: ['They are the same thing', 'The Internet is the network; the Web is a service that runs on it', 'The Web is the network; the Internet is a website', 'The Internet only exists inside browsers'], answer: 1, explain: 'Internet ≠ Web. The Internet is the infrastructure, the Web is one service that uses it.' },
          { q: 'Which is a static website?', options: ['A banking app', 'A portfolio that serves ready-made HTML, CSS and JS files', 'Instagram', 'An app that builds pages from database data'], answer: 1, explain: 'A static site sends pre-created files as they are.' },
          { q: 'Which technology is responsible for the structure of a web page?', options: ['CSS', 'JavaScript', 'HTML', 'SQL'], answer: 2, explain: 'HTML = structure, CSS = styling, JavaScript = behavior.' },
          { q: 'Which of these belongs to the backend?', options: ['Product cards', 'Navigation bar', 'Authentication and validation', 'Buttons'], answer: 2, explain: 'Business logic, authentication, validation and database operations are server-side.' },
          { q: 'What is the best short description of a database?', options: ['A tool that styles pages', 'The application\'s long-term memory for storing and retrieving data', 'A browser feature', 'A type of API'], answer: 1, explain: 'A database persists, organizes and retrieves application data.' },
          { q: 'Which is a SQL (relational) database?', options: ['MongoDB', 'PostgreSQL', 'Both', 'Neither'], answer: 1, explain: 'PostgreSQL is relational. MongoDB is a NoSQL document database.' },
          { q: 'Which statement is the correct way to talk about SQL vs NoSQL?', options: ['SQL is always better', 'NoSQL is always faster', 'The right choice depends on the application\'s requirements', 'They cannot be used together'], answer: 2, explain: 'Avoid absolute statements in interviews.' },
          { q: 'Why should the frontend not connect directly to the database?', options: ['It is slower to type', 'The client is untrusted and credentials would be exposed', 'Browsers do not support databases', 'Databases cannot store JSON'], answer: 1, explain: 'Exposing credentials or unrestricted access to the browser is a serious security risk.' },
          { q: 'What does API stand for?', options: ['Application Programming Interface', 'Applied Program Integration', 'Automatic Protocol Interface', 'Application Process Input'], answer: 0, explain: 'Application Programming Interface.' },
          { q: 'In the restaurant analogy, what is the API?', options: ['The customer', 'The kitchen', 'The waiter', 'The storage'], answer: 2, explain: 'You talk to the waiter (API), who talks to the kitchen (backend).' },
          { q: 'Why do we need APIs?', options: ['To let one backend serve web, mobile and admin clients in a controlled way', 'To make CSS faster', 'To replace databases', 'To avoid using HTTP'], answer: 0, explain: 'APIs give a standard, controlled communication layer for many clients.' },
          { q: 'HTTP is fundamentally which kind of protocol?', options: ['Streaming only', 'Request-response', 'Peer-to-peer only', 'Database query'], answer: 1, explain: 'Clients send requests; servers return responses.' },
          { q: 'Which are the main parts of an HTTP request?', options: ['Method, URL, headers, optional body', 'Title, footer, sidebar', 'Table, row, column', 'Port, IP, DNS only'], answer: 0, explain: 'Method, URL, headers and optionally a body.' },
          { q: 'Which HTTP method is generally used to partially update a resource?', options: ['GET', 'POST', 'PUT', 'PATCH'], answer: 3, explain: 'PATCH is a partial modification; PUT generally replaces the resource.' },
          { q: 'What does HTTPS use to protect communication?', options: ['TLS encryption', 'CSS', 'SQL', 'DNS'], answer: 0, explain: 'HTTPS is HTTP over TLS: encryption, server authentication and integrity.' },
          { q: 'Does HTTPS mean the website itself is trustworthy?', options: ['Yes, always', 'No, it only means the connection is protected by TLS', 'Only on weekdays', 'Yes, if it uses port 80'], answer: 1, explain: 'A malicious site can still use HTTPS.' },
          { q: 'In a normal website visit, what is the client?', options: ['The database', 'The browser', 'The DNS server', 'The router only'], answer: 1, explain: 'The browser initiates requests, so it is the client.' },
          { q: 'What happens right after the browser reads the URL, before connecting?', options: ['It renders the page', 'DNS lookup to find the IP address of the domain', 'It queries the database', 'It downloads images'], answer: 1, explain: 'The domain must be resolved to an IP address first.' },
          { q: 'Authentication answers which question?', options: ['What can you do?', 'Who are you?', 'Where are you?', 'How fast are you?'], answer: 1, explain: 'Authentication verifies identity; authorization decides what that identity can do.' },
          { q: 'What does the port in localhost:3000 identify?', options: ['The machine', 'The browser', 'The service/application on that machine', 'The database table'], answer: 2, explain: 'IP address = which machine, port = which service.' },
        ],
      },
    ],
  });
})();
