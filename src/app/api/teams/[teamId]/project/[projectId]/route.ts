import { supabaseRoute } from '@/lib/supabaseHandler'
import { getAvailableProjectSlug, slugify } from '@/utils/slugify'
import { slugSchema } from '@/utils/validation'
import { NextResponse, type NextRequest } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

const teamProjectRouteContextSchema = z.object({
  params: z.object({
    teamId: z.string(),
    projectId: z.string(),
  }),
})

async function editProjectSlug(
  request: NextRequest,
  context: z.infer<typeof teamProjectRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId, projectId },
    } = teamProjectRouteContextSchema.parse(context)

    const json = await request.json()
    const { slug } = slugSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const candidateSlug = slugify(slug)
    const projectSlug = await getAvailableProjectSlug(teamId, candidateSlug)

    const { error: projectError } = await supabase
      .from('projects')
      .update({ slug: projectSlug, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .single()

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

export { editProjectSlug as PUT }
