import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { isTeamSlugAvailable, slugify } from '@/utils/slugify'
import { slugSchema, teamSchema } from '@/utils/validation'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

const teamRouteContextSchema = z.object({
  params: z.object({
    teamId: z.string(),
  }),
})

async function editTeamName(
  request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    const json = await request.json()
    const { name } = teamSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: teamError } = await supabase.from('teams').update({ name }).eq('id', teamId)

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

async function editTeamSlug(
  request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    const json = await request.json()
    const { slug: candidateSlug } = slugSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const teamSlug = slugify(candidateSlug)
    const isNewSlugAvailable = await isTeamSlugAvailable(teamSlug)

    if (!isNewSlugAvailable) {
      return NextResponse.json({ error: 'You alreay have team with slug' }, { status: 400 })
    }

    const { error: teamError } = await supabase
      .from('teams')
      .update({ slug: teamSlug })
      .eq('id', teamId)

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok', teamSlug })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

async function deleteTeam(
  _request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    console.log(teamId)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: membershipsError } = await supabase
      .from('memberships')
      .delete()
      .eq('team_id', teamId)

    if (membershipsError) {
      return NextResponse.json({ error: membershipsError.message }, { status: 500 })
    }

    const { error: teamError } = await supabaseAdmin.from('teams').delete().eq('id', teamId)

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { deleteTeam as DELETE, editTeamName as PATCH, editTeamSlug as PUT }
