/* ------------------------------------------------------------------
   MODULE TEMPLATE  (this file is NOT loaded by the site)

   To add a module:
   1. Copy this file to content/<number>-<name>.js
   2. Fill it in
   3. Add one <script src="content/<number>-<name>.js"></script> line
      to index.html, in the "MODULES" block.

   Every text field that says "html" accepts HTML (<p>, <ul>, <code>, <pre>...).
   ------------------------------------------------------------------ */
Learn.register({
  id: 'module-id',              // unique, lowercase, no spaces (used in the URL)
  order: 1,                     // position in the sidebar
  title: 'Module title',
  summary: 'One or two lines shown on cards.',
  added: '2026-10-08',          // YYYY-MM-DD, feeds "What's new"
  // sample: true,              // shows a "Sample" badge; remove when real

  sections: [                   // sub-modules
    {
      id: 'section-id',
      title: 'Sub-module title',
      description: 'One line shown on the card and page header.',

      /* Overview tab */
      intro: '<p>Explain the topic in plain words.</p>',
      keyPoints: ['Short point to remember', 'Another one'],   // green box
      tip: 'Optional amber tip shown under the key points.',

      /* Q&A tab */
      qna: [
        {
          id: 'what-is-x',      // optional but recommended: keeps progress safe if you reorder
          q: 'The question?',
          a: '<p>The answer.</p>',
        },
      ],

      /* Notes tab (blog-style articles) */
      notes: [
        {
          id: 'note-id',
          title: 'Article title',
          date: '2026-10-08',
          tags: ['topic'],
          body: '<p>Article body.</p>',
        },
      ],

      /* Quiz tab */
      quiz: [
        {
          q: 'Question text?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: 1,            // index of the correct option (0 = first)
          explain: 'Why this is the right answer.',
        },
      ],
    },
  ],
});
