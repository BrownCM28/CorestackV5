import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const metadata: Metadata = {
  title: 'Privacy Policy — Corestack',
  description:
    'How Corestack collects, uses, shares, and protects personal information on corestackjobs.com.',
}

export default function PrivacyPage() {
  const content = readFileSync(
    path.join(process.cwd(), 'content/legal/privacy-policy.md'),
    'utf8'
  )

  return (
    <div
      className="px-6 py-10"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="prose prose-sm max-w-none
            prose-headings:font-bold prose-headings:text-black prose-headings:uppercase prose-headings:tracking-tight
            prose-h1:mb-2
            prose-h2:text-base prose-h2:mt-10 prose-h3:text-sm
            prose-p:text-black/75 prose-p:leading-relaxed
            prose-li:text-black/75 prose-li:leading-relaxed
            prose-ul:my-4 prose-ol:my-4
            prose-a:text-[#3ecf8e] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black prose-strong:font-semibold
            prose-hr:border-black/10
            prose-th:text-left prose-td:align-top"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
