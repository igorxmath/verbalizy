'use client'

import { Button } from '#/ui/button'
import { cn } from '@/utils/helpers'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type AsideNavProps = {
  segments: { slug: string; name: string }[]
  path: string
}

export default function AsideNav({ segments, path }: AsideNavProps) {
  const segment = useSelectedLayoutSegment()

  return (
    <aside className='mb-4 w-full flex-col sm:mr-4 md:flex md:w-[400px]'>
      <div className='flex sm:flex-col sm:space-y-2'>
        {segments.map(({ name, slug }, index) => {
          const isActive = (index == 0 && !segment) || segment === slug

          return (
            <Link
              href={`/${path}/settings/${slug}`}
              className='sm:w-full'
              key={index}
            >
              <Button
                variant={`ghost`}
                className={cn('sm:w-full sm:justify-start', isActive && 'font-bold')}
              >
                {name}
              </Button>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
