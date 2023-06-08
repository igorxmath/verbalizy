import { FieldSet } from '#/ui/fieldset'
import { cn } from '@/utils/merge'

export default function Loading() {
  const numberOfFieldSets = 3
  return (
    <>
      {[...Array(numberOfFieldSets)].map((_, i) => (
        <FieldSet.Skeleton
          key={i}
          className={cn(i === numberOfFieldSets - 1 && 'border-red-600')}
        />
      ))}
    </>
  )
}
