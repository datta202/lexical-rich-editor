# lexical-rich-editor

A rich-text editor built on [Lexical](https://lexical.dev), grown one feature at a time — plus a
two-pane **real-time collaborative** editor on a second page.

Built with Vite + React 19 + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev          # dev server (single-user editor at /, collab demo at /collab.html)
npm run build        # type-check + production build (base = /)
npm run build:embed  # production build for a subpath (VITE_BASE=/lexical/)
npm run lint         # eslint
```

## Features

- Rich text: **bold**, *italic*, underline, strikethrough, inline `code`
- Block types: headings (H1–H3), quotes, code blocks with **Prism syntax highlighting**
- Lists: bullet, numbered, and **check lists**
- **Links**: floating link editor (add / edit / open / remove), auto-linking of typed
  URLs and emails, clickable links
- **Tables** (insert 3×3 with a header row)
- **Images** (insert by URL; custom decorator node with JSON + DOM serialization)
- **Equations** rendered with KaTeX (LaTeX)
- **Horizontal rules**
- **Markdown shortcuts** — type `## `, `- `, `> `, `` ``` `` etc. and they transform live
- **Slash (`/`) command menu** to insert any block
- Text alignment: left / center / right
- Undo / redo history
- A live **EditorState (JSON)** viewer that updates on every change
- **Real-time collaboration** (`/collab.html`) — two editors of the same document side by side,
  syncing live with presence cursors over **Yjs + WebRTC**, falling back to **BroadcastChannel**
  for same-origin tab-to-tab sync. No server required (an optional signaling server on
  `localhost:1235` helps cross-browser testing).

## Pages & embed modes

A multi-page Vite build (`vite.config.ts`):

- `index.html` — the single-user editor.
- `collab.html` — the two-pane collaborative demo; each pane iframes `collab-app.html` (one
  editor instance, identity via `?name=`).

The editor reads query params so it can be embedded on itsdatta.com:

- `?embed` — drop the page header/chrome (fills the iframe).
- `?minimal` — trim to a basic teaching toolbar (used inside the blog post).
- `?theme=dark|light` — initial theme; the host also pushes changes via
  `postMessage({ type: 'set-theme' })`, which the app listens for (live light/dark sync).

## Deployment (as an embed on itsdatta.com)

Built and shipped by the [itsdatta-platform](https://github.com/datta202/itsdatta-platform) ops
repo with `build:embed` (`VITE_BASE=/lexical/`), served at `https://itsdatta.com/lexical/` and
embedded in an iframe.

## Roadmap

Genuinely deferred (need extra deps/infra): rich embeds (YouTube/Twitter/Figma), Excalidraw
drawings, threaded comments, and **persistence/auth for collaboration** (today the collab demo is
ephemeral and same-origin — no document storage or access control).
