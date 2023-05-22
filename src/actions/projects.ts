'use server'

import { supabaseServer } from '@/lib/supabaseHandler'
import { Project, Team } from '@/types/general.types'
import { getAvailableProjectSlug, slugify } from '@/utils/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProject(name: Project['name'], teamSlug: Team['slug']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  if (!team) {
    return
  }

  const candidateSlug = slugify(name)
  const projectSlug = await getAvailableProjectSlug(team.id, candidateSlug)

  const { error: projectError } = await supabase.from('projects').insert({
    name,
    slug: projectSlug,
    updated_at: new Date().toISOString(),
    team_id: team.id,
    created_by: session.user.id,
  })

  if (projectError) {
    return
  }

  revalidatePath(`/${teamSlug}`)
  redirect(`${teamSlug}/${projectSlug}`)
}

export async function changeProjectNameAndSlug(
  name: Project['name'],
  teamSlug: Team['slug'],
  project: Project,
) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const candidateSlug = slugify(name)
  const projectSlug = await getAvailableProjectSlug(project.team_id, candidateSlug)

  const { error: projectError } = await supabase
    .from('projects')
    .update({ name, slug: projectSlug, updated_at: new Date().toISOString() })
    .eq('id', project.id)
    .single()

  if (projectError) {
    return
  }

  revalidatePath(`/${teamSlug}`)
  redirect(`/${teamSlug}/${projectSlug}/settings`)
}

export async function deleteProject(projectId: Project['id'], teamSlug: Team['slug']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId)

  if (projectError) {
    return
  }

  revalidatePath(`/${teamSlug}`)
  redirect(`/${teamSlug}`)
}
