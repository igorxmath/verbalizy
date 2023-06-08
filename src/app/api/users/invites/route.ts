import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { hashToken } from '@/utils/hash'

async function validateInvite(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const email = searchParams.get('email')
  const token = searchParams.get('token')

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

  return NextResponse.json({ status: 'ok' })
}

export { validateInvite as GET }
