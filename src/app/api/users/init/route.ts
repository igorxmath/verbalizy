import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { getURL } from '@/utils/helpers'
import { generateRandomSlug, getAvailableTeamSlug, slugFromEmail, slugify } from '@/utils/slugify'
import { NextResponse } from 'next/server'

export const revalidate = 0

async function initPersonalTeam(): Promise<NextResponse> {
  const supabase = supabaseRoute()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: hasTeam } = await supabase
    .from('teams')
    .select('id, slug')
    .match({ created_by: user.id, is_personal: true })
    .limit(1)
    .select()
    .maybeSingle()

  if (hasTeam) {
    return NextResponse.redirect(new URL(hasTeam.slug, getURL()))
  }

  let candidateSlug = ''
  if (user.user_metadata.user_name) {
    candidateSlug = slugify(user.user_metadata.user_name)
  } else if (user.user_metadata.name) {
    candidateSlug = slugify(user.user_metadata.name)
  } else if (user.email) {
    candidateSlug = slugFromEmail(user.email)
  } else {
    candidateSlug = generateRandomSlug()
  }

  const slug = await getAvailableTeamSlug(candidateSlug)

  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .insert([
      {
        name: 'Personal',
        is_personal: true,
        slug,
        created_by: user.id,
      },
    ])
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!team) {
    return NextResponse.json({ error: 'Unable to create a team' }, { status: 400 })
  }

  const { count: membershipCount } = await supabaseAdmin
    .from('memberships')
    .select('id', { count: 'exact' })
    .match({ user_id: user.id, team_id: team.id, type: 'admin' })

  if (membershipCount === 0) {
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert([{ user_id: user.id, team_id: team.id, type: 'admin' }])

    if (membershipError) {
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }
  }

  return NextResponse.redirect(new URL(slug, getURL()))
}

export { initPersonalTeam as GET }
