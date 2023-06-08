import { Skeleton } from '#/ui/skeleton'
import { cn } from '@/utils/merge'

type FieldSetProps = React.HTMLAttributes<HTMLDivElement>

export function FieldSet({ className, ...props }: FieldSetProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-fieldset text-fieldset-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

type FieldSetHeaderProps = React.HTMLAttributes<HTMLDivElement>

FieldSet.Header = function FieldSetHeader({ className, ...props }: FieldSetHeaderProps) {
  return (
    <div
      className={cn('grid gap-1 p-6', className)}
      {...props}
    />
  )
}

type FieldSetTitleProps = React.HTMLAttributes<HTMLHeadingElement>

FieldSet.Title = function FieldSetTitle({ className, ...props }: FieldSetTitleProps) {
  return (
    <h4
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

type FieldSetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

FieldSet.Description = function FieldSetDescription({
  className,
  ...props
}: FieldSetDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

type FieldSetContentProps = React.HTMLAttributes<HTMLDivElement>

FieldSet.Content = function FieldSetContent({ className, ...props }: FieldSetContentProps) {
  return (
    <div
      className={cn('px-6 pb-4', className)}
      {...props}
    />
  )
}

type FieldSetFooterProps = React.HTMLAttributes<HTMLDivElement>

FieldSet.Footer = function FieldSetFooter({ className, ...props }: FieldSetFooterProps) {
  return (
    <div
      className={cn('border-t bg-secondary px-6 py-4', className)}
      {...props}
    />
  )
}

FieldSet.Skeleton = function FieldSetSeleton({ className }: FieldSetProps) {
  return (
    <FieldSet className={cn('shadow-md', className)}>
      <FieldSet.Header className='gap-2'>
        <Skeleton className='h-5 w-1/5' />
        <Skeleton className='h-4 w-4/5' />
      </FieldSet.Header>
      <FieldSet.Content className='h-10'>
        <Skeleton className='h-5 w-1/5' />
      </FieldSet.Content>
      <FieldSet.Footer>
        <Skeleton className='h-8 w-[120px] bg-primary' />
      </FieldSet.Footer>
    </FieldSet>
  )
}
