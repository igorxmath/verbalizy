'use client'

import { Plus } from '#/icons'
import { Spinner } from '#/icons'
import { Button } from '#/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/ui/dialog'
import { Input } from '#/ui/input'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '#/ui/form'
import { addProject } from '@/actions/projects'
import { projectSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

type FormData = z.infer<typeof projectSchema>

export default function NewProjectDialog({ teamSlug }: { teamSlug: string }) {
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<FormData>({ resolver: zodResolver(projectSchema) })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='sm:w-1/12'>
          <p className='hidden sm:block'>New...</p>
          <Plus className={`h-5 w-5 sm:hidden`} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Add a new project to manage products and customers.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ name }) =>
              startTransition(() => addProject(name, teamSlug)),
            )}
            autoComplete='off'
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
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
            <DialogFooter>
              <Button
                type='submit'
                disabled={isPending}
              >
                {isPending && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
                <span>Continue</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
