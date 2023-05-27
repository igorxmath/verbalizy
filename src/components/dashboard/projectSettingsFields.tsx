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
import { projectSchema, slugSchema } from '@/utils/validation'
import { useParams, useRouter } from 'next/navigation'

type SlugFormData = z.infer<typeof slugSchema>

export function ProjectSlugForm({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<SlugFormData>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug: project.slug },
  })

  const { toast } = useToast()
  const { refresh, push } = useRouter()
  const { teamSlug } = useParams()

  const handleChangeProjectSlug = async (formData: SlugFormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${project.team_id}/project/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      setIsLoading(false)
      return toast({
        title: 'Something went wrong.',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }

    setIsLoading(false)

    const { projectSlug } = await res.json()

    toast({ description: 'Project slug changed!' })
    push(`/${teamSlug}/${projectSlug}/settings`)
    refresh()
  }

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Project Name</FieldSet.Title>
        <FieldSet.Description>
          Used to identify your Project on the Dashboard and in the URL of your Deployments.
        </FieldSet.Description>
      </FieldSet.Header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleChangeProjectSlug)}
          autoComplete='off'
        >
          <FieldSet.Content>
            <div className='sm:w-1/4'>
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
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
            <Button disabled={isLoading || !form.formState.isDirty}>
              {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Save
            </Button>
          </FieldSet.Footer>
        </form>
      </Form>
    </FieldSet>
  )
}

type NameFormData = z.infer<typeof projectSchema>

export function ProjectNameForm({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { toast } = useToast()
  const { refresh } = useRouter()

  const form = useForm<NameFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: project.name },
  })

  const handleEditProjectName = async (formData: NameFormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      setIsLoading(false)
      return toast({
        title: 'Something went wrong.',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }

    setIsLoading(false)

    toast({ description: 'Project name changed!' })
    refresh()
  }

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
          onSubmit={form.handleSubmit(handleEditProjectName)}
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
                        disabled={isLoading}
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
            <Button disabled={isLoading || !form.formState.isDirty}>
              {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Save
            </Button>
          </FieldSet.Footer>
        </form>
      </Form>
    </FieldSet>
  )
}

export function ConfirmProjectDeletion({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { toast } = useToast()
  const { refresh, push } = useRouter()
  const { teamSlug } = useParams()

  const handleDeleteProject = async () => {
    setIsLoading(true)

    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      setIsLoading(false)
      return toast({
        title: 'Something went wrong.',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }

    setIsLoading(false)

    toast({ description: 'Project deleted!' })
    refresh()
    push(`/${teamSlug}`)
  }

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
                disabled={isLoading}
                onClick={async (event) => {
                  event.preventDefault()
                  handleDeleteProject()
                }}
              >
                {isLoading ? (
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
