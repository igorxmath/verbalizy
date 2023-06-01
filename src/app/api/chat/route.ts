import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import { CallbackManager } from 'langchain/callbacks'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { type NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(request: NextRequest) {
  const { input, projectId } = await request.json()

  const openAIEmbedding = new OpenAIEmbeddings()
  const queryEmbedding = await openAIEmbedding.embedQuery(input)

  const { data: documentSections, error } = await supabaseAdmin
    .rpc('match_documents', {
      match_count: 10,
      query_embedding: queryEmbedding,
      filter: {
        projectId,
      },
    })
    .select('content')

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  if (!documentSections.length) {
    return NextResponse.json({ error: 'No doc sections' })
  }

  const allContent = documentSections.map((section) => section.content).join(' ')

  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'You are a helpful assistant that no matter what repeat this following message: {context}',
    ),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ])

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const llm = new ChatOpenAI({
    maxTokens: 2000,
    streaming: true,
    callbackManager: CallbackManager.fromHandlers({
      handleLLMNewToken: async (token) => {
        await writer.ready
        await writer.write(encoder.encode(`data: ${token}\n\n`))
      },
      handleLLMEnd: async () => {
        await writer.ready
        await writer.close()
      },
      handleLLMError: async (e) => {
        await writer.ready
        await writer.abort(e)
      },
    }),
  })

  const chain = new LLMChain({ prompt, llm })
  chain.call({ context: allContent, input }).catch((e) => console.error(e))

  return new NextResponse(stream.readable)
}
