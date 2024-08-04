import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { createClient } from '@supabase/supabase-js'
import { openAIApiKey, supabaseApiKey, supabaseUrl } from './getsecrets.js'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
// const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY
const embeddings = new OpenAIEmbeddings({ openAIApiKey })


const client = createClient(supabaseUrl, supabaseApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
})

const retriever = vectorStore.asRetriever()

export { retriever }