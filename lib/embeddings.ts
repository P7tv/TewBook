// Use free embeddings instead of OpenAI
import { 
  generateEmbeddings as generateFreeEmbeddings, 
  generateSingleEmbedding as generateFreeSingleEmbedding,
  isFreeEmbeddingsAvailable 
} from "./free-embeddings"

// Re-export the function
export { isFreeEmbeddingsAvailable }

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // Use free embeddings
  if (!isFreeEmbeddingsAvailable()) {
    console.warn('⚠️ Free embeddings not available. Using placeholder embeddings.')
    return texts.map(() => new Array(384).fill(0)) // Placeholder embeddings (384 dimensions for all-MiniLM-L6-v2)
  }

  try {
    return await generateFreeEmbeddings(texts)
  } catch (error) {
    console.warn('⚠️ Failed to generate embeddings:', error instanceof Error ? error.message : String(error))
    return texts.map(() => new Array(384).fill(0)) // Placeholder embeddings
  }
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
  // Use free embeddings
  if (!isFreeEmbeddingsAvailable()) {
    console.warn('⚠️ Free embeddings not available. Using placeholder embedding.')
    return new Array(384).fill(0) // Placeholder embedding
  }

  try {
    return await generateFreeSingleEmbedding(text)
  } catch (error) {
    console.warn('⚠️ Failed to generate embedding:', error instanceof Error ? error.message : String(error))
    return new Array(384).fill(0) // Placeholder embedding
  }
}

export async function storeEmbeddings(embeddings: { content: string; embedding: number[]; metadata: any }[]) {
  // This is a placeholder. In a real application, you would store the embeddings in a database.
  console.log("Storing embeddings:", embeddings)
  return Promise.resolve()
}
