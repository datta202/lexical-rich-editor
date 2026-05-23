import { useCallback, useEffect, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { Check, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { useLinkEdit } from './linkEdit'
import { sanitizeUrl } from './sanitizeUrl'

type Pos = { top: number; left: number } | null

/**
 * A small floating panel that appears over a link: shows the URL with
 * open/edit/remove actions, and an input for editing or creating one.
 */
export function FloatingLinkEditorPlugin() {
  const [editor] = useLexicalComposerContext()
  const { isLinkEditMode, setIsLinkEditMode } = useLinkEdit()

  const [isLink, setIsLink] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [pos, setPos] = useState<Pos>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    let nextUrl: string | null = null

    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode()
      const linkNode = $findMatchingParent(node, $isLinkNode)
      if (linkNode) nextUrl = linkNode.getURL()
    }

    setIsLink(nextUrl !== null)
    setLinkUrl(nextUrl ?? '')

    // Position the panel under the current selection / link.
    const nativeSel = window.getSelection()
    if (nativeSel && nativeSel.rangeCount > 0) {
      const rect = nativeSel.getRangeAt(0).getBoundingClientRect()
      if (rect.width || rect.height) {
        setPos({
          top: rect.bottom + 8,
          left: Math.max(8, rect.left),
        })
      }
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(updateLinkEditor)
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(updateLinkEditor)
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditor])

  // Focus the input when entering edit mode (uncontrolled input below).
  useEffect(() => {
    if (isLinkEditMode) {
      requestAnimationFrame(() => inputRef.current?.select())
    }
  }, [isLinkEditMode, linkUrl])

  const open = isLink || isLinkEditMode
  if (!open || !pos) return null

  const save = () => {
    const url = (inputRef.current?.value ?? '').trim()
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url === '' ? null : sanitizeUrl(url))
    setIsLinkEditMode(false)
  }

  const remove = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    setIsLinkEditMode(false)
  }

  return (
    <div
      className="fixed z-50 flex items-center gap-1 rounded-[8px] border border-border bg-popover p-1 shadow-lg"
      style={{ top: pos.top, left: pos.left }}
      // Don't let clicks here steal the editor selection.
      onMouseDown={(e) => e.preventDefault()}
    >
      {isLinkEditMode ? (
        <>
          <input
            ref={inputRef}
            key={`${linkUrl}-edit`}
            defaultValue={linkUrl}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                save()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                setIsLinkEditMode(false)
              }
            }}
            placeholder="https://example.com"
            className="h-7 w-56 rounded-[6px] border border-input bg-background px-2 text-sm text-foreground outline-none focus:border-ring"
          />
          <button
            type="button"
            aria-label="Save link"
            onClick={save}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Check size={15} />
          </button>
        </>
      ) : (
        <>
          <a
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="max-w-56 truncate px-2 text-sm text-primary hover:text-primary-hover"
          >
            {linkUrl}
          </a>
          <button
            type="button"
            aria-label="Open link"
            onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink size={15} />
          </button>
          <button
            type="button"
            aria-label="Edit link"
            onClick={() => setIsLinkEditMode(true)}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label="Remove link"
            onClick={remove}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-secondary hover:text-destructive"
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    </div>
  )
}
