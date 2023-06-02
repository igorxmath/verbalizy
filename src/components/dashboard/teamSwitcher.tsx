'use client'

import { Check, ChevronsUpDown, PlusCircle, Spinner } from '#/icons'
import { Avatar, AvatarFallback, AvatarImage } from '#/ui/avatar'
import { Button } from '#/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/ui/dialog'
import { Input } from '#/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '#/ui/popover'
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '#/ui/form'
import { cn } from '@/utils/helpers'
import { teamSchema } from '@/utils/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import type * as z from 'zod'
import type { Route } from 'next'

type FormData = z.infer<typeof teamSchema>

type Team = { name: string; slug: string }

type Groups = {
  label: string
  teams: Team[]
}

export function TeamSwitcher({ groups, selected }: { groups: Groups[]; selected: Team }) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(selected)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { push } = useRouter()
  const { toast } = useToast()

  const form = useForm<FormData>({ resolver: zodResolver(teamSchema) })

  const handleNewTeam = async (formData: FormData) => {
    setIsLoading(true)

    const res = await fetch(`/api/teams/`, {
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

    const { teamSlug } = await res.json()

    push(`/${teamSlug}`)
  }

  return (
    <Dialog
      open={showNewTeamDialog}
      onOpenChange={setShowNewTeamDialog}
    >
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            role='combobox'
            aria-expanded={open}
            aria-label='Select a team'
            className='w-[200px] justify-between'
          >
            <Avatar className='mr-2 h-5 w-5'>
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam.slug}.png`}
                alt={selectedTeam.name}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.name}
            <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search team...' />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => {
                if (!group.teams.length) return

                return (
                  <CommandGroup
                    key={group.label}
                    heading={group.label}
                  >
                    {group.teams.map((team) => (
                      <CommandItem
                        key={team.slug}
                        onSelect={() => {
                          setSelectedTeam(team)
                          setOpen(false)
                          push(team.slug as Route)
                        }}
                        className='text-sm'
                      >
                        <Avatar className='mr-2 h-5 w-5'>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${team.slug}.png`}
                            alt={team.name}
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {team.name}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedTeam.slug === team.slug ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircle className='mr-2 h-5 w-5' />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>Add a new team to manage products and customers.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNewTeam)}
            autoComplete='off'
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Acme inc.'
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
                variant='secondary'
                disabled={isLoading}
                onClick={() => setShowNewTeamDialog(false)}
                className='mt-2 sm:mt-0'
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type='submit'
              >
                {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />}Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
