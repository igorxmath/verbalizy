'use client'

import { Slider } from '#/ui/slider'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '#/ui/hoverCard'
import { FormLabel } from '@/components/ui/form'
import { type SliderProps } from '@radix-ui/react-slider'

interface TemperatureSelectorProps {
  defaultValue: SliderProps['defaultValue']
  onChange: SliderProps['onValueChange']
}

export function TemperatureSelector({ defaultValue, onChange }: TemperatureSelectorProps) {
  return (
    <div className='grid gap-2 pt-2'>
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <FormLabel htmlFor='tempSelector'>Temperature</FormLabel>
              <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                {defaultValue}
              </span>
            </div>
            <Slider
              id='tempSelector'
              max={1}
              defaultValue={defaultValue}
              step={0.1}
              onValueChange={onChange}
              className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
              aria-label='Temperature'
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align='start'
          className='w-[260px] text-sm'
          side='right'
        >
          Controls randomness: lowering results in less random completions. As the temperature
          approaches zero, the model will become deterministic and repetitive.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
