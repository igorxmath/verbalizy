import { Divider } from '#/icons'
import { Skeleton } from '#/ui/skeleton'

export default function LoadingNav() {
  return (
    <>
      <nav className='flex flex-wrap items-center justify-between px-4 py-2'>
        <div className='flex flex-shrink-0 items-center'>
          <Skeleton className='h-9 w-24' />
        </div>
        <Divider className='h-8 w-8' />
        <div className='flex w-auto grow items-center'>
          <Skeleton className='h-9 w-48' />
        </div>
        <div className='flex items-center justify-between space-x-4'>
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
      </nav>
      <div className='sticky top-0 z-40 flex w-auto items-center space-x-2 border-b bg-background px-4 transition-all duration-150'>
        {[...Array(2)].map((_, i) => (
          <Skeleton
            key={i}
            className='mb-1 mt-1 h-9 w-20'
          />
        ))}
      </div>
    </>
  )
}
