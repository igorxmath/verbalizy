import { Clock } from '#/icons'
import { Badge } from '#/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/ui/card'
import NewProjectDialog from '@/components/dashboard/projectDialog'
import SearchBar from '@/components/dashboard/searchBar'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { timeSince } from '@/utils/helpers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function OverviewPage({
  params: { teamSlug },
  searchParams,
}: {
  params: { teamSlug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { search } = searchParams || {}

  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  const projectsQuery = supabase.from('projects').select('*').eq('team_id', team.id)

  if (search) {
    projectsQuery.textSearch('name', `'${search}'`, { type: 'websearch', config: 'english' })
  }

  const { data, error } = await projectsQuery

  if (error) {
    return <p>Something went wrong</p>
  }

  const projects = data.map((item) => {
    return {
      ...item,
      updated_at: timeSince(item.updated_at),
    }
  })

  if (!projects.length && !search) {
    return (
      <div className='w-full bg-secondary'>
        <div className='container mx-auto grow space-y-4 p-4'>
          <Card className='text-center'>
            <CardHeader>
              <CardTitle>No projects found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center space-y-4'>
                <Image
                  src={'/illustrations/undraw-searching.svg'}
                  alt='undraw-searching'
                  width={400}
                  height={400}
                  className='mx-auto'
                />
                <NewProjectDialog
                  teamSlug={teamSlug}
                  teamId={team.id}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full bg-secondary'>
      <div className='container mx-auto grow space-y-4 p-4'>
        <div className='flex space-x-2'>
          <SearchBar />
          <NewProjectDialog
            teamSlug={teamSlug}
            teamId={team.id}
          />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`${teamSlug}/${project.slug}`}
            >
              <Card className='transition-all hover:shadow-md dark:hover:border-primary/50'>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardFooter className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    {project.updated_at && (
                      <>
                        <Clock className='mr-1 h-5 w-5' />
                        <p className='text-sm'>{project.updated_at}</p>
                      </>
                    )}
                  </div>
                  <div className='flex items-center'>
                    {project ? (
                      <Badge variant={'outline'}>
                        <span className='mr-1 h-2 w-2 rounded-full bg-green-500'></span>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant={'outline'}>
                        <span className='mr-1 h-2 w-2 rounded-full bg-red-500'></span>
                        Inactive
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
