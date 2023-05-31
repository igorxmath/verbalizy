'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/ui/form'
import { Slider } from '#/ui/slider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '#/ui/input'
import { Button } from '#/ui/button'
import { Textarea } from '#/ui/textarea'
import * as z from 'zod'

const chatFormSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string(),
  tempSelector: z.tuple([z.number().max(2)]),
  maxLengthSelector: z.tuple([z.number().max(4001)]),
})

type FormData = z.infer<typeof chatFormSchema>

export function ChatForm(props: FormData) {
  const form = useForm<FormData>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: props,
  })

  const handleChatFormSubmit = async (formData: FormData) => {
    return formData
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChatFormSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Your chatbot name'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym. You can
                only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us about you'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxLengthSelector'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel htmlFor='maxLengthSelector'>Max tokens</FormLabel>
                <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  id='maxLengthSelector'
                  max={4000}
                  defaultValue={field.value}
                  step={10}
                  onValueChange={field.onChange}
                  className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
                  aria-label='Maximum Length'
                />
              </FormControl>
              <FormDescription>
                The maximum number of tokens to generate. Requests can use up to 2,048 or 4,000
                tokens, shared between prompt and completion. The exact limit varies by model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tempSelector'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel htmlFor='tempSelector'>Temperature</FormLabel>
                <span className='w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  id='tempSelector'
                  max={2}
                  defaultValue={field.value}
                  step={0.1}
                  onValueChange={field.onChange}
                  className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
                  aria-label='Temperature'
                />
              </FormControl>
              <FormDescription>
                Controls randomness: lowering results in less random completions. As the temperature
                approaches zero, the model will become deterministic and repetitive.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  )
}
