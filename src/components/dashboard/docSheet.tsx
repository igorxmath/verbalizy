'use client'

import { Spinner } from '#/icons'
import { Button } from '#/ui/button'
import { Input } from '#/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/ui/sheet'
import { Textarea } from '#/ui/textarea'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '#/ui/form'
import { documentSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useToast } from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types/general.types'
import type { Route } from 'next'

type FormData = z.infer<typeof documentSchema>

export function DocSheet({ projectId }: { projectId: Project['id'] }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<FormData>({ resolver: zodResolver(documentSchema) })

  const { toast } = useToast()
  const { push, refresh } = useRouter()

  const handleNewDoc = async (formData: FormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/projects/${projectId}/document`, {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      setIsLoading(false)
      return toast({
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }

    const { docId } = await res.json()

    setIsLoading(false)

    push(`/editor/${docId}` as Route)
    refresh()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>New doc</Button>
      </SheetTrigger>
      <SheetContent
        position='right'
        size='content'
      >
        <SheetHeader>
          <SheetTitle>A title to your document</SheetTitle>
          <SheetDescription>
            Make changes to your document here. Click save when {`you're`} done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNewDoc)}
            autoComplete='off'
          >
            <div className='space-y-4 py-2 pb-4'>
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Acme inc.'
                          aria-autocomplete='none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Your content here...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  variant={'secondary'}
                  className='mt-2 sm:mt-0'
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type='submit'
                disabled={isLoading}
              >
                {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
                <span>Save changes</span>
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
