import { LexicalComposer, type InitialConfigType } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical'
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { editorTheme } from './theme'
import { ToolbarPlugin } from './ToolbarPlugin'
import { StateViewerPlugin } from './StateViewerPlugin'
import { AutoLinkPlugin } from './AutoLinkPlugin'
import { FloatingLinkEditorPlugin } from './FloatingLinkEditorPlugin'
import { LinkEditProvider } from './LinkEditProvider'
import { sanitizeUrl } from './sanitizeUrl'

const PLACEHOLDER = 'Start typing — try the toolbar above…'

/** Seeds the editor with a little content so the formatting is visible on load. */
function prepopulate() {
  const root = $getRoot()
  if (root.getFirstChild() !== null) return

  const heading = $createHeadingNode('h2')
  heading.append($createTextNode('Try me ✍️'))

  const paragraph = $createParagraphNode()
  paragraph.append(
    $createTextNode('Select any text and make it '),
    $createTextNode('bold').toggleFormat('bold'),
    $createTextNode(', '),
    $createTextNode('italic').toggleFormat('italic'),
    $createTextNode(', or a list — then watch the editor state below change.')
  )

  root.append(heading, paragraph)
}

const initialConfig: InitialConfigType = {
  namespace: 'lexical-rich-editor',
  theme: editorTheme,
  onError(error) {
    throw error
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  editorState: prepopulate,
}

export function Editor() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-card">
      <LexicalComposer initialConfig={initialConfig}>
        <LinkEditProvider>
          <ToolbarPlugin />
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
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin validateUrl={(url) => sanitizeUrl(url) !== 'about:blank'} />
          <ClickableLinkPlugin />
          <AutoLinkPlugin />
          <FloatingLinkEditorPlugin />
          <StateViewerPlugin />
        </LinkEditProvider>
      </LexicalComposer>
    </div>
  )
}
