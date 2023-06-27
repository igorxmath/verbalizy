'use client'

import { Plus, Spinner } from '#/icons'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/ui/form'
import { Input } from '#/ui/input'
import { useToast } from '@/hooks/useToast'
import type { Team } from '@/types/general.types'
import { projectSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

type FormData = z.infer<typeof projectSchema>

export default function NewProjectDialog({
  teamSlug,
  teamId,
}: {
  teamSlug: Team['slug']
  teamId: Team['id']
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<FormData>({ resolver: zodResolver(projectSchema) })

  const { toast } = useToast()
  const { push, refresh } = useRouter()

  const handleNewProject = async (formData: FormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${teamId}/project`, {
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

    const { projectSlug } = await res.json()

    setIsLoading(false)

    push(`/${teamSlug}/${projectSlug}`)
    refresh()
  }

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
            onSubmit={form.handleSubmit(handleNewProject)}
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
                disabled={isLoading}
              >
                {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
                <span>Continue</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
