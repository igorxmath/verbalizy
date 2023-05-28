'use client'

import { Spinner, Trash } from '#/icons'
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
import { Button } from '#/ui/button'
import { FieldSet } from '#/ui/fieldset'
import { Input } from '#/ui/input'
import { Label } from '#/ui/label'
import { Switch } from '#/ui/switch'
import { Form, FormField, FormItem, FormControl, FormMessage } from '#/ui/form'
import { useToast } from '@/hooks/useToast'
import { Team } from '@/types/general.types'
import { slugSchema, teamSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

type SlugFormData = z.infer<typeof slugSchema>

export function TeamSlugForm({
  title,
  description,
  team,
}: {
  title: string
  description: string
  team: Team
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<SlugFormData>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug: team.slug },
  })

  const { toast } = useToast()
  const { refresh, push } = useRouter()

  const handleChangeTeamSlug = async (formData: SlugFormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${team.id}`, {
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

    const { teamSlug } = await res.json()

    toast({ description: 'Team slug changed!' })
    push(`/${teamSlug}`)
    refresh()
  }

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>{title}</FieldSet.Title>
        <FieldSet.Description>{description}</FieldSet.Description>
      </FieldSet.Header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleChangeTeamSlug)}
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

type NameFormData = z.infer<typeof teamSchema>

export function TeamNameForm({ team }: { team: Team }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NameFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: team.name },
  })

  const { toast } = useToast()
  const { refresh } = useRouter()

  const handleChangeTeamName = async (formData: NameFormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${team.id}`, {
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

    toast({ description: 'Team name changed!' })
    refresh()
  }

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Your Team Name</FieldSet.Title>
        <FieldSet.Description>This is your URL namespace within Verbalizy.</FieldSet.Description>
      </FieldSet.Header>
      <form
        onSubmit={handleSubmit(handleChangeTeamName)}
        autoComplete='off'
      >
        <FieldSet.Content>
          <div className='sm:w-1/4'>
            <Input
              id='name'
              disabled={isLoading}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className='px-1 text-center text-xs text-red-600'>{errors.name.message}</p>
          )}
        </FieldSet.Content>
        <FieldSet.Footer>
          <Button disabled={isLoading || !isDirty}>
            {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Save
          </Button>
        </FieldSet.Footer>
      </form>
    </FieldSet>
  )
}

export function ConfirmTeamDeletion({ team }: { team: Team }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { toast } = useToast()
  const { refresh, push } = useRouter()

  const handleDeleteTeam = async () => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${team.id}`, {
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

    toast({ description: 'Team deleted!' })
    push('/dashboard')
    refresh()
  }

  return (
    <FieldSet className='border-red-600'>
      <FieldSet.Header>
        <FieldSet.Title>Team Deletion</FieldSet.Title>
        <FieldSet.Description>
          Permanently delete your team and all associated data.
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>Enter your password to confirm the team deletion.</FieldSet.Content>
      <FieldSet.Footer>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              disabled={isLoading}
            >
              {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Delete Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Deleting your team will permanently remove all
                associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault()
                  handleDeleteTeam()
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

export function ConfirmAccountDeletion({ personalTeamSlug }: { personalTeamSlug: Team['slug'] }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(!personalTeamSlug)

  return (
    <FieldSet className='border-red-600'>
      <FieldSet.Header>
        <FieldSet.Title>Account Deletion</FieldSet.Title>
        <FieldSet.Description>
          Permanently delete your account and all associated data.
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>Enter your password to confirm the account deletion.</FieldSet.Content>
      <FieldSet.Footer>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='destructive'
              disabled={isLoading}
            >
              {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault()
                  setIsLoading(true)
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

export function NotificationSwitcher() {
  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Notifications</FieldSet.Title>
        <FieldSet.Description>Manage your notification preferences.</FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>
        <div className='flex items-center space-x-2'>
          <Switch id='notifications' />
          <Label htmlFor='notifications'>Notifications</Label>
        </div>
      </FieldSet.Content>
      <FieldSet.Footer>
        <Button>Save Changes</Button>
      </FieldSet.Footer>
    </FieldSet>
  )
}
