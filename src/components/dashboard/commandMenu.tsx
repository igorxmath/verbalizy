'use client'

import { Columns, Computer, Moon, Settings, Sun } from '#/icons'
import { Button } from '#/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/ui/command'
import { cn, teamSegments } from '@/utils/helpers'
import type { DialogProps } from '@radix-ui/react-alert-dialog'
import { useTheme } from 'next-themes'
import { useParams, useRouter } from 'next/navigation'
import * as React from 'react'

type CommandMenuProps = DialogProps

export function CommandMenu({ ...props }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)

  const { push } = useRouter()
  const { teamSlug } = useParams()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant='outline'
        className={cn(
          'relative h-9 justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-36',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className='inline-flex'>Command...</span>
        <kbd className='pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Links'>
            {teamSegments.map((segment, index) => (
              <CommandItem
                key={index}
                onSelect={() => runCommand(() => push(`/${teamSlug}/${segment.slug}`))}
              >
                {(index === 1 && <Settings className='mr-2 h-4 w-4' />) || (
                  <Columns className='mr-2 h-4 w-4' />
                )}
                {segment.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun className='mr-2 h-4 w-4' />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='mr-2 h-4 w-4' />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Computer className='mr-2 h-4 w-4' />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
