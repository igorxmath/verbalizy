import { Button } from '#/ui/button'
import { FieldSet } from '#/ui/fieldset'

export default function Page() {
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
        <Button>Subscribe</Button>
      </FieldSet.Footer>
    </FieldSet>
  )
}
