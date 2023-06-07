import { FieldSet } from '#/ui/fieldset'
import { StripeCheckoutButton } from '@/components/dashboard/teamSettingsFields'
import { stripe } from '@/lib/stripe'
import { getTeamSubscriptionPlan } from '@/lib/subscription'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function Billing({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('*').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  const { isPremium } = await getTeamSubscriptionPlan(team)

  let isCanceled = false
  let currentPeriodEnd = 0
  if (isPremium && team.stripe_subscription_id) {
    const stripePlan = await stripe.subscriptions.retrieve(team.stripe_subscription_id)
    isCanceled = stripePlan.cancel_at_period_end
    currentPeriodEnd = stripePlan.current_period_end * 1000
  }

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Pro Plan Subscription</FieldSet.Title>
        <FieldSet.Description>
          {isPremium
            ? `You are already subscribed to the Pro plan. Enjoy premium features and access exclusive content.`
            : 'Set up your subscription to unlock premium features and access exclusive content.'}
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>
        {isPremium && (
          <p>
            {isCanceled ? 'Your plan will be canceled on ' : 'Your plan renews on '}
            {formatDate(currentPeriodEnd)}.
          </p>
        )}
      </FieldSet.Content>
      <FieldSet.Footer>
        <StripeCheckoutButton
          teamId={team.id}
          isPremium={isPremium as boolean}
        />
      </FieldSet.Footer>
    </FieldSet>
  )
}
