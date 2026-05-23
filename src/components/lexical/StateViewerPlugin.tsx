import { useState } from 'react'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import type { EditorState } from 'lexical'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Serializes the live editor state to JSON in a collapsible panel — watch
 * Lexical's immutable EditorState tree update on every change.
 */
export function StateViewerPlugin() {
  const [json, setJson] = useState('')
  const [open, setOpen] = useState(true)

  return (
    <div className="border-t border-border">
      <OnChangePlugin
        onChange={(editorState: EditorState) =>
          setJson(JSON.stringify(editorState.toJSON(), null, 2))
        }
      />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ChevronRight
          size={14}
          className={cn('transition-transform', open && 'rotate-90')}
        />
        Editor state (JSON)
      </button>
      {open && (
        <pre className="max-h-72 overflow-auto bg-code px-4 pb-4 font-mono text-xs leading-relaxed text-state-viewer-foreground">
          {json || 'Type above to see the editor state update live…'}
        </pre>
      )}
    </div>
  )
}
