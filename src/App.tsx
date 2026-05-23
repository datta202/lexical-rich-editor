import { Editor } from '@/components/lexical/Editor'

function App() {
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
