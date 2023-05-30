'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '#/ui/hoverCard'
import { Slider } from '#/ui/slider'
import { FormLabel } from '#/ui/form'
import { type SliderProps } from '@radix-ui/react-slider'

interface MaxLengthSelectorProps {
  defaultValue: SliderProps['defaultValue']
  onChange: SliderProps['onValueChange']
}

export function MaxLengthSelector({ defaultValue, onChange }: MaxLengthSelectorProps) {
  return (
    <div className='grid gap-2 pt-2'>
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <FormLabel htmlFor='maxLengthSelector'>Max tokens</FormLabel>
              <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                {defaultValue}
              </span>
            </div>
            <Slider
              id='maxLengthSelector'
              max={4000}
              defaultValue={defaultValue}
              step={10}
              onValueChange={onChange}
              className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
              aria-label='Maximum Length'
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align='start'
          className='w-[260px] text-sm'
          side='right'
        >
          The maximum number of tokens to generate. Requests can use up to 2,048 or 4,000 tokens,
          shared between prompt and completion. The exact limit varies by model.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
