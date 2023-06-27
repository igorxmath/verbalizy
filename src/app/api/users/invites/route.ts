import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { hashToken } from '@/utils/hash'
import { getURL } from '@/utils/helpers'
import { NextResponse, type NextRequest } from 'next/server'

async function validateInvite(request: NextRequest): Promise<NextResponse> {
  const { teamId, email, token } = await request.json()

  if (!teamId || !email || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const hashedToken = hashToken(token)

  const { data: invites, error: inviteError } = await supabaseAdmin
    .from('invites')
    .select('id, user_id, expires')
    .eq('team_id', teamId)
    .eq('email', email)
    .eq('token', hashedToken)
    .single()

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  const { id: inviteId, user_id, expires } = invites
  const currentTime = new Date()

  if (new Date(expires) < currentTime) {
    return NextResponse.json({ error: 'Invite expired' }, { status: 403 })
  }

  const { error: membershipError } = await supabaseAdmin.from('memberships').insert({
    team_id: teamId,
    user_id,
    type: 'admin',
  })

  if (membershipError) {
    return NextResponse.json({ error: membershipError.message }, { status: 500 })
  }

  const { error: deleteError } = await supabaseAdmin.from('invites').delete().eq('id', inviteId)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  const supabase = supabaseRoute()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(`${getURL()}/auth?next=/invite?${teamId}`)
  }

  return NextResponse.json({ status: 'ok' })
}

export { validateInvite as POST }
