import { supabaseRoute } from '@/lib/supabaseHandler'
import { documentSchema, projectRouteContextSchema } from '@/utils/validation'
import { NextResponse, type NextRequest } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

async function addDocument(
  request: NextRequest,
  context: z.infer<typeof projectRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { projectId },
    } = projectRouteContextSchema.parse(context)

    const json = await request.json()
    const { name, content } = documentSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        name,
        content,
        status: 'ready',
        project_id: projectId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok', docId: document.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { addDocument as POST }
