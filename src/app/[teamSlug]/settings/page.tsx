import {
  ConfirmTeamDeletion,
  ConfirmAccountDeletion,
  TeamNameForm,
  TeamSlugForm,
} from '#/dashboard/teamSettingsFields'
import { supabaseServerComponent } from '@/lib/supabaseHandler'

export const revalidate = 0

export default async function Settings({ params: { teamSlug } }: { params: { teamSlug: string } }) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase.from('teams').select('*').eq('slug', teamSlug).single()

  if (team?.is_personal) {
    return (
      <>
        <TeamSlugForm
          title='Your Username'
          description='This is your URL namespace within Verbalizy.'
          team={team}
        />
        <ConfirmAccountDeletion personalTeamSlug={teamSlug} />
      </>
    )
  } else if (team?.is_personal === false) {
    return (
      <>
        <TeamSlugForm
          title='Your team slug'
          description='This is your URL namespace within Verbalizy.'
          team={team}
        />
        <TeamNameForm team={team} />
        <ConfirmTeamDeletion team={team} />
      </>
    )
  }
}
