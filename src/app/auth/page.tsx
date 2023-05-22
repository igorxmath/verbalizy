'use client'

import { ChevronLeft, GitHub, Google, Spinner } from '#/icons'
import { Button, buttonVariants } from '#/ui/button'
import { useSupabase } from '@/hooks/useSupabase'
import { getURL, cn } from '@/utils/helpers'
import Link from 'next/link'
import React, { useState } from 'react'

export default function LoginPage() {
  return (
    <div className='flex min-h-screen w-screen flex-col items-center justify-center'>
      <Link
        href='/'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8',
        )}
      >
        <ChevronLeft className='mr-2 h-4 w-4' />
        Back
      </Link>
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

function UserAuthForm() {
  const { supabase } = useSupabase()

  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleLoginWithGitHub = async () => {
    setIsGitHubLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${getURL()}/dashboard`,
      },
    })
    if (error) {
      setIsGitHubLoading(false)
    }
  }

  const handleLoginWithGoogle = async () => {
    setIsGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getURL()}/dashboard`,
      },
    })
    if (error) {
      setIsGoogleLoading(false)
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
          disabled={isGitHubLoading}
          onClick={handleLoginWithGitHub}
        >
          {isGitHubLoading ? (
            <Spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <GitHub className='mr-2 h-4 w-4' />
          )}{' '}
          Github
        </Button>
        <Button
          type='button'
          variant={'outline'}
          disabled={isGoogleLoading}
          onClick={handleLoginWithGoogle}
        >
          {isGoogleLoading ? (
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
