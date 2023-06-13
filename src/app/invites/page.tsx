import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/ui/card'
import InviteButton from '@/components/dashboard/inviteButton'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notFound } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { email, token, teamId } = searchParams

  if (!email || !token || !teamId) {
    notFound()
  }

  const { data: team } = await supabaseAdmin
    .from('teams')
    .select('slug, name')
    .eq('id', teamId)
    .neq('is_personal', false)
    .limit(1)
    .maybeSingle()

  if (!team) {
    notFound()
  }

  return (
    <div className='flex min-h-screen w-screen flex-col items-center justify-center'>
      <Card className='mx-auto flex w-full flex-col justify-center sm:w-[450px]'>
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>
            You have received an invitation to join the team {team.name}! Click the button below to
            accept the invitation.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <InviteButton
            email={email}
            token={token}
            teamId={teamId}
            slug={team.slug}
          />
        </CardFooter>
      </Card>
    </div>
  )
}
