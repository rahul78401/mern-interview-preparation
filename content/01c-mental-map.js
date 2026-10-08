/* Module 1 (Introduction), sub-module 3: The Mental Map (overview only). */
(() => {
  const F = Learn.fig;
  const mod = Learn.modules.find((m) => m.id === 'introduction');
  if (!mod) return;

  const table = (head, rows) =>
    `<table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  const intro =
    `<div class="doc">` +
    `<div class="callout green"><div class="callout-title">One final mental picture</div><p>Everything from this module in a single picture. Read it <strong>top to bottom</strong> for a request, and follow the dashed green line to see the response come back.</p></div>` +
    `<div class="arch">${F.wrap(F.architecture())}</div>` +

    `<h3>How to read it</h3>` +
    `<ol>
      <li><strong>User → Browser:</strong> the user acts; the browser sends the request.</li>
      <li><strong>DNS + Internet:</strong> the domain is turned into a server address.</li>
      <li><strong>CDN / Load balancer:</strong> static files come from a nearby copy; dynamic requests are spread across servers.</li>
      <li><strong>Backend:</strong> validates the request, checks who you are, runs the business logic, exposes the API.</li>
      <li><strong>Database, Cache, Queue:</strong> the backend stores data, reads fast copies, or hands slow work to a queue.</li>
      <li><strong>Worker → External services:</strong> a worker does the background job and calls outside services such as payments or email.</li>
    </ol>` +

    `<h3>What each layer is for</h3>` +
    table(['Layer', 'Job', 'Common examples'], [
      ['DNS', 'Domain → IP address', 'Cloudflare DNS, Route 53'],
      ['CDN', 'Serve static files from a nearby location', 'Cloudflare, CloudFront'],
      ['Load balancer', 'Spread traffic across servers', 'Nginx, AWS ALB'],
      ['Backend', 'API, auth, business logic, validation', 'Node.js, Spring Boot, Django'],
      ['Database', 'Permanent, organized data', 'PostgreSQL, MongoDB'],
      ['Cache', 'Fast temporary copies of data', 'Redis'],
      ['Queue + Worker', 'Slow work done in the background', 'RabbitMQ, SQS, Kafka'],
      ['External services', 'Things you don\'t build yourself', 'Payments, email, SMS, AI APIs'],
    ]) +

    `<h3>Also part of real systems</h3>` +
    `<div class="learn"><span>Logging &amp; monitoring</span><span>HTTPS / TLS</span><span>Rate limiting</span><span>CI/CD</span><span>Backups</span></div>` +
    `<div class="callout amber" style="margin-top:20px"><div class="callout-title">Interview tip</div><p>If asked to "walk through a system", start at the user and move down this picture, one layer at a time. Mention why each layer exists, not only its name.</p></div>` +
    `</div>`;

  mod.sections.push({
    id: 'mental-map',
    title: 'The Mental Map',
    description: 'One picture of how the whole system fits together, from user to external services.',
    intro,
    keyPoints: [
      'A request flows down; the response comes back up the same path.',
      'The backend is the brain: API, auth, business logic, validation.',
      'Database stores, cache speeds up, queue + worker handle slow jobs.',
      'External services (payments, email, SMS, AI) are called through their APIs.',
    ],
    qna: [],
    notes: [],
    quiz: [],
  });
})();
