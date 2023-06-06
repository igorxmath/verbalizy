import type { Team } from '@/types/general.types'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getTeamSubscriptionPlan(teamId: Team['id']) {
  const { data: team } = await supabaseAdmin.from('teams').select('*').eq('id', teamId).single()

  if (!team) {
    throw new Error('Team not found')
  }

  const billingCycleStartDate = new Date(team.billing_cycle_start as string)
  const currentDate = new Date()
  const differenceInMilliseconds = currentDate.getTime() - billingCycleStartDate.getTime()
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24)
  const isPro = team.stripe_price_id && differenceInDays <= 30

  return { isPro, stripeCustomerId: team.stripe_customer_id }
}
