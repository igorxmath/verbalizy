import { Separator } from '#/ui/separator'
import { ChatForm } from '#/dashboard/chatForm'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Page({
  params: { teamSlug, projectSlug },
}: {
  params: { teamSlug: string; projectSlug: string }
}) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .match({ team_id: team?.id, slug: projectSlug })
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Chat</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see your chat on the site.
        </p>
      </div>
      <Separator />
      <ChatForm
        name={project.name}
        bio={project.slug}
        tempSelector={[0.8]}
        maxLengthSelector={[256]}
      />
    </div>
  )
}
