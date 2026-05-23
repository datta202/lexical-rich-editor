import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Use the main app's styles (Tailwind + theme tokens + .editor-input) so the
// collaborative editor matches the Rich-Text Editor exactly.
import '../index.css'
import { CollabEditor } from './CollabEditor'

// Theme: apply ?theme=dark before paint, and track the host's live toggle.
if (new URLSearchParams(window.location.search).get('theme') === 'dark') {
  document.documentElement.classList.add('dark')
}
window.addEventListener('message', (e) => {
  if (e.data?.type === 'set-theme') {
    document.documentElement.classList.toggle('dark', e.data.theme === 'dark')
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="mx-auto max-w-3xl p-4">
      <CollabEditor />
    </main>
  </StrictMode>
)
