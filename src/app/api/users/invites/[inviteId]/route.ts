import { supabaseRoute } from '@/lib/supabaseHandler'
import { inviteRouteContextSchema } from '@/utils/validation'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

async function deleteInvite(
  _request: NextRequest,
  context: z.infer<typeof inviteRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { inviteId },
    } = inviteRouteContextSchema.parse(context)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: inviteError } = await supabase.from('invites').delete().eq('id', inviteId)

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { deleteInvite as DELETE }
