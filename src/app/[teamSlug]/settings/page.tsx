import {
  ConfirmTeamDeletion,
  ConfirmAccountDeletion,
  TeamNameForm,
  TeamSlugForm,
} from '#/dashboard/teamSettingsFields'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Settings({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('*').eq('slug', teamSlug).single()

  if (!team) {
    notFound()
  }

  return (
    <>
      <TeamSlugForm
        title={team.is_personal ? 'Your Username' : 'Team Slug'}
        description={
          team.is_personal
            ? 'This is your URL namespace within Verbalizy.'
            : "This is the team's URL namespace within Verbalizy."
        }
        team={team}
      />
      <TeamNameForm
        title={team.is_personal ? 'Your Name' : 'Team Name'}
        description={
          team.is_personal
            ? 'Please enter your display name you are comfortable with.'
            : "Please enter the team's name"
        }
        team={team}
      />
      {team.is_personal ? (
        <ConfirmAccountDeletion personalTeamSlug={teamSlug} />
      ) : (
        <ConfirmTeamDeletion team={team} />
      )}
    </>
  )
}
