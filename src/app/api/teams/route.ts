import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { getAvailableTeamSlug, slugify } from '@/utils/slugify'
import { teamSchema } from '@/utils/validation'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

async function addTeam(request: NextRequest): Promise<NextResponse> {
  try {
    const json = await request.json()
    const { name } = teamSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidateSlug = slugify(name)
    const slug = await getAvailableTeamSlug(candidateSlug)

    const { data: team, error: teamError } = await supabaseAdmin
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
      .single()

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 })
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
        return NextResponse.json({ error: membershipError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ status: 'ok', teamSlug: team.slug })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { addTeam as POST }
