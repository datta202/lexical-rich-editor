import { DecoratorNode } from 'lexical'
import type {
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import type { ReactNode } from 'react'
import { KatexRenderer } from './KatexRenderer'

export type SerializedEquationNode = Spread<
  { equation: string; inline: boolean },
  SerializedLexicalNode
>

/** A decorator node that renders a KaTeX equation. */
export class EquationNode extends DecoratorNode<ReactNode> {
  __equation: string
  __inline: boolean

  static getType(): string {
    return 'equation'
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  static importJSON(serialized: SerializedEquationNode): EquationNode {
    return $createEquationNode(serialized.equation, serialized.inline)
  }

  constructor(equation: string, inline = true, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline
  }

  exportJSON(): SerializedEquationNode {
    return {
      ...super.exportJSON(),
      equation: this.__equation,
      inline: this.__inline,
    }
  }

  createDOM(): HTMLElement {
    const el = document.createElement(this.__inline ? 'span' : 'div')
    el.className = 'editor-equation'
    return el
  }

  updateDOM(prevNode: this): boolean {
    // Recreate the element if inline/block changed (span vs div).
    return prevNode.__inline !== this.__inline
  }

  decorate(): ReactNode {
    return <KatexRenderer equation={this.__equation} inline={this.__inline} />
  }
}

export function $createEquationNode(equation: string, inline = true): EquationNode {
  return new EquationNode(equation, inline)
}

export function $isEquationNode(
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node instanceof EquationNode
}
