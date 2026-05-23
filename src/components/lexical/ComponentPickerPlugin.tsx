import { useCallback, useMemo, useState, type JSX } from 'react'
import { createPortal } from 'react-dom'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type ElementNode,
  type LexicalEditor,
  type TextNode,
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  SquareCode,
  Table as TableIcon,
  Image as ImageIcon,
  Minus,
  Pilcrow,
  Sigma,
} from 'lucide-react'
import { INSERT_IMAGE_COMMAND } from './imageCommand'
import { INSERT_EQUATION_COMMAND } from './equationCommand'

class PickerOption extends MenuOption {
  title: string
  icon: JSX.Element
  keywords: string[]
  onSelect: () => void

  constructor(
    title: string,
    options: { icon: JSX.Element; keywords?: string[]; onSelect: () => void }
  ) {
    super(title)
    this.title = title
    this.icon = options.icon
    this.keywords = options.keywords ?? []
    this.onSelect = options.onSelect
  }
}

function buildOptions(editor: LexicalEditor): PickerOption[] {
  const setBlock = (creator: () => ElementNode) =>
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) $setBlocksType(selection, creator)
    })

  return [
    new PickerOption('Paragraph', {
      icon: <Pilcrow size={16} />,
      keywords: ['normal', 'text', 'p'],
      onSelect: () => setBlock(() => $createParagraphNode()),
    }),
    new PickerOption('Heading 1', {
      icon: <Heading1 size={16} />,
      keywords: ['h1', 'title'],
      onSelect: () => setBlock(() => $createHeadingNode('h1')),
    }),
    new PickerOption('Heading 2', {
      icon: <Heading2 size={16} />,
      keywords: ['h2', 'subtitle'],
      onSelect: () => setBlock(() => $createHeadingNode('h2')),
    }),
    new PickerOption('Heading 3', {
      icon: <Heading3 size={16} />,
      keywords: ['h3'],
      onSelect: () => setBlock(() => $createHeadingNode('h3')),
    }),
    new PickerOption('Bulleted list', {
      icon: <List size={16} />,
      keywords: ['unordered', 'ul', 'bullet'],
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new PickerOption('Numbered list', {
      icon: <ListOrdered size={16} />,
      keywords: ['ordered', 'ol', 'number'],
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new PickerOption('Check list', {
      icon: <ListChecks size={16} />,
      keywords: ['todo', 'checkbox', 'task'],
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new PickerOption('Quote', {
      icon: <Quote size={16} />,
      keywords: ['blockquote'],
      onSelect: () => setBlock(() => $createQuoteNode()),
    }),
    new PickerOption('Code block', {
      icon: <SquareCode size={16} />,
      keywords: ['pre', 'snippet'],
      onSelect: () => setBlock(() => $createCodeNode()),
    }),
    new PickerOption('Table', {
      icon: <TableIcon size={16} />,
      keywords: ['grid', 'rows', 'columns'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: '3',
          rows: '3',
          includeHeaders: true,
        }),
    }),
    new PickerOption('Divider', {
      icon: <Minus size={16} />,
      keywords: ['horizontal rule', 'hr', 'line'],
      onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new PickerOption('Image', {
      icon: <ImageIcon size={16} />,
      keywords: ['picture', 'photo', 'img'],
      onSelect: () => {
        const src = window.prompt('Image URL')?.trim()
        if (src) editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: '' })
      },
    }),
    new PickerOption('Equation', {
      icon: <Sigma size={16} />,
      keywords: ['math', 'latex', 'katex'],
      onSelect: () => {
        const equation = window.prompt('LaTeX, e.g. \\frac{a}{b}')?.trim()
        if (equation) editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline: true })
      },
    }),
  ]
}

/** A "/" typeahead menu for inserting blocks. */
export function ComponentPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [query, setQuery] = useState<string | null>(null)
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 })

  const options = useMemo(() => {
    const all = buildOptions(editor)
    if (!query) return all
    const q = query.toLowerCase()
    return all.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.keywords.some((k) => k.toLowerCase().includes(q))
    )
  }, [editor, query])

  const onSelectOption = useCallback(
    (
      selectedOption: PickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        nodeToRemove?.remove()
      })
      selectedOption.onSelect()
      closeMenu()
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<PickerOption>
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current && options.length
          ? createPortal(
              <ul className="z-50 max-h-72 w-56 overflow-auto rounded-[8px] border border-border bg-popover p-1 shadow-lg">
                {options.map((option, i) => (
                  <li key={option.key}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlightedIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setHighlightedIndex(i)
                        selectOptionAndCleanUp(option)
                      }}
                      className={
                        'flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-sm ' +
                        (selectedIndex === i
                          ? 'bg-secondary text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground')
                      }
                    >
                      {option.icon}
                      {option.title}
                    </button>
                  </li>
                ))}
              </ul>,
              anchorElementRef.current
            )
          : null
      }
    />
  )
}
