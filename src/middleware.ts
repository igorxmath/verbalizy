import type { Database } from '@/types/database.types'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next()

  const pathname = req.nextUrl.pathname

  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (session) {
      const { data } = await supabase.from('teams').select('slug').eq('is_personal', true).single()

      if (!data) {
        return NextResponse.redirect(new URL('/api/users/init', req.url))
      }

      return NextResponse.redirect(new URL(`${data.slug}`, req.url))
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
