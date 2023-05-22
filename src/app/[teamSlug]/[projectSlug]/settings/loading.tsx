import { FieldSet } from '#/ui/fieldset'
import { cn } from '@/utils/helpers'

export default function Loading() {
  return (
    <>
      {[...Array(2)].map((_, i) => (
        <FieldSet.Skeleton
          key={i}
          className={cn(i === 1 && 'border-red-600')}
        />
      ))}
    </>
  )
}
