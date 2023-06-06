import { FieldSet } from '#/ui/fieldset'
import { StripeCheckoutButton } from '@/components/dashboard/teamSettingsFields'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Billing({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  return (
    <FieldSet>
      <FieldSet.Header>
        <FieldSet.Title>Pro Plan Subscription</FieldSet.Title>
        <FieldSet.Description>
          Set up your subscription to unlock premium features and access exclusive content.
        </FieldSet.Description>
      </FieldSet.Header>
      <FieldSet.Content>
        Enter your payment details and select your subscription plan.
      </FieldSet.Content>
      <FieldSet.Footer>
        <StripeCheckoutButton teamId={team.id} />
      </FieldSet.Footer>
    </FieldSet>
  )
}
