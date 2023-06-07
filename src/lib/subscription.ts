import type { Team } from '@/types/general.types'

export async function getTeamSubscriptionPlan(team: Team) {
  const billingCycleStartDate = new Date(team.billing_cycle_start as string)
  const currentDate = new Date()
  const differenceInMilliseconds = currentDate.getTime() - billingCycleStartDate.getTime()
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24)
  const isPremium = team.stripe_price_id && differenceInDays <= 30

  return { isPremium }
}
