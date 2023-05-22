'use client'

import { SlidersHorizontal } from '#/icons'
import { Button } from '#/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/ui/dropdownMenu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Table } from '@tanstack/react-table'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          className='ml-auto hidden lg:flex'
        >
          <SlidersHorizontal className='mr-2 h-5 w-5' />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[150px]'
      >
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id.replace('_', ' ')}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
