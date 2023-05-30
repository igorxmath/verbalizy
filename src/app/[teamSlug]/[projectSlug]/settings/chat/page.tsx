import { Separator } from '#/ui/separator'
import { ChatForm } from '@/components/dashboard/chat/chatForm'

export default async function Page() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Chat</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see your chat on the site.
        </p>
      </div>
      <Separator />
      <ChatForm />
    </div>
  )
}
