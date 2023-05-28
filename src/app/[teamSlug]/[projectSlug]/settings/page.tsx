import {
  ConfirmProjectDeletion,
  ProjectSlugForm,
} from '@/components/dashboard/projectSettingsFields'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export default async function Page({
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

  return (
    <>
      <ProjectSlugForm project={project} />
      <ConfirmProjectDeletion project={project} />
    </>
  )
}
