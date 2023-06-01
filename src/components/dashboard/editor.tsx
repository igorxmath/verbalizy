'use client'

import { Check, ChevronLeft, Markdown, Spinner } from '#/icons'
import { Button } from '#/ui/button'
import { Toggle } from '#/ui/toggle'
import { Textarea } from '#/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { Document } from '@/types/general.types'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const MarkdownPreview = React.lazy(() => import('@/components/markdown/markdownPreview'))

export default function Editor({ document }: { document: Document }) {
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean | null>(null)
  const [preview, setPreview] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>(document.content)

  const { toast } = useToast()
  const { refresh, back } = useRouter()

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, preview])

  React.useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [timer])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsLoading(true)
    const newContent = event.target.value
    setValue(newContent)

    if (timer) {
      clearTimeout(timer)
    }

    const newTimer = setTimeout(async () => {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: document.name, content: newContent }),
      })
      if (!response.ok) {
        return toast({
          title: 'Something went wrong.',
          description: 'Your document was not updated. Please try again.',
          variant: 'destructive',
        })
      }
      setIsLoading(false)
      refresh()
    }, 2000)
    setTimer(newTimer)
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between p-2'>
        <Button
          variant={'ghost'}
          onClick={() => back()}
          className='p-2'
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Back
        </Button>

        <div className='flex items-center space-x-2'>
          {isLoading !== null && (
            <div className='flex h-6 items-center px-[5px]'>
              {isLoading ? <Spinner className='w-4 animate-spin' /> : <Check className='h-4 w-4' />}
            </div>
          )}
          <Toggle
            id='preview'
            aria-label='Toggle preview'
            pressed={preview}
            onPressedChange={() => {
              setPreview(!preview)
            }}
          >
            <Markdown className='h-6 w-6' />
          </Toggle>
        </div>
      </div>
      <div className='h-full space-y-2 p-2 md:container'>
        {preview ? (
          <React.Suspense fallback={<Spinner className='w-4 animate-spin' />}>
            <MarkdownPreview
              markdown={document.content}
              className='px-3 py-2'
            />
          </React.Suspense>
        ) : (
          <Textarea
            ref={textareaRef}
            className='box-border h-full w-full resize-none rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder='Content goes here'
            value={value}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  )
}
