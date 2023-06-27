import type { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabaseClient = () => createClientComponentClient<Database>()
