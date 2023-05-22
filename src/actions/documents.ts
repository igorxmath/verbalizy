'use server'

import { supabaseServer } from '@/lib/supabaseHandler'
import { Project, Document } from '@/types/general.types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addDocument(
  { name, content }: { name: Document['name']; content: Document['content'] },
  projectId: Project['id'],
) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return
  }

  const { data: document, error } = await supabase
    .from('documents')
    .insert({
      name,
      content,
      status: 'ready',
      project_id: projectId,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return
  }

  if (!document) {
    return
  }

  revalidatePath('/')
  redirect(`/editor/${document.id}`)
}

export async function deleteDocument(docId: Document['id']) {
  const supabase = supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    throw new Error('Forbidden')
  }

  const { data, error } = await supabase.from('documents').delete().eq('id', docId)

  if (error) {
    return
  }

  if (!data) {
    return
  }

  revalidatePath('/')
}
