'use client'

import { FieldSet } from '#/ui/fieldset'
import { Form, FormField, FormItem, FormControl, FormMessage } from '#/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/ui/alertDialog'
import { Input } from '#/ui/input'
import { Button } from '#/ui/button'
import { Project } from '@/types/general.types'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Trash, Spinner } from '#/icons'
import { useToast } from '@/hooks/useToast'
import { projectSchema } from '@/utils/validation'
import { changeProjectNameAndSlug, deleteProject } from '@/actions/projects'
import { useParams } from 'next/navigation'

type NameFormData = z.infer<typeof projectSchema>

export function ProjectNameForm({ project }: { project: Project }) {
  const [isPending, startTransition] = React.useTransition()

  const { toast } = useToast()
  const { teamSlug } = useParams()

  const form = useForm<NameFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: project.name },
  })

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Edit your project name</FieldSet.Title>
        <FieldSet.Description>
          Make changes to your project here. Click save when you{"'"}re done.
        </FieldSet.Description>
      </FieldSet.Header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ name }) =>
            startTransition(() =>
              changeProjectNameAndSlug(name, teamSlug, project).finally(() => {
                toast({ description: 'Project name changed' })
              }),
            ),
          )}
          autoComplete='off'
        >
          <FieldSet.Content>
            <div className='sm:w-1/4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldSet.Content>
          <FieldSet.Footer>
            <Button disabled={isPending || !form.formState.isDirty}>
              {isPending && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Save
            </Button>
          </FieldSet.Footer>
        </form>
      </Form>
    </FieldSet>
  )
}

export function ConfirmProjectDeletion({ project }: { project: Project }) {
  const [isPending, startTransition] = React.useTransition()

  const { teamSlug } = useParams()

  return (
    <FieldSet className='border-red-600'>
      <FieldSet.Header>
        <FieldSet.Title>Project Deletion</FieldSet.Title>
        <FieldSet.Description>
          Permanently delete your account and all associated data.
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>Enter your password to confirm the account deletion.</FieldSet.Content>
      <FieldSet.Footer>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>Delete Project</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your project and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={async (event) => {
                  event.preventDefault()
                  startTransition(() => deleteProject(project.id, teamSlug))
                }}
              >
                {isPending ? (
                  <Spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Trash className='mr-2 h-4 w-4' />
                )}
                <span>Delete</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </FieldSet.Footer>
    </FieldSet>
  )
}
