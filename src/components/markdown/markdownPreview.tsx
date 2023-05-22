import { CodeBlock } from '@/components/markdown/codeBlock'
import ReactMarkdown from 'react-markdown'

export default function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className='prose'>
      <ReactMarkdown
        components={{
          code: CodeBlock,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
