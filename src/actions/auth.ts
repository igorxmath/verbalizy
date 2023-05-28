'use server'

import { supabaseServerAction } from '@/lib/supabaseHandler'
import { revalidatePath } from 'next/cache'

export const handleSignOut = async () => {
  const supabase = supabaseServerAction()
  await supabase.auth.signOut()

  revalidatePath('/')
}
