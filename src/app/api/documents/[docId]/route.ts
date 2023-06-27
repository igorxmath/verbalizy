import { supabaseRoute } from '@/lib/supabaseHandler'
import { documentRouteContextSchema, documentSchema } from '@/utils/validation'
import { NextResponse, type NextRequest } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

async function editDocument(
  request: NextRequest,
  context: z.infer<typeof documentRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { docId },
    } = documentRouteContextSchema.parse(context)

    const json = await request.json()
    const body = documentSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('documents')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', docId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

async function deleteDocument(
  _request: NextRequest,
  context: z.infer<typeof documentRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { docId },
    } = documentRouteContextSchema.parse(context)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('documents').delete().eq('id', docId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { deleteDocument as DELETE, editDocument as PATCH }
