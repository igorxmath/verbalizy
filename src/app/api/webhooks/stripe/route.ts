import { env } from '@/env.mjs'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'

async function stripeWebhooks(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const signature = request.headers.get('Stripe-Signature') as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return NextResponse.json({ error }, { status: 501 })
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    if (!checkoutSession.customer) {
      return NextResponse.json({ error: 'Invalid costumer' }, { status: 502 })
    }

    const teamId = checkoutSession.client_reference_id

    const { error } = await supabaseAdmin
      .from('teams')
      .update({
        stripe_customer_id: checkoutSession.customer.toString(),
      })
      .eq('id', teamId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
  } else if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const newPriceId = subscription.items.data[0].price.id
    const stripeSubscriptionId = subscription.items.data[0].subscription
    const stripeCustomerId = subscription.customer.toString()

    const { error } = await supabaseAdmin
      .from('teams')
      .update({
        stripe_price_id: newPriceId,
        stripe_subscription_id: stripeSubscriptionId,
        billing_cycle_start: new Date().toISOString(),
      })
      .eq('stripe_customer_id', stripeCustomerId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 504 })
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const stripeCustomerId = subscription.customer.toString()

    const { error } = await supabaseAdmin
      .from('teams')
      .update({
        stripe_customer_id: null,
        stripe_price_id: null,
        stripe_subscription_id: null,
        billing_cycle_start: null,
      })
      .eq('stripe_customer_id', stripeCustomerId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 505 })
    }
  } else {
    return NextResponse.json({ error: 'No event is found' }, { status: 506 })
  }

  return NextResponse.json({ status: 'ok' })
}

export { stripeWebhooks as POST }
