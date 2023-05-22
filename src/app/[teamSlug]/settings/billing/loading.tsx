import { FieldSet } from '#/ui/fieldset'

export default function Loading() {
  return (
    <>
      {[...Array(1)].map((_, i) => (
        <FieldSet.Skeleton key={i} />
      ))}
    </>
  )
}
