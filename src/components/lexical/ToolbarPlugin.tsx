import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister, $getNearestNodeOfType, $findMatchingParent } from '@lexical/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  type ElementFormatType,
  type TextFormatType,
} from 'lexical'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list'
import { $createCodeNode } from '@lexical/code'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { INSERT_IMAGE_COMMAND } from './imageCommand'
import { INSERT_EQUATION_COMMAND } from './equationCommand'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ListChecks,
  SquareCode,
  Minus,
  Table as TableIcon,
  Image as ImageIcon,
  Sigma,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLinkEdit } from './linkEdit'

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      // Keep the editor selection while clicking a toolbar button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-[6px] text-muted-foreground transition-colors',
        'hover:bg-secondary hover:text-foreground',
        'disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground',
        active && 'bg-secondary text-primary'
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px self-center bg-input" />
}

const ICON = 16

export function ToolbarPlugin({
  minimal = false,
  collab = false,
}: {
  minimal?: boolean
  // Under collaboration there's no HistoryPlugin, so hide undo/redo.
  collab?: boolean
}) {
  const [editor] = useLexicalComposerContext()
  const { setIsLinkEditMode } = useLinkEdit()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [blockType, setBlockType] = useState<string>('paragraph')

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    setIsBold(selection.hasFormat('bold'))
    setIsItalic(selection.hasFormat('italic'))
    setIsUnderline(selection.hasFormat('underline'))
    setIsStrikethrough(selection.hasFormat('strikethrough'))
    setIsCode(selection.hasFormat('code'))

    const anchorNode = selection.anchor.getNode()
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchorNode, ListNode)
      setBlockType(parentList ? parentList.getListType() : element.getListType())
    } else if ($isHeadingNode(element)) {
      setBlockType(element.getTag())
    } else {
      setBlockType(element.getType())
    }

    const linkParent = $findMatchingParent(anchorNode, $isLinkNode)
    setIsLink(linkParent !== null || $isLinkNode(anchorNode))
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read($updateToolbar)
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, $updateToolbar])

  const formatText = (format: TextFormatType) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)

  const formatAlign = (align: ElementFormatType) =>
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)

  const insertLink = () => {
    // Create a placeholder link if there isn't one, then open the editor.
    if (!isLink) editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    setIsLinkEditMode(true)
  }

  const toggleHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType === tag ? $createParagraphNode() : $createHeadingNode(tag)
        )
      }
    })
  }

  const toggleQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType === 'quote' ? $createParagraphNode() : $createQuoteNode()
        )
      }
    })
  }

  const toggleBulletList = () =>
    editor.dispatchCommand(
      blockType === 'bullet' ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
      undefined
    )

  const toggleNumberedList = () =>
    editor.dispatchCommand(
      blockType === 'number' ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
      undefined
    )

  const toggleCheckList = () =>
    editor.dispatchCommand(
      blockType === 'check' ? REMOVE_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND,
      undefined
    )

  const toggleCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType === 'code' ? $createParagraphNode() : $createCodeNode()
        )
      }
    })
  }

  const insertHorizontalRule = () =>
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)

  const insertTable = () =>
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: '3',
      rows: '3',
      includeHeaders: true,
    })

  const insertImage = () => {
    const src = window.prompt('Image URL')?.trim()
    if (src) editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: '' })
  }

  const insertEquation = () => {
    const equation = window.prompt('LaTeX, e.g. \\frac{a}{b}')?.trim()
    if (equation) editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline: true })
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-code px-2 py-1.5">
      {!collab && (
        <>
          <ToolbarButton label="Undo" disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
            <Undo2 size={ICON} />
          </ToolbarButton>
          <ToolbarButton label="Redo" disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
            <Redo2 size={ICON} />
          </ToolbarButton>

          <Divider />
        </>
      )}

      <ToolbarButton label="Bold" active={isBold} onClick={() => formatText('bold')}>
        <Bold size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={isItalic} onClick={() => formatText('italic')}>
        <Italic size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Underline" active={isUnderline} onClick={() => formatText('underline')}>
        <Underline size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={isStrikethrough} onClick={() => formatText('strikethrough')}>
        <Strikethrough size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Inline code" active={isCode} onClick={() => formatText('code')}>
        <Code size={ICON} />
      </ToolbarButton>
      {!minimal && (
        <ToolbarButton label="Insert link" active={isLink} onClick={insertLink}>
          <LinkIcon size={ICON} />
        </ToolbarButton>
      )}

      <Divider />

      <ToolbarButton label="Heading 1" active={blockType === 'h1'} onClick={() => toggleHeading('h1')}>
        <Heading1 size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={blockType === 'h2'} onClick={() => toggleHeading('h2')}>
        <Heading2 size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={blockType === 'quote'} onClick={toggleQuote}>
        <Quote size={ICON} />
      </ToolbarButton>
      {!minimal && (
        <ToolbarButton label="Code block" active={blockType === 'code'} onClick={toggleCodeBlock}>
          <SquareCode size={ICON} />
        </ToolbarButton>
      )}

      <Divider />

      <ToolbarButton label="Bullet list" active={blockType === 'bullet'} onClick={toggleBulletList}>
        <List size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={blockType === 'number'} onClick={toggleNumberedList}>
        <ListOrdered size={ICON} />
      </ToolbarButton>
      {!minimal && (
        <ToolbarButton label="Check list" active={blockType === 'check'} onClick={toggleCheckList}>
          <ListChecks size={ICON} />
        </ToolbarButton>
      )}

      <Divider />

      <ToolbarButton label="Align left" onClick={() => formatAlign('left')}>
        <AlignLeft size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Align center" onClick={() => formatAlign('center')}>
        <AlignCenter size={ICON} />
      </ToolbarButton>
      <ToolbarButton label="Align right" onClick={() => formatAlign('right')}>
        <AlignRight size={ICON} />
      </ToolbarButton>

      {!minimal && (
        <>
          <Divider />

          <ToolbarButton label="Horizontal rule" onClick={insertHorizontalRule}>
            <Minus size={ICON} />
          </ToolbarButton>
          <ToolbarButton label="Insert table" onClick={insertTable}>
            <TableIcon size={ICON} />
          </ToolbarButton>
          <ToolbarButton label="Insert image" onClick={insertImage}>
            <ImageIcon size={ICON} />
          </ToolbarButton>
          <ToolbarButton label="Insert equation" onClick={insertEquation}>
            <Sigma size={ICON} />
          </ToolbarButton>
        </>
      )}
    </div>
  )
}
