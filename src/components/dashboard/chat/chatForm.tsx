'use client'

import { MaxLengthSelector } from '@/components/dashboard/chat/maxlengthSelector'
import { TemperatureSelector } from '@/components/dashboard/chat/temperatureSelector'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const chatFormSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string(),
  tempSelector: z.tuple([z.number()]),
  maxLengthSelector: z.tuple([z.number()]),
})

type FormData = z.infer<typeof chatFormSchema>

export function ChatForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { tempSelector: [0.8], maxLengthSelector: [256] },
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
              <MaxLengthSelector
                defaultValue={field.value}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tempSelector'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TemperatureSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  )
}
