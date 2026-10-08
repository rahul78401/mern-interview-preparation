/* Module 1 (Introduction), first sub-module: Installation (overview only).
   Loaded right after 01-introduction.js and placed at the top of the module. */
(() => {
  const mod = Learn.modules.find((m) => m.id === 'introduction');
  if (!mod) return;

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const code = (t) => `<pre><code>${esc(t)}</code></pre>`;
  const play = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  const video = (title, url) =>
    `<a class="video-card" href="${url}" target="_blank" rel="noopener"><span class="video-ico">${play}</span><span><b>${title}</b><small>Watch on YouTube · opens in a new tab</small></span></a>`;

  const intro =
    `<div class="doc">` +
    `<div class="callout green"><div class="callout-title">Install these before you start</div><p>Four tools. Do them in the order below, and use the video for each step.</p></div>` +

    `<table><thead><tr><th>Tool</th><th>What it is</th><th>Why we need it</th></tr></thead><tbody>
      <tr><td><strong>Node.js + npm</strong></td><td>JavaScript runtime and its package manager</td><td>Runs NestJS and installs packages</td></tr>
      <tr><td><strong>NestJS CLI</strong></td><td>Command-line tool for NestJS</td><td>Creates and runs NestJS projects</td></tr>
      <tr><td><strong>PostgreSQL</strong></td><td>The SQL database server</td><td>Stores our application data</td></tr>
      <tr><td><strong>pgAdmin 4</strong></td><td>Visual app for PostgreSQL</td><td>Browse tables and run queries</td></tr></tbody></table>` +

    `<h3>1. Node.js and npm</h3>` +
    `<p class="line">npm comes bundled with Node.js, so one install gives you both.</p>` +
    video('How to install npm on Mac', 'https://www.youtube.com/results?search_query=install+npm+mac') +
    `<p class="line">Check it worked:</p>` + code('node -v\nnpm -v') +

    `<h3>2. PostgreSQL and pgAdmin 4</h3>` +
    `<p class="line">Install the database first, then pgAdmin 4 to see it.</p>` +
    video('How to install PostgreSQL and pgAdmin 4 on Mac', 'https://www.youtube.com/results?search_query=how+to+install+postgresql+and+pgadmin4+in+mac') +
    `<p class="line">Check it worked:</p>` + code('psql --version') +

    `<h3>3. NestJS</h3>` +
    `<p class="line">Needs Node.js and npm from step 1. Install the CLI once, then create a project.</p>` +
    code('npm i -g @nestjs/cli\nnest --version\n\nnest new my-project') +
    `<p class="source">Docs: <a href="https://docs.nestjs.com/" target="_blank" rel="noopener">docs.nestjs.com</a></p>` +
    `</div>`;

  mod.sections.unshift({
    id: 'installation',
    title: 'Installation',
    description: 'What to install before starting, with a video for each step.',
    intro,
    keyPoints: [
      'Install in order: Node.js + npm, then PostgreSQL + pgAdmin 4, then the NestJS CLI.',
      'Verify each tool with its version command.',
    ],
    qna: [],
    notes: [],
    quiz: [],
  });
})();
