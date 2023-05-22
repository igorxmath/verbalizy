import type { Database } from '@/types/database.types'
import {
  createServerComponentSupabaseClient,
  createRouteHandlerSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'

export const supabaseServer = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

export const supabaseRoute = () =>
  createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })
