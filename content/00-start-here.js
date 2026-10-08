/* Sample module: shows every feature of the site. Replace or delete when real content arrives. */
Learn.register({
  id: 'start-here',
  order: 0,
  title: 'Start here',
  summary: 'How to use this guide, plus interview basics that apply to every round.',
  added: '2026-10-08',
  sample: true,

  sections: [
    {
      id: 'introduce-yourself',
      title: 'Introducing yourself',
      description: 'The first question in almost every interview. Get it right and the rest feels easier.',
      intro:
        '<p>"Tell me about yourself" is not an invitation to recite your life story. The interviewer wants a short, confident summary of who you are professionally and why you fit this role.</p>' +
        '<p>Prepare it once, practise it out loud, and keep it between <strong>30 and 90 seconds</strong>.</p>',
      keyPoints: [
        'Use the Present → Past → Future structure.',
        'Keep it professional and relevant to the role.',
        'Practise out loud so it sounds natural, not memorised.',
      ],
      tip: 'End with a sentence that links to the role, so the interviewer knows where to take the conversation next.',

      qna: [
        {
          id: 'tell-me-about-yourself',
          q: 'Tell me about yourself.',
          level: 'basic',
          tags: ['intro', 'hr'],
          a:
            '<p>Use three beats:</p>' +
            '<ul><li><strong>Present:</strong> what you do now and one strength.</li>' +
            '<li><strong>Past:</strong> one or two experiences that built the skills for this role.</li>' +
            '<li><strong>Future:</strong> why this role is the logical next step.</li></ul>' +
            '<div class="callout green"><strong>Example shape:</strong> "I\'m a developer who builds web apps end to end. Before this I worked on X, where I learned Y. I\'m now looking for a role where I can do more of Z, which is why this position interested me."</div>',
        },
        {
          id: 'why-hire-you',
          q: 'Why should we hire you?',
          level: 'basic',
          tags: ['hr', 'fit'],
          a:
            '<p>Match your strengths to their needs. Pick <strong>two or three</strong> points from the job description and back each with a short proof point.</p>' +
            '<p>Avoid comparing yourself to other candidates. Talk about the value you bring.</p>',
        },
        {
          id: 'strengths-weaknesses',
          q: 'What are your strengths and weaknesses?',
          level: 'intermediate',
          tags: ['hr', 'self-awareness'],
          a:
            '<p><strong>Strengths:</strong> choose ones relevant to the role and give an example.</p>' +
            '<p><strong>Weakness:</strong> choose a real, non-critical one, then show what you are doing to improve it.</p>' +
            '<div class="callout amber"><strong>Avoid:</strong> disguised strengths such as "I work too hard". Interviewers have heard them all.</div>',
        },
      ],

      notes: [
        {
          id: 'present-past-future',
          title: 'A simple structure for your introduction',
          date: '2026-10-08',
          tags: ['intro', 'structure'],
          body:
            '<p>Most weak introductions fail for one reason: no structure. The speaker starts with where they were born and never reaches the point.</p>' +
            '<h3>The three beats</h3>' +
            '<ol><li><strong>Present</strong> – your current role or focus, in one sentence.</li>' +
            '<li><strong>Past</strong> – the experience that matters most for this job.</li>' +
            '<li><strong>Future</strong> – what you want next, and why it is this role.</li></ol>' +
            '<h3>Practice routine</h3>' +
            '<p>Write it out, cut it to about 150 words, then say it aloud three times. Record yourself once and listen for filler words.</p>' +
            '<blockquote>If you cannot say it in under 90 seconds, it is not an introduction yet.</blockquote>',
        },
      ],

      quiz: [
        {
          q: 'Which structure works best for "Tell me about yourself"?',
          options: [
            'A full chronological life story',
            'Present → Past → Future',
            'Only your hobbies',
            'Your resume, line by line',
          ],
          answer: 1,
          explain: 'Present → Past → Future keeps the answer short, relevant and pointed at the role.',
        },
        {
          q: 'How long should a self-introduction be?',
          options: ['About 10 seconds', '30 to 90 seconds', 'Around 5 minutes', 'As long as the interviewer lets you talk'],
          answer: 1,
          explain: 'Long enough to cover the three beats, short enough to keep the interviewer engaged.',
        },
        {
          q: 'What is the strongest way to answer "What is your weakness?"',
          options: [
            'Say you have none',
            'Name a real weakness and show how you are improving it',
            'Name a strength in disguise, like "I work too hard"',
            'Change the subject',
          ],
          answer: 1,
          explain: 'Honesty plus a concrete improvement plan shows self-awareness, which is what the question tests.',
        },
      ],
    },

    {
      id: 'star-method',
      title: 'Answering with STAR',
      description: 'A reliable format for every "tell me about a time when..." question.',
      intro:
        '<p>Behavioural questions ask for a real example. <strong>STAR</strong> keeps your answer focused and easy to follow.</p>' +
        '<ul><li><strong>S</strong>ituation – the context, briefly.</li>' +
        '<li><strong>T</strong>ask – what you were responsible for.</li>' +
        '<li><strong>A</strong>ction – what <em>you</em> did, step by step.</li>' +
        '<li><strong>R</strong>esult – the outcome, ideally with a number.</li></ul>',
      keyPoints: [
        'Spend most of your time on Action and Result.',
        'Say "I" for your own contribution, "we" for the team.',
        'Prepare four or five stories that can be reused for different questions.',
      ],

      qna: [
        {
          id: 'what-is-star',
          q: 'What is the STAR method?',
          level: 'basic',
          tags: ['behavioural', 'star'],
          a:
            '<p>A framework for answering behavioural questions: <strong>Situation, Task, Action, Result</strong>. It turns a rambling story into a clear one.</p>',
        },
        {
          id: 'star-length',
          q: 'How long should a STAR answer be?',
          level: 'basic',
          tags: ['behavioural', 'timing'],
          a:
            '<p>Around <strong>1.5 to 2 minutes</strong>. Roughly: 20% setup (Situation + Task), 60% Action, 20% Result.</p>',
        },
        {
          id: 'no-real-example',
          q: 'What if I do not have a real work example?',
          level: 'intermediate',
          tags: ['behavioural', 'freshers'],
          a:
            '<p>Use college projects, internships, open-source work, or personal projects. The interviewer cares about <em>how you act</em>, not where it happened.</p>' +
            '<div class="callout amber">Never invent an example. Follow-up questions will expose it quickly.</div>',
        },
      ],

      notes: [],

      quiz: [
        {
          q: 'What does STAR stand for?',
          options: [
            'Skill, Team, Approach, Review',
            'Situation, Task, Action, Result',
            'Start, Think, Act, Reflect',
            'Scope, Time, Actor, Reason',
          ],
          answer: 1,
          explain: 'Situation, Task, Action, Result.',
        },
        {
          q: 'Which part of a STAR answer should get the most time?',
          options: ['Situation', 'Task', 'Action', 'The closing thank-you'],
          answer: 2,
          explain: 'Action is what shows your skills and judgement, so it deserves roughly 60% of the answer.',
        },
        {
          q: 'When describing a team project, you should...',
          options: [
            'Say "we" for everything',
            'Take credit for the whole project',
            'Say "I" for your contribution and "we" for the team',
            'Avoid mentioning the team',
          ],
          answer: 2,
          explain: 'Interviewers are hiring you, not your team. Be clear about what you personally did.',
        },
      ],
    },
  ],
});
