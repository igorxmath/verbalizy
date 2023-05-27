import { supabaseRoute } from '@/lib/supabaseHandler'
import { getAvailableProjectSlug, slugify } from '@/utils/slugify'
import { projectSchema } from '@/utils/validation'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

const teamRouteContextSchema = z.object({
  params: z.object({
    teamId: z.string(),
  }),
})

async function addProject(
  request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    const json = await request.json()
    const { name } = projectSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidateSlug = slugify(name)
    const projectSlug = await getAvailableProjectSlug(teamId, candidateSlug)

    const { error: projectError } = await supabase.from('projects').insert({
      name,
      slug: projectSlug,
      updated_at: new Date().toISOString(),
      team_id: teamId,
      created_by: session.user.id,
    })

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok', projectSlug })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { addProject as POST }
