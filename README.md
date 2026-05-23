# lexical-rich-editor

A rich-text editor built on [Lexical](https://lexical.dev), grown one feature at a time.

Built with Vite + React + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # eslint
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

## Roadmap

Heavier playground features are intentionally deferred (they need extra deps or
infrastructure): rich embeds (YouTube/Twitter/Figma), Excalidraw drawings, real-time
collaboration (Yjs + a WebSocket server), and threaded comments.
