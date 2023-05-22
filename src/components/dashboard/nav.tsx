'use client'

import { Columns, Logout, Settings } from '#/icons'
import { Avatar, AvatarImage, AvatarFallback } from '#/ui/avatar'
import { buttonVariants } from '#/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/ui/dropdownMenu'
import { useSupabase } from '@/hooks/useSupabase'
import { cn, projectSegments, teamSegments } from '@/utils/helpers'
import Link from 'next/link'
import { useParams, useSelectedLayoutSegments } from 'next/navigation'

export function NavTabs() {
  const allSelectedSegments = useSelectedLayoutSegments()
  const { teamSlug, projectSlug } = useParams()

  const segments = projectSlug ? projectSegments : teamSegments
  const activeSegment =
    allSelectedSegments.find((segment) => segments.some((s) => s.slug === segment)) ||
    segments[0].slug

  return (
    <div className='sticky top-0 z-40 flex w-auto items-center space-x-2 border-b bg-background px-4 transition-all duration-150'>
      {segments.map(({ name, slug }, index) => {
        const isActive = activeSegment === slug

        return (
          <div
            key={index}
            className={cn(isActive && 'border-b border-primary')}
          >
            <Link
              href={projectSlug ? `/${teamSlug}/${projectSlug}/${slug}` : `/${teamSlug}/${slug}`}
              className={cn(
                buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                }),
                'mb-1 mt-1',
              )}
            >
              {name}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export function UserAccountNav({
  name,
  email,
  avatar,
}: {
  name: string
  email: string
  avatar: string
}) {
  const { supabase } = useSupabase()
  const { teamSlug } = useParams()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={avatar}
            alt={name}
          />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {name && <p className='font-medium'>{name}</p>}
            {email && <p className='w-[200px] truncate text-sm text-muted-foreground'>{email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        {teamSegments.map((segment, index) => (
          <Link
            key={segment.slug}
            href={index === 0 ? `/${teamSlug}` : `/${teamSlug}/${segment.slug}`}
          >
            <DropdownMenuItem className='cursor-pointer'>
              {(index === 1 && <Settings className='mr-2 h-4 w-4' />) || (
                <Columns className='mr-2 h-4 w-4' />
              )}
              {segment.name}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            supabase.auth.signOut()
          }}
        >
          <Logout className='mr-2 h-4 w-4' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
