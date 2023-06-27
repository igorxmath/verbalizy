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
import { useToast } from '@/hooks/useToast'
import type { Invite } from '@/types/general.types'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function DeleteInviteAlert({ inviteId }: { inviteId: Invite['id'] }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { toast } = useToast()
  const { refresh } = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    const res = await fetch(`/api/users/invites/${inviteId}`, { method: 'DELETE' })

    if (!res.ok) {
      setIsLoading(false)
      return toast({
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
    setShowDeleteAlert(false)
    toast({ description: 'Invite deleted' })
    refresh()
  }

  return (
    <AlertDialog
      open={showDeleteAlert}
      onOpenChange={setShowDeleteAlert}
    >
      <AlertDialogTrigger asChild>
        <Button
          size={'sm'}
          variant={'secondary'}
          disabled={isLoading}
          className='h-8 px-2'
        >
          <Trash className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action will remove invite</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
          >
            {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
