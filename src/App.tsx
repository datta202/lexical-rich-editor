import { useEffect } from 'react'
import { Editor } from '@/components/lexical/Editor'

// Embedded (in an iframe on itsdatta.com) when ?embed is present — then we drop
// the page header so it doesn't duplicate the host page's title. ?minimal trims
// the editor to a basic teaching demo (used inside the blog post).
const params = new URLSearchParams(window.location.search)
const isEmbedded = params.has('embed')
const isMinimal = params.has('minimal')

function App() {
  // Live theme sync from the host: it postMessages on light/dark toggle.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'set-theme') {
        document.documentElement.classList.toggle('dark', e.data.theme === 'dark')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (isEmbedded) {
    // Fill the iframe with no surrounding chrome/padding.
    return <Editor minimal={isMinimal} />
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-heading">Lexical Rich Editor</h1>
        <p className="mt-1 text-prose-muted">
          A rich-text editor built on{' '}
          <a
            href="https://lexical.dev"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-primary-hover"
          >
            Lexical
          </a>
          , grown one feature at a time.
        </p>
      </header>
      <Editor />
    </main>
  )
}

export default App
