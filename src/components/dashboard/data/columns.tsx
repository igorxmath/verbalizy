'use client'

import { DataTableColumnHeader } from '#/dashboard/data/dataTableHeader'
import { Badge } from '#/ui/badge'
import type { Document, DocumentStatus } from '@/types/general.types'
import { timeSince } from '@/utils/helpers'
import { cn } from '@/utils/merge'
import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { DocOperations } from './docOperator'

export const statuses: { value: DocumentStatus; label: string; color: string }[] = [
  {
    value: 'ready',
    label: 'Ready',
    color: 'bg-blue-600',
  },
  {
    value: 'trained',
    label: 'Trained',
    color: 'bg-green-600',
  },
  {
    value: 'error',
    label: 'Error',
    color: 'bg-red-600',
  },
]

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title='Name'
        />
      )
    },
    cell: ({ row }) => {
      const document = row.original

      return (
        <Link
          href={`/editor/${document.id}`}
          className='text-primary underline-offset-4 hover:underline'
        >
          {document.name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title='Status'
        />
      )
    },
    cell: ({ row }) => {
      const document = row.original

      const status = statuses.find((status) => status.value === document.status)

      if (!status) {
        return null
      }

      return (
        <Badge variant={'outline'}>
          <span className={cn('mr-2 h-2 w-2 rounded-full', status.color)}></span> {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title='Updated'
          className='hidden sm:block'
        />
      )
    },
    cell: ({ row }) => {
      const document = row.original

      return <p className='hidden sm:block'>{timeSince(document.updated_at)}</p>
    },
    invertSorting: true,
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const document = row.original

      return (
        <div className='text-right'>
          <DocOperations docId={document.id} />
        </div>
      )
    },
  },
]
