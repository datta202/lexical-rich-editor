import { DecoratorNode } from 'lexical'
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import type { ReactNode } from 'react'

export type SerializedImageNode = Spread<
  { src: string; altText: string; maxWidth: number },
  SerializedLexicalNode
>

/** A decorator node that renders an <img> inside the editor. */
export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string
  __altText: string
  __maxWidth: number

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.__key)
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    const { src, altText, maxWidth } = serialized
    return $createImageNode({ src, altText, maxWidth })
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (element) => {
          const img = element as HTMLImageElement
          return { node: $createImageNode({ src: img.src, altText: img.alt }) }
        },
        priority: 0,
      }),
    }
  }

  constructor(src: string, altText: string, maxWidth = 500, key?: NodeKey) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      maxWidth: this.__maxWidth,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    return { element }
  }

  createDOM(): HTMLElement {
    return document.createElement('span')
  }

  updateDOM(): false {
    return false
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): ReactNode {
    return (
      <img
        className={config.theme.image as string}
        src={this.__src}
        alt={this.__altText}
        style={{ maxWidth: this.__maxWidth }}
        draggable={false}
      />
    )
  }
}

export function $createImageNode({
  src,
  altText,
  maxWidth = 500,
}: {
  src: string
  altText: string
  maxWidth?: number
}): ImageNode {
  return new ImageNode(src, altText, maxWidth)
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
