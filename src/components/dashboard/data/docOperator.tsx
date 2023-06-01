'use client'

import { Spinner, Trash, EllipsisVertical, Pen, Brain } from '#/icons'
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
import type { Document } from '@/types/general.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export function DocOperations({ docId }: { docId: Document['id'] }) {
  const [showEmbeddingDialog, setShowEmbeddingDialog] = React.useState<boolean>(false)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { refresh } = useRouter()
  const { toast } = useToast()

  const handleGenerateEmbeddings = async () => {
    setIsLoading(true)

    const response = await fetch(`/api/documents/${docId}/chat`, { method: 'POST' })

    if (!response.ok) {
      setIsLoading(false)
      setShowEmbeddingDialog(false)
      return toast({
        title: 'Something went wrong.',
        description: 'Your embedding was not created. Please try again.',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
    setShowEmbeddingDialog(false)
    toast({
      title: 'Success',
      description: 'Your embedding was created',
    })
  }

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
    setShowDeleteAlert(false)

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
          <DropdownMenuItem
            className='flex w-full'
            onSelect={() => setShowEmbeddingDialog(true)}
          >
            <Brain className='mr-2 h-4 w-4' />
            Train
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
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
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
      <AlertDialog
        open={showEmbeddingDialog}
        onOpenChange={setShowEmbeddingDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>generate embeddings</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                handleGenerateEmbeddings()
              }}
            >
              {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
