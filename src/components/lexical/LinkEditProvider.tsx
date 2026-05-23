import { useState, type ReactNode } from 'react'
import { LinkEditContext } from './linkEdit'

/**
 * Shares the "currently editing a link" flag between the toolbar (which opens
 * the editor when you click the link button) and the floating link editor.
 */
export function LinkEditProvider({ children }: { children: ReactNode }) {
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)
  return (
    <LinkEditContext.Provider value={{ isLinkEditMode, setIsLinkEditMode }}>
      {children}
    </LinkEditContext.Provider>
  )
}
