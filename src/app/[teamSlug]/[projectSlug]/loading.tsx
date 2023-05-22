import { Skeleton } from '#/ui/skeleton'

export default function Loading() {
  return (
    <div className='flex w-full flex-col space-y-2'>
      <div className='border-b'>
        <div className='max-auto container flex flex-col justify-between space-y-4 px-4 py-8 sm:flex-row sm:space-y-0'>
          <h1 className='font-heading text-3xl md:text-4xl'>
            <Skeleton className='h-4 w-[250px]' />
          </h1>
        </div>
      </div>
      <div className='container mx-auto p-4'>
        <div className='w-full space-y-4'>
          <div className='divide-y divide-border rounded-md border bg-background'>
            {[...Array(6)].map((_, i) => (
              <div
                className='flex items-center justify-between p-4'
                key={i}
              >
                <div className='grid gap-1'>
                  <Skeleton className='h-4 w-[250px]' />
                  <div>
                    <Skeleton className='h-4 w-[250px]' />
                  </div>
                  <div>
                    <Skeleton className='h-4 w-[250px]' />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-end'>
            <Skeleton className='h-4 w-[100px]' />
          </div>
        </div>
      </div>
    </div>
  )
}
