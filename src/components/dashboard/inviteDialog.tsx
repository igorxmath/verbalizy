'use client'

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/ui/form'
import { Input } from '#/ui/input'
import { useToast } from '@/hooks/useToast'
import type { Team } from '@/types/general.types'
import { emailSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

type FormData = z.infer<typeof emailSchema>

export default function NewInviteDialog({ teamId }: { teamId: Team['id'] }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<FormData>({ resolver: zodResolver(emailSchema) })

  const { toast } = useToast()
  const { refresh } = useRouter()

  const handleNewProject = async (formData: FormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/${teamId}/invites`, {
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

    setIsLoading(false)
    setIsOpen(false)

    toast({
      description: 'Invite sent',
    })

    refresh()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          size={'sm'}
          onClick={() => setIsOpen(true)}
        >
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Invite a teammate to join your project. Invitations will be valid for 14 days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNewProject)}
            autoComplete='off'
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='acme@inc.com'
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
                <span>Send invite</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
