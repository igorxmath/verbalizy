import type { Database } from '@/types/database.types'
import {
  createRouteHandlerClient,
  createServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabaseServerComponent = () => createServerComponentClient<Database>({ cookies })

export const supabaseServerAction = () => createServerActionClient<Database>({ cookies })

export const supabaseRoute = () => createRouteHandlerClient<Database>({ cookies })
