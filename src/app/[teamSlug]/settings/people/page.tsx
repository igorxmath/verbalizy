import { Avatar, AvatarFallback, AvatarImage } from '#/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notFound } from 'next/navigation'
import NewInviteDialog from '@/components/dashboard/inviteDialog'
import { DeleteInviteAlert } from '@/components/dashboard/deleteInviteAlert'
import { MemberOperator } from '@/components/dashboard/memberOperator'

export default async function Page({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('id').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  const { data: members } = await supabase
    .from('memberships')
    .select('user_id')
    .eq('team_id', team.id)

  if (!members) {
    notFound()
  }

  const userIds = members.map((member) => member.user_id)

  const { data: users } = await supabaseAdmin.from('users').select('*').in('id', userIds)

  if (!users) {
    notFound()
  }

  const { data: invites } = await supabaseAdmin.from('invites').select('*').eq('team_id', team.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <p>People</p>
            <NewInviteDialog teamId={team.id} />
          </div>
        </CardTitle>
        <CardDescription>Teammates or friends that have access to this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue='members'
          className='w-full'
        >
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='members'>Members</TabsTrigger>
            <TabsTrigger value='invitations'>Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value='members'>
            <div className='space-y-4'>
              {users.map((user) => (
                <div
                  className='flex items-center justify-between px-2'
                  key={user.id}
                >
                  <div className='flex items-center space-x-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user.avatar_url || `https://avatar.vercel.sh/${teamSlug}.png`}
                        alt={user.full_name as string}
                      />
                      <AvatarFallback>{user.full_name ? user.full_name[0] : 'V'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.full_name}</p>
                      <p className='text-sm text-muted-foreground'>{user.email}</p>
                    </div>
                  </div>
                  <MemberOperator
                    teamId={team.id}
                    userId={user.id}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='invitations'>
            <div className='space-y-4 px-2'>
              {invites?.length ? (
                invites.map((invitedUser) => (
                  <div
                    className='flex items-center justify-between'
                    key={invitedUser.id}
                  >
                    <p>{invitedUser.email}</p>
                    <DeleteInviteAlert inviteId={invitedUser.id} />
                  </div>
                ))
              ) : (
                <p>No invitations sent</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
