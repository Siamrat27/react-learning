import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

const PLAIN_LANGS = new Set(['text', 'plaintext', 'plain', ''])

export default function CodeBlock({ code, language = 'tsx', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const isPlain = PLAIN_LANGS.has(language)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
      {/* Title bar */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          {filename && (
            <span className="ml-2 text-xs text-slate-400 font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isPlain && (
            <span className="text-xs text-slate-500 uppercase tracking-wider">{language}</span>
          )}
          <button
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded border border-slate-600 hover:border-slate-400"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Plain text — no syntax highlighting */}
      {isPlain ? (
        <pre
          style={{
            margin: 0,
            padding: '1rem 1rem 1rem 1.25rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: '#d4d4d4',
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}
        >
          {code.trim()}
        </pre>
      ) : (
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.875rem', lineHeight: '1.6' }}
          useInlineStyles
          PreTag="div"
          CodeTag="div"
        >
          {code.trim()}
        </SyntaxHighlighter>
      )}
    </div>
  )
}
