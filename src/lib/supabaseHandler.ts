import type { Database } from '@/types/database.types'
import {
  createServerComponentClient,
  createServerActionClient,
  createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabaseServerComponent = () => createServerComponentClient<Database>({ cookies })

export const supabaseServerAction = () => createServerActionClient<Database>({ cookies })

export const supabaseRoute = () => createRouteHandlerClient<Database>({ cookies })
