import Footer from '#/dashboard/footer'
import Header from '#/dashboard/header'
import LoadingNav from '#/dashboard/loadingNav'
import { Toaster } from '#/ui/toaster'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({
  children,
  params: { teamSlug },
}: {
  children: React.ReactNode
  params: { teamSlug: string }
}) {
  return (
    <>
      <Suspense fallback={<LoadingNav />}>
        <Header teamSlug={teamSlug} />
      </Suspense>
      <main className='flex min-h-screen w-full justify-center'>{children}</main>
      <Footer />
      <Toaster />
    </>
  )
}
