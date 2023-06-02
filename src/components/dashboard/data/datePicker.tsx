'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Spinner } from '#/icons'
import { cn } from '@/utils/helpers'
import { Button } from '#/ui/button'
import { Calendar } from '#/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '#/ui/popover'
import { type DayClickEventHandler } from 'react-day-picker'
import { usePathname, useRouter } from 'next/navigation'
import type { Route } from 'next'

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()
  const [isPeding, startTransition] = React.useTransition()

  const pathname = usePathname()
  const { replace } = useRouter()

  const handleDayClick: DayClickEventHandler = (day) => {
    setDate(day)

    const params = new URLSearchParams(window.location.search)

    if (day) {
      params.set('day', day.toString())
    } else {
      params.delete('day')
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}` as Route)
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'secondary'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          {!isPeding ? (
            <CalendarIcon className='mr-2 h-4 w-4' />
          ) : (
            <Spinner className='mr-2 h-4 w-4 animate-spin' />
          )}
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onDayClick={handleDayClick}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
