import type { EditorThemeClasses } from 'lexical'

/**
 * Maps Lexical node types to Tailwind classes. Lexical applies these classNames
 * directly to the contenteditable DOM nodes.
 */
export const editorTheme: EditorThemeClasses = {
  paragraph: 'mb-2 last:mb-0',
  heading: {
    h1: 'mt-2 mb-2 text-2xl font-bold text-heading',
    h2: 'mt-2 mb-2 text-xl font-semibold text-heading',
    h3: 'mt-2 mb-1 text-lg font-semibold text-heading',
  },
  quote: 'my-2 border-l-2 border-primary/50 pl-4 italic text-prose-muted',
  list: {
    ul: 'my-2 list-disc pl-6',
    ol: 'my-2 list-decimal pl-6',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
    code: 'rounded-[4px] bg-code-inline-bg px-1.5 py-0.5 font-mono text-[0.9em] text-code-inline-foreground',
  },
  code: 'my-2 block overflow-x-auto rounded-[8px] bg-code p-3 font-mono text-sm text-code-foreground',
}
