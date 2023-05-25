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

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /_next/ (Next.js internals)
     * 2. /_proxy/, /_auth/ (special pages for OG tags proxying and password protection)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!_next/|_proxy/|_auth/|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}
