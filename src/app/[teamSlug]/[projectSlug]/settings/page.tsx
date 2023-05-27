import {
  ConfirmProjectDeletion,
  ProjectSlugForm,
} from '@/components/dashboard/projectSettingsFields'
import { supabaseServer } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Page({
  params: { teamSlug, projectSlug },
}: {
  params: { teamSlug: string; projectSlug: string }
}) {
  const supabase = supabaseServer()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .match({ team_id: team?.id, slug: projectSlug })
    .single()

  if (!project) {
    return notFound()
  }

  return (
    <>
      <ProjectSlugForm project={project} />
      <ConfirmProjectDeletion project={project} />
    </>
  )
}
