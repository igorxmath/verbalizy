'use client'

import { Search, Spinner } from '#/icons'
import { Input } from '#/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export default function SearchBar() {
  const pathname = usePathname()
  const searchParam = useSearchParams()
  const { replace } = useRouter()
  const [isPeding, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(window.location.search)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    params.delete('page')

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className='relative w-full'>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
        {!isPeding ? <Search className='h-5 w-5' /> : <Spinner className='h-4 w-4 animate-spin' />}
      </div>
      <Input
        id='search'
        className='bg-background pl-10'
        placeholder='Search...'
        defaultValue={searchParam.get('search')?.toString()}
        autoComplete='off'
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
      />
    </div>
  )
}
