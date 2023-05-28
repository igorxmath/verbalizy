import { supabaseRoute } from '@/lib/supabaseHandler'
import { projectSchema } from '@/utils/validation'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

const projectRouteContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

async function editProjectName(
  request: NextRequest,
  context: z.infer<typeof projectRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { projectId },
    } = projectRouteContextSchema.parse(context)

    const json = await request.json()
    const { name } = projectSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: projectError } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', projectId)

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

async function deleteProject(
  _request: NextRequest,
  context: z.infer<typeof projectRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { projectId },
    } = projectRouteContextSchema.parse(context)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId)

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { deleteProject as DELETE, editProjectName as PATCH }
