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
import { changeTeamName, changeTeamSlug, deleteTeam } from '@/actions/teams'
import { deleteUser } from '@/actions/users'
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
  const [isPending, startTransition] = React.useTransition()

  const { toast } = useToast()

  const form = useForm<SlugFormData>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug: team.slug },
  })

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>{title}</FieldSet.Title>
        <FieldSet.Description>{description}</FieldSet.Description>
      </FieldSet.Header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ slug }) =>
            startTransition(() =>
              changeTeamSlug(slug, team.slug).finally(() => {
                toast({ description: 'Team slug changed' })
              }),
            ),
          )}
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

type NameFormData = z.infer<typeof teamSchema>

export function TeamNameForm({ team }: { team: Team }) {
  const [isPending, startTransition] = React.useTransition()

  const { refresh } = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<NameFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: team.name },
  })

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Your Team Name</FieldSet.Title>
        <FieldSet.Description>This is your URL namespace within Verbalizy.</FieldSet.Description>
      </FieldSet.Header>
      <form
        onSubmit={handleSubmit(({ name }) =>
          startTransition(() =>
            changeTeamName(name, team.slug).finally(() => {
              refresh()
              toast({ description: 'Team name changed' })
            }),
          ),
        )}
        autoComplete='off'
      >
        <FieldSet.Content>
          <div className='sm:w-1/4'>
            <Input
              id='name'
              disabled={isPending}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className='px-1 text-center text-xs text-red-600'>{errors.name.message}</p>
          )}
        </FieldSet.Content>
        <FieldSet.Footer>
          <Button disabled={isPending || !isDirty}>
            {isPending && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Save
          </Button>
        </FieldSet.Footer>
      </form>
    </FieldSet>
  )
}

export function ConfirmTeamDeletion({ team }: { team: Team }) {
  const [isPending, startTransition] = React.useTransition()

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
            <Button variant='destructive'>
              {isPending && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Delete Team
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
                onClick={() =>
                  startTransition(() => {
                    deleteTeam(team)
                  })
                }
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

export function ConfirmAccountDeletion({ personalTeamSlug }: { personalTeamSlug: Team['slug'] }) {
  const [isPending, startTransition] = React.useTransition()

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
            <Button variant='destructive'>Delete Account</Button>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  startTransition(() => {
                    deleteUser(personalTeamSlug)
                  })
                }
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
