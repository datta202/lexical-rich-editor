import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement } from '@lexical/utils'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import { $createEquationNode, EquationNode } from './EquationNode'
import { INSERT_EQUATION_COMMAND, type InsertEquationPayload } from './equationCommand'

/** Registers the command that inserts a KaTeX equation node. */
export function EquationsPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error('EquationsPlugin: EquationNode not registered on editor')
    }
    return editor.registerCommand<InsertEquationPayload>(
      INSERT_EQUATION_COMMAND,
      ({ equation, inline }) => {
        const node = $createEquationNode(equation, inline)
        $insertNodes([node])
        if ($isRootOrShadowRoot(node.getParentOrThrow())) {
          $wrapNodeInElement(node, $createParagraphNode).selectEnd()
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
