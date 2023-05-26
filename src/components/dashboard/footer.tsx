import { GitHub } from '#/icons'
import { Button } from '#/ui/button'
import { CommandMenu } from './commandMenu'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='flex w-full items-center justify-center border-t px-4 py-2'>
      <div className='flex w-full items-center justify-start'>
        <CommandMenu />
      </div>
      <div className='flex items-center justify-start space-x-2'>
        <Button
          variant={'ghost'}
          size={'sm'}
          className='w-9 px-0'
          asChild
        >
          <Link
            href='https://github.com/igorxmath/verbalizy'
            target='_blank'
          >
            <GitHub className='h-5 w-5' />
          </Link>
        </Button>
      </div>
    </footer>
  )
}
