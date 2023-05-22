import { env } from '@/env.mjs'
import type { Database } from '@/types/database.types'
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
)
