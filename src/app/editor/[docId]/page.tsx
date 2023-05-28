import Editor from '@/components/dashboard/editor'
import { supabaseServer } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Page({ params: { docId } }: { params: { docId: string } }) {
  const supabase = supabaseServer()

  const { data: document } = await supabase.from('documents').select('*').eq('id', docId).single()

  if (!document) {
    notFound()
  }

  return <Editor document={document} />
}
