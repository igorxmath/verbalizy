import { Card, CardFooter, CardHeader, CardTitle } from '#/ui/card'
import { Skeleton } from '#/ui/skeleton'

export default function Loading() {
  return (
    <div className='w-full bg-secondary'>
      <div className='container mx-auto grow space-y-4 p-4'>
        <Skeleton className='h-8 w-full bg-background' />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className='h-4 w-[250px]' />
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Skeleton className='h-4 w-[250px]' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
