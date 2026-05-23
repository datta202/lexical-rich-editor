import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { registerCodeHighlighting } from '@lexical/code-prism'

/** Tokenizes code blocks with Prism and keeps the highlighting in sync. */
export function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => registerCodeHighlighting(editor), [editor])
  return null
}
