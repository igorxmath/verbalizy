import { Check, Copy } from '#/icons'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  vscDarkPlus as DarkStyle,
  vs as LightStyle,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

const CopyButton = ({ code }: { code: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (
    <button
      onClick={() => copyToClipboard(code)}
      className='absolute -right-2.5 -top-1.5 shadow-white transition-all duration-300 hover:scale-105'
      disabled={isCopied}
    >
      {isCopied ? <Check /> : <Copy />}
    </button>
  )
}

export interface CodeProps {
  inline?: boolean
  className?: string
  children: React.ReactNode
  [key: string]: unknown
}

export const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const { theme } = useTheme()

  const match = /language-(\w+)/.exec(className || '') || ['', 'js']
  const code = String(children).replace(/\n$/, '')

  if (!inline && match) {
    return (
      <div style={{ position: 'relative' }}>
        <CopyButton code={code} />
        <SyntaxHighlighter
          style={theme === 'light' ? LightStyle : DarkStyle}
          customStyle={{
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          language={match[1]}
          wrapLongLines={true}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )
  } else {
    return <code>{children}</code>
  }
}
