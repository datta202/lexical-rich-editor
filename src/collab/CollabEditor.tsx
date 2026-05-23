import { useCallback, useEffect, useRef, useState } from 'react'
import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin'
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import type { Provider } from '@lexical/yjs'
import type { Doc } from 'yjs'
import { editorTheme } from '@/components/lexical/theme'
import { ToolbarPlugin } from '@/components/lexical/ToolbarPlugin'
import { LinkEditProvider } from '@/components/lexical/LinkEditProvider'
import { createWebRTCProvider } from './providers'

const PLACEHOLDER = 'Start typing — edits sync live to the other pane…'

// This pane's identity comes from the URL (the two-pane page passes ?name=Datta / Kiran).
const NAME = new URLSearchParams(window.location.search).get('name') ?? 'Guest'
const COLORS: Record<string, string> = { Datta: '#0969da', Kiran: '#d6336c' }
const COLOR = COLORS[NAME] ?? '#8957e5'

const initialConfig: InitialConfigType = {
  namespace: 'lexical-rich-collab',
  theme: editorTheme,
  // Collaboration owns the initial state — do not seed it locally.
  editorState: null,
  onError(error) {
    throw error
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
}

type ActiveUser = { name: string; color: string }

export function CollabEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [users, setUsers] = useState<ActiveUser[]>([])

  const providerFactory = useCallback((id: string, docMap: Map<string, Doc>) => {
    const p = createWebRTCProvider(id, docMap)
    // CollaborationPlugin doesn't hand us the provider directly; grab it async.
    setTimeout(() => setProvider(p), 0)
    return p
  }, [])

  useEffect(() => {
    if (!provider) return
    const { awareness } = provider
    const update = () => {
      setUsers(
        Array.from(awareness.getStates().values())
          .map((s) => ({ name: (s as ActiveUser).name, color: (s as ActiveUser).color }))
          .filter((u) => u.name)
      )
    }
    awareness.on('update', update)
    update()
    return () => awareness.off('update', update)
  }, [provider])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[10px] border border-border bg-card"
    >
      <LexicalCollaboration>
        <LexicalComposer initialConfig={initialConfig}>
          <LinkEditProvider>
          <ToolbarPlugin minimal collab />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={PLACEHOLDER}
                  placeholder={<div className="editor-placeholder">{PLACEHOLDER}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <CollaborationPlugin
              id="lexical/itsdatta-collab"
              providerFactory={providerFactory}
              shouldBootstrap={false}
              username={NAME}
              cursorColor={COLOR}
              cursorsContainerRef={containerRef}
            />
            <ListPlugin />
          </div>
          <PresenceBar self={NAME} selfColor={COLOR} users={users} />
        </LinkEditProvider>
        </LexicalComposer>
      </LexicalCollaboration>
    </div>
  )
}

function PresenceBar({
  self,
  selfColor,
  users,
}: {
  self: string
  selfColor: string
  users: ActiveUser[]
}) {
  // Always show "self" first, then any remote collaborators (dedup by name).
  const remote = users.filter((u) => u.name !== self)
  const all = [{ name: self, color: selfColor }, ...remote]
  return (
    <div className="flex items-center gap-2 border-t border-border bg-code px-3 py-2 text-xs text-muted-foreground">
      <span className="font-semibold tracking-wide uppercase">Live</span>
      {all.map((u, i) => (
        <span key={u.name + i} className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: u.color }} />
          <span className="text-foreground">{u.name}</span>
          {u.name === self ? <span className="text-muted-foreground">(you)</span> : null}
        </span>
      ))}
    </div>
  )
}
