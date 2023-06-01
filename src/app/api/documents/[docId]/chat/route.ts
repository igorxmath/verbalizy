import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { type NextRequest, NextResponse } from 'next/server'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { supabaseRoute } from '@/lib/supabaseHandler'
import { documentRouteContextSchema } from '@/utils/validation'
import * as z from 'zod'

export const revalidate = 0

async function generateEmbeddings(
  _request: NextRequest,
  context: z.infer<typeof documentRouteContextSchema>,
): Promise<NextResponse> {
  try {
    const {
      params: { docId },
    } = documentRouteContextSchema.parse(context)

    const embeddings = new OpenAIEmbeddings()

    const supabase = supabaseRoute()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
      chunkSize: 128,
      chunkOverlap: 0,
    })

    const { error: deleteSectionsError } = await supabaseAdmin
      .from('document_sections')
      .delete()
      .eq('document_id', docId)

    if (deleteSectionsError) {
      return NextResponse.json({ error: deleteSectionsError.message }, { status: 500 })
    }

    const { data: document } = await supabase
      .from('documents')
      .update({ status: 'trained', updated_at: new Date().toISOString() })
      .eq('id', docId)
      .select('*')
      .single()

    if (!document) {
      return NextResponse.json({ error: 'No doc found' }, { status: 500 })
    }

    const markdownOutput = await splitter.createDocuments([document.content])

    for (let i = 0; i < markdownOutput.length; i++) {
      const { pageContent, metadata } = markdownOutput[i]

      const embedding = await embeddings.embedQuery(pageContent)

      const { error } = await supabaseAdmin.from('document_sections').insert({
        document_id: docId,
        content: pageContent,
        embedding,
        metadata: { ...metadata, projectId: document.project_id },
      })

      if (error) {
        await supabase.from('documents').update({ status: 'error' }).eq('id', document.id)

        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export { generateEmbeddings as POST }
