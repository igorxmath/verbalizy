import { GitHub } from '#/icons'
import { buttonVariants } from '#/ui/button'
import { CommandMenu } from './commandMenu'
import { cn } from '@/utils/helpers'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='flex w-full items-center justify-center border-t px-4 py-2'>
      <div className='flex w-full items-center justify-start'>
        <CommandMenu />
      </div>
      <div className='flex items-center justify-start space-x-2'>
        <Link
          href='https://github.com/igorxmath/verbalizy'
          target='_blank'
        >
          <div
            className={cn(
              buttonVariants({
                size: 'sm',
                variant: 'ghost',
              }),
              'w-9 px-0',
            )}
          >
            <GitHub className='h-5 w-5' />
          </div>
        </Link>
      </div>
    </footer>
  )
}
