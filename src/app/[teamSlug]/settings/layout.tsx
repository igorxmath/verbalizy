import AsideNav from '#/dashboard/asideNav'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function TeamSettingsLayout({
  params: { teamSlug },
  children,
}: {
  params: { teamSlug: string }
  children: React.ReactNode
}) {
  const supabase = supabaseServerComponent()

  const { data: team } = await supabase
    .from('teams')
    .select('is_personal')
    .eq('slug', teamSlug)
    .single()

  if (!team) {
    notFound()
  }

  const teamSettingsSegments = team.is_personal
    ? [
        {
          slug: '',
          name: 'General',
        },
      ]
    : [
        {
          slug: '',
          name: 'General',
        },
        {
          slug: 'billing',
          name: 'Billing',
        },
        {
          slug: 'people',
          name: 'People',
        },
      ]

  return (
    <div className='flex w-full flex-col'>
      <div className='border-b'>
        <div className='max-auto container flex flex-col justify-between space-y-4 px-4 py-8 sm:flex-row sm:space-y-0'>
          <h1 className='font-heading text-3xl md:text-4xl'>Settings</h1>
        </div>
      </div>
      <div className='space-y-4 p-4 md:container'>
        <div className='flex flex-col md:flex-row'>
          <AsideNav
            segments={teamSettingsSegments}
            path={`${teamSlug}`}
          />
          <div className='w-full space-y-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
