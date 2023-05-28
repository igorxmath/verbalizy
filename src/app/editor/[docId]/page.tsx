import Editor from '@/components/dashboard/editor'
import { supabaseServerComponent } from '@/lib/supabaseHandler'
import { notFound } from 'next/navigation'

export default async function Page({ params: { docId } }: { params: { docId: string } }) {
  const supabase = supabaseServerComponent()

  const { data: document } = await supabase.from('documents').select('*').eq('id', docId).single()

  if (!document) {
    notFound()
  }

  return <Editor document={document} />
}
