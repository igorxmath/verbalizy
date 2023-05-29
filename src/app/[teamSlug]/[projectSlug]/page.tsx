import { columns } from '@/components/dashboard/data/columns'
import { DataTable } from '@/components/dashboard/data/dataTable'
import { DocSheet } from '@/components/dashboard/docSheet'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Project({
  params: { teamSlug, projectSlug },
}: {
  params: { teamSlug: string; projectSlug: string }
}) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .match({ team_id: team?.id, slug: projectSlug })
    .single()

  if (!project) {
    notFound()
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', project.id)

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <div className='flex w-full flex-col'>
      <div className='border-b'>
        <div className='max-auto container flex flex-col justify-between space-y-4 px-4 py-8 sm:flex-row sm:space-y-0'>
          <h1 className='font-heading text-3xl md:text-4xl'>Documents</h1>
          <div className='flex space-x-4'>
            <DocSheet projectId={project.id} />
          </div>
        </div>
      </div>
      <div className='container mx-auto p-4'>
        <DataTable
          columns={columns}
          data={documents}
        />
      </div>
    </div>
  )
}
