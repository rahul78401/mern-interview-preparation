/* Course outline: modules and sub-modules ONLY (no content yet).
   Fill a sub-module later by adding intro / qna / notes / quiz to its entry,
   or by moving it into its own file (see _template.js).
   Empty sub-modules show a "Nothing here yet" page. */
(() => {
  const slug = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sections = (titles) => titles.map((title) => ({ id: slug(title), title, qna: [], notes: [], quiz: [] }));

  const outline = [
    ['typescript', 'TypeScript', 'Types, interfaces, generics and the TypeScript features used in NestJS.', [
      'Why TypeScript', 'Basic Types', 'Interfaces vs Types', 'any, unknown & never', 'Unions, Intersections & Literal Types',
      'Enums', 'Generics', 'Utility Types', 'Type Guards & Narrowing', 'Classes & OOP in TypeScript',
      'Access Modifiers', 'Decorators', 'Modules & Imports', 'tsconfig.json', 'Async & Promises in TypeScript',
    ]],

    ['nodejs', 'Node.js', 'The runtime behind the backend.', [
      'What is Node.js', 'How Node.js Works (V8 & libuv)', 'Modules: CommonJS vs ESM', 'npm & package.json',
      'Async Patterns: Callbacks, Promises, async/await', 'Streams & Buffers', 'File System', 'Events & EventEmitter',
      'Worker Threads & Cluster', 'process & Environment Variables', 'Error Handling & Process Events', 'Built-in Modules',
    ]],

    ['backend', 'Backend', 'The server side: core concepts, frameworks and how requests are handled.', [
      'Important Concepts', 'Backend Frameworks', 'Event Loop', 'Request & Response Lifecycle', 'Routing',
      'Middleware', 'Validation & DTOs', 'Error Handling & Logging', 'Configuration & Environments',
      'File Uploads', 'Real-time & WebSockets', 'Monolith vs Microservices', 'Clean Architecture & Layers',
    ]],

    ['nestjs', 'NestJS', 'The framework we build with.', [
      'Introduction & CLI', 'Project Structure', 'Modules', 'Controllers & Routing', 'Providers & Services',
      'Dependency Injection', 'DTOs & Validation', 'Pipes', 'Guards', 'Interceptors', 'Middleware',
      'Exception Filters', 'Custom Decorators', 'Request Lifecycle', 'Configuration', 'Database Integration',
      'Authentication (Passport & JWT)', 'Authorization & Roles', 'Swagger / OpenAPI', 'File Upload',
      'Caching', 'Queues (BullMQ)', 'Task Scheduling', 'Events', 'WebSocket Gateways', 'Microservices',
      'Logging', 'API Versioning', 'Rate Limiting', 'Lifecycle Hooks', 'Testing in NestJS',
    ]],

    /* Sub-modules for SQL live in content/03-sql-*.js */
    ['sql', 'SQL', 'How databases store, relate and protect data, and the language used to talk to them.', []],

    ['system-design', 'System Design', 'Designing systems that scale.', [
      'Scalability', 'Vertical vs Horizontal Scaling', 'Load Balancing', 'Caching & CDN', 'Database Scaling',
      'Consistency vs Availability', 'Microservices vs Monolith', 'API Gateway', 'Message-Driven Design',
      'Idempotency & Retries', 'Design a URL Shortener', 'Design a Rate Limiter', 'Design a Chat App',
    ]],


  ];

  outline.forEach(([id, title, summary, subs], i) => {
    Learn.register({ id, order: i + 2, title, summary, sections: sections(subs) });
  });
})();
