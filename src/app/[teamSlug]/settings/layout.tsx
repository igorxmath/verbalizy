import AsideNav from '@/components/dashboard/asideNav'
import React from 'react'

const teamSettingsSegments = [
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

export default function TeamSettingsLayout({
  params: { teamSlug },
  children,
}: {
  params: { teamSlug: string }
  children: React.ReactNode
}) {
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
