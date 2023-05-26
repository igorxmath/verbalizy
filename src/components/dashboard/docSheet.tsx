'use client'

import { Spinner } from '#/icons'
import { Button } from '#/ui/button'
import { Input } from '#/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/ui/sheet'
import { Textarea } from '#/ui/textarea'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '#/ui/form'
import { addDocument } from '@/actions/documents'
import { documentSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

type FormData = z.infer<typeof documentSchema>

export function DocSheet({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<FormData>({ resolver: zodResolver(documentSchema) })

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
            onSubmit={form.handleSubmit((props) =>
              startTransition(() => addDocument({ ...props }, projectId)),
            )}
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
              <Button
                type='submit'
                disabled={isPending}
              >
                {isPending && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
                <span>Save changes</span>
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
