import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type LinkEditContextValue = {
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}

export const LinkEditContext = createContext<LinkEditContextValue | null>(null)

export function useLinkEdit() {
  const ctx = useContext(LinkEditContext)
  if (!ctx) throw new Error('useLinkEdit must be used within a LinkEditProvider')
  return ctx
}
