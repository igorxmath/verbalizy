import { CodeBlock } from '@/components/markdown/codeBlock'
import { cn } from '@/utils/merge'
import ReactMarkdown from 'react-markdown'

export default function MarkdownPreview({
  markdown,
  className,
}: {
  markdown: string
  className?: string
}) {
  return (
    <div className={cn('prose', className)}>
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
