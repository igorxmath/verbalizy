import { stripe } from '@/lib/stripe'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

export const revalidate = 0

const teamRouteContextSchema = z.object({
  params: z.object({
    teamId: z.string(),
  }),
})

const redirectSchema = z.object({
  redirect: z.string(),
})

async function createStripeCheckoutSession(
  request: NextRequest,
  context: z.infer<typeof teamRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { teamId },
    } = teamRouteContextSchema.parse(context)

    const json = await request.json()
    const { redirect } = redirectSchema.parse(json)

    console.log(redirect)

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: redirect,
      cancel_url: redirect,
      customer_email: session.user.email,
      line_items: [{ price: 'price_1MyfoMG7j3KoFtfTjvyYhplE', quantity: 1 }],
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      mode: 'subscription',
      client_reference_id: teamId,
      metadata: { userId: session.user.id, teamId },
    })

    return NextResponse.json({ status: 'ok', url: stripeSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { createStripeCheckoutSession as POST }
