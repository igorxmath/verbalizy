import { Button } from '#/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/ui/card'
import Link from 'next/link'

const features = [
  {
    name: 'Feature 1',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    name: 'Feature 2',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    name: 'Feature 3',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    name: 'Feature 4',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
]

export default async function HomePage() {
  return (
    <div className='mx-auto max-w-7xl space-y-8 px-4 py-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <h1 className='text-center text-3xl font-extrabold sm:text-5xl'>
          <span className='block'>The best way to</span>
          <span className='block text-primary'>create documentation</span>
        </h1>
        <p className='text-center text-xl'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam
          fugiat.
        </p>
        <div className='flex items-center justify-center space-x-4'>
          <Link href='/auth'>
            <Button>Get Started</Button>
          </Link>
          <Link href='#pricing'>
            <Button variant={'secondary'}>Learn More</Button>
          </Link>
        </div>
      </div>
      <div className='mx-auto space-y-4'>
        <h2 className='text-center text-2xl font-extrabold sm:text-4xl'>Features</h2>
        <div className='flex items-center justify-center'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {features.map((feature) => (
              <Card
                key={feature.description}
                className='transition-all hover:shadow-md dark:hover:border-primary/50'
              >
                <CardHeader>
                  <CardTitle>Feature 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='line-clamp-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate
                    laboriosam fugiat.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div
        className='mx-auto space-y-4'
        id='pricing'
      >
        <h2 className='text-center text-2xl font-extrabold sm:text-4xl'>Pricing Plans</h2>
        <p className='mt-4 text-center text-xl'>
          Start building for free, then add a site plan to go live.
        </p>
        <div className='flex items-center justify-center'></div>
      </div>
    </div>
  )
}
