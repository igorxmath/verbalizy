import { env } from '@/env.mjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { hashToken, randomBytes } from '@/utils/hash'
import { getURL } from '@/utils/helpers'
import { emailSchema, teamRouteContextSchema } from '@/utils/validation'
import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import * as z from 'zod'

export const revalidate = 0

async function sendInvite(
  request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    const json = await request.json()
    const { email } = emailSchema.parse(json)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    const { data: hasInvite } = await supabaseAdmin
      .from('invites')
      .select('id')
      .match({ email, team_id: teamId })
      .limit(1)
      .maybeSingle()

    if (hasInvite) {
      return NextResponse.json({ error: 'User already have a invite' }, { status: 500 })
    }

    const { data: isAlreadyMember } = await supabaseAdmin
      .from('memberships')
      .select('id')
      .match({ team_id: teamId, user_id: user.id })
      .limit(1)
      .maybeSingle()

    if (isAlreadyMember) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 500 })
    }

    const token = randomBytes(32).toString('hex')

    const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14
    const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000).toISOString()

    const { error: inviteError } = await supabase.from('invites').insert({
      email,
      token: hashToken(token),
      expires,
      team_id: teamId,
      user_id: user.id,
    })

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }

    const params = new URLSearchParams({
      teamId,
      email,
      token,
    })

    const url = `${getURL()}invites?${params}`

    const resend = new Resend(env.RESEND_SECRET)

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Hello World',
      html: `Link: <p>${url}</p> <a href="${url}" target="_blank"><button>Click</button></a>`,
    })

    return NextResponse.json({ status: 'ok', url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { sendInvite as POST }
