'use client'

import { Spinner } from '#/icons'
import { Button } from '#/ui/button'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export default function InviteButton({
  ...props
}: {
  email: string
  token: string
  teamId: string
  slug: string
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const { refresh, push } = useRouter()

  const handleAcceptInvite = async () => {
    setIsLoading(true)

    const res = await fetch('/api/users/invites', {
      method: 'POST',
      body: JSON.stringify({ ...props }),
    })

    if (!res.ok) {
      setIsLoading(false)
      const { error } = await res.json()
      setMessage(error)
      return
    }

    setIsLoading(false)

    refresh()
    push(`/${props.slug}` as Route)
  }

  return (
    <div className='flex w-full flex-col space-y-4'>
      {message && <p className='text-sm text-destructive'>{message}</p>}
      <Button
        className='w-full'
        onClick={handleAcceptInvite}
      >
        {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Accept
      </Button>
    </div>
  )
}
