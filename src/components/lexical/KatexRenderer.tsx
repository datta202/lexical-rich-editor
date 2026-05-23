import { useEffect, useRef } from 'react'
import katex from 'katex'

/** Renders a LaTeX string with KaTeX into a span. */
export function KatexRenderer({
  equation,
  inline,
}: {
  equation: string
  inline: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    katex.render(equation, el, {
      displayMode: !inline,
      throwOnError: false,
      output: 'html',
      strict: 'warn',
    })
  }, [equation, inline])

  return <span ref={ref} />
}
