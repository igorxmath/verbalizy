import { Divider } from '#/icons'
import { NavTabs, UserAccountNav } from '@/components/dashboard/nav'
import { TeamSwitcher } from '@/components/dashboard/teamSwitcher'
import { supabaseServer } from '@/lib/supabaseHandler'
import { Team } from '@/types/general.types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Header({ teamSlug }: { teamSlug: string }) {
  const supabase = supabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { name, email, avatar_url } = user.user_metadata

  const { data } = await supabase
    .from('memberships')
    .select('user_id, teams (*)')
    .match({ user_id: user.id })

  const teams = (data?.map((d) => d.teams) || []) as unknown as Team[]

  const personalTeams = teams
    .filter(({ is_personal }) => is_personal)
    .map(({ name, slug }) => ({ name, slug }))
  const othersTeams = teams
    .filter(({ is_personal }) => !is_personal)
    .map(({ name, slug }) => ({ name, slug }))

  const groups = [
    {
      label: 'Personal Account',
      teams: personalTeams,
    },
    {
      label: 'Teams',
      teams: othersTeams,
    },
  ]

  const selectedTeam = groups.reduce((selected, group) => {
    const team = group.teams.find((team) => team.slug === teamSlug)
    if (team) {
      return team
    }
    return selected
  }, groups[0].teams[0])

  return (
    <>
      <nav className='flex flex-wrap items-center justify-between px-4 py-2'>
        <div className='flex flex-shrink-0 items-center'>
          <Link href={`/${teamSlug}`}>
            <span className='hidden text-xl font-semibold tracking-tight sm:block'>Verbalizy</span>
            <span className='block text-xl font-semibold tracking-tight sm:hidden'>V</span>
          </Link>
        </div>
        <Divider className='h-8 w-8' />
        <div className='flex w-auto grow items-center'>
          <TeamSwitcher
            groups={groups}
            selected={selectedTeam}
          />
        </div>
        <div className='flex items-center justify-between space-x-4'>
          <UserAccountNav
            name={name}
            email={email}
            avatar={avatar_url}
          />
        </div>
      </nav>
      <NavTabs />
    </>
  )
}
