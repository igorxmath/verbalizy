'use server'

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseServer } from '@/lib/supabaseHandler'
import { Team } from '@/types/general.types'
import { getAvailableTeamSlug, isTeamSlugAvailable, slugify } from '@/utils/slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addTeam(name: Team['name']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const candidateSlug = slugify(name)
  const slug = await getAvailableTeamSlug(candidateSlug)

  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .insert([
      {
        name,
        slug,
        created_by: session.user.id,
      },
    ])
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    return
  }

  if (!team) {
    return
  }

  const { count: membershipCount } = await supabaseAdmin
    .from('memberships')
    .select('id', { count: 'exact' })
    .match({ user_id: session.user.id, team_id: team.id, type: 'admin' })

  if (membershipCount === 0) {
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert([{ user_id: session.user.id, team_id: team.id, type: 'admin' }])

    if (membershipError) {
      return
    }
  }

  redirect(`/${slug}`)
}

export async function changeTeamSlug(candidateSlug: Team['slug'], teamSlug: Team['slug']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const newSlug = slugify(candidateSlug)
  const isNewSlugAvailable = await isTeamSlugAvailable(newSlug)

  if (!isNewSlugAvailable) {
    return
  }

  const { error } = await supabase.from('teams').update({ slug: newSlug }).eq('slug', teamSlug)

  if (error) {
    return
  }

  redirect(`/${newSlug}/settings`)
}

export async function changeTeamName(name: Team['name'], teamSlug: Team['slug']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const { error } = await supabase.from('teams').update({ name }).eq('slug', teamSlug)

  if (error) {
    return
  }

  revalidatePath(`/${teamSlug}/settings`)
}

export async function deleteTeam(team: Team) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  if (team.is_personal) {
    return
  }

  const { error: membershipsError } = await supabase
    .from('memberships')
    .delete()
    .eq('team_id', team.id)

  if (membershipsError) {
    return
  }

  const { error: teamError } = await supabaseAdmin.from('teams').delete().eq('id', team.id)

  if (teamError) {
    return
  }

  revalidatePath('/')
  redirect('/dashboard')
}
