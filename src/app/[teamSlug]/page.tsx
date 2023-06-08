import { Clock, Document } from '#/icons'
import { Badge } from '#/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '#/ui/avatar'
import NewProjectDialog from '#/dashboard/projectDialog'
import SearchBar from '#/dashboard/searchBar'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { timeSince } from '@/utils/helpers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Route } from 'next'

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

  const countProjectDocs = async (project_id: string) => {
    const { count } = await supabase
      .from('documents')
      .select('project_id', { count: 'exact' })
      .match({ project_id })

    return count
  }

  const projects = data.map((project) => {
    return {
      ...project,
      count: countProjectDocs(project.id),
      updated_at: timeSince(project.updated_at),
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
              href={`${teamSlug}/${project.slug}` as Route}
            >
              <Card className='transition-all hover:shadow-md dark:hover:border-primary/50'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>
                      <div className='row flex items-center'>
                        <Avatar className='mr-2 h-5 w-5'>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${project.slug}.png`}
                            alt={project.name}
                          />
                          <AvatarFallback>{project.name[0]}</AvatarFallback>
                        </Avatar>
                        {project.name}
                      </div>
                    </CardTitle>
                    <div>
                      {project ? (
                        <Badge>
                          <span className='mr-1 h-2 w-2 rounded-full bg-green-500'></span>
                          Active
                        </Badge>
                      ) : (
                        <Badge>
                          <span className='mr-1 h-2 w-2 rounded-full bg-red-500'></span>
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <div className='flex'>
                      <Document className='mr-1 h-5 w-5' />
                      <p className='text-sm'>{project.count} documents</p>
                    </div>
                    <div className='flex'>
                      <Clock className='mr-1 h-5 w-5' />
                      <p className='text-sm'>{project.updated_at}</p>
                    </div>
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
