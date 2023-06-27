'use client'

import { ChevronLeft, GitHub, Google, Spinner } from '#/icons'
import { Button } from '#/ui/button'
import { useToast } from '@/hooks/useToast'
import { supabaseClient } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

export default function LoginPage() {
  return (
    <div className='flex min-h-screen w-screen flex-col items-center justify-center'>
      <Button
        variant={'ghost'}
        className='absolute left-4 top-4 md:left-8 md:top-8'
        asChild
      >
        <Link href='/'>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Back
        </Link>
      </Button>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
          <p className='text-sm'>Enter your email to sign in to your account</p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  )
}

type Providers = 'google' | 'github'

function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<Providers | null>(null)

  const { toast } = useToast()

  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  const supabase = supabaseClient()

  const handleLogin = async (provider: Providers) => {
    setIsLoading(provider)
    const redirectTo = `${location.origin}/auth/callback${next ? '?next=' + next : ''}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })
    if (error) {
      setIsLoading(null)
      toast({
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={'grid gap-6 p-4 sm:p-0'}>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div>
      <div className='flex flex-col space-y-4'>
        <Button
          type='button'
          variant={'outline'}
          disabled={isLoading === 'github'}
          onClick={() => handleLogin('github')}
        >
          {isLoading === 'github' ? (
            <Spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <GitHub className='mr-2 h-4 w-4' />
          )}{' '}
          Github
        </Button>
        <Button
          type='button'
          variant={'outline'}
          disabled={isLoading === 'google'}
          onClick={() => handleLogin('google')}
        >
          {isLoading === 'google' ? (
            <Spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Google className='mr-2 h-4 w-4' />
          )}{' '}
          Google
        </Button>
      </div>
    </div>
  )
}
