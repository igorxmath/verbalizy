import type { Database } from '@/types/database.types'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest): Promise<Response | undefined> {
  const res = NextResponse.next()

  const pathname = req.nextUrl.pathname

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}
