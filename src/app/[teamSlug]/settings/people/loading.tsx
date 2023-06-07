import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Skeleton } from '#/ui/skeleton'

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[40px]' />
          </div>
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-[250px]' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col space-y-4'>
          <Skeleton className='h-4 w-full' />
          <div className='flex space-x-2'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[250px]' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
