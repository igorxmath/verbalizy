import { FieldSet } from '#/ui/fieldset'
import { StripeCheckoutButton } from '@/components/dashboard/teamSettingsFields'
import { getTeamSubscriptionPlan } from '@/lib/subscription'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Billing({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('*').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  const { isPro } = await getTeamSubscriptionPlan(team.id)

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Pro Plan Subscription</FieldSet.Title>
        <FieldSet.Description>
          {isPro
            ? `You are already subscribed to the Pro plan. Enjoy premium features and access exclusive content.`
            : 'Set up your subscription to unlock premium features and access exclusive content.'}
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>
        {isPro
          ? 'Thank you for being a Pro subscriber!'
          : 'Enter your payment details and select your subscription plan.'}
      </FieldSet.Content>
      <FieldSet.Footer>
        <StripeCheckoutButton
          teamId={team.id}
          isPro={isPro as boolean}
        />
      </FieldSet.Footer>
    </FieldSet>
  )
}
