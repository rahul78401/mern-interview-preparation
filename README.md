# Interview Preparation Guide

A modular study guide for interview prep: modules and sub-modules, each with an overview, Q&A, notes and a quiz. Plain HTML, CSS and JavaScript. No install and no build step.

## Run it

Open `index.html` in a browser. That's it. It also works on any static host (GitHub Pages, Netlify, etc.).

## Structure

```
index.html            page shell + list of module scripts
css/styles.css        theme (white background, black text; gray, green, amber accents)
js/registry.js        tiny registry that content files plug into
js/app.js             router, views, progress tracking, quiz, search
content/site.js       site title, hero text, manual "What's new" entries
content/00-*.js       one file per module
content/_template.js  copy this to start a new module (not loaded by the site)
```

## Add a module

1. Copy `content/_template.js` to `content/01-your-module.js` and fill it in.
2. Add `<script src="content/01-your-module.js"></script>` to the **MODULES** block in `index.html`.

The sidebar, home cards, search and "What's new" update automatically. Each module has `sections` (sub-modules), and each section can have:

| Field | Shows as |
| --- | --- |
| `intro`, `keyPoints`, `tip` | Overview tab |
| `qna` | Q&A tab (filter by level, mark "Got it" / "Revise later") |
| `notes` | Notes tab (blog-style articles) |
| `quiz` | Quiz tab (one question at a time, with explanations) |

Tabs without content are hidden. Answers, intros and note bodies accept HTML. Handy classes: `callout green`, `callout amber`, `<pre><code>`, tables, blockquotes.

## Progress

"Got it", "Revise later" and quiz scores are saved in the browser's `localStorage`. The **Quick recap** page collects everything flagged for revision. Give questions a stable `id` so progress survives reordering.

## Shortcuts

`/` or `Ctrl+K` opens search. `Esc` closes it.

The module in `content/00-start-here.js` is a sample. Replace or delete it once real content arrives (and remove its script line from `index.html`).
