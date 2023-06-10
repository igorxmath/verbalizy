import { type NextRequest, NextResponse } from 'next/server'
import { supabaseRoute } from '@/lib/supabaseHandler'

export const revalidate = 0

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = supabaseRoute()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(
    next ? `${requestUrl.origin}${next}` : `${requestUrl.origin}/dashboard`,
  )
}
