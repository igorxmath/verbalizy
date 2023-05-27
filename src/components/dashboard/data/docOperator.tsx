'use client'

import { Spinner, Trash, EllipsisVertical, Pen } from '#/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/ui/alertDialog'
import { Button } from '#/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/ui/dropdownMenu'
import { useToast } from '@/hooks/useToast'
import { Document } from '@/types/general.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function DocOperations({ docId }: { docId: Document['id'] }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { refresh } = useRouter()
  const { toast } = useToast()

  const handleDeleteDoc = async () => {
    setIsLoading(true)

    const res = await fetch(`/api/documents/${docId}`, {
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

    toast({ description: 'Document deleted' })
    refresh()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'secondary'}
            size={'sm'}
            className='h-8 px-2'
          >
            <EllipsisVertical className='h-4 w-4' />
            <span className='sr-only'>Open</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem>
            <Link
              href={`/editor/${docId}`}
              className='flex w-full'
            >
              <Pen className='mr-2 h-4 w-4' />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='flex cursor-pointer items-center text-destructive focus:text-destructive'
            onSelect={() => setShowDeleteAlert(true)}
          >
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteDoc()
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
    </>
  )
}
