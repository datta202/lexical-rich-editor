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

## Current features

The foundation is the editor ported from [itsdatta.com](https://itsdatta.com):

- Rich text: **bold**, *italic*, underline, strikethrough, inline `code`
- Block types: headings (H1/H2), quotes
- Lists: bullet and numbered
- **Links**: a floating link editor (add / edit / open / remove), auto-linking of
  typed URLs and emails, and clickable links
- Text alignment: left / center / right
- Undo / redo history
- A live **EditorState (JSON)** viewer that updates on every change

## Roadmap

Features are added incrementally — e.g. links, code blocks with syntax
highlighting, markdown shortcuts, checklists, tables, images, and more.
