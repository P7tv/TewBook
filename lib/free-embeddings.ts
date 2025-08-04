// Free embedding system using hash-based embeddings
// This is a lightweight alternative to expensive API calls

// Simple hash-based embedding
function generateHashEmbedding(text: string): number[] {
  const hash = simpleHash(text)
  const embedding = new Array(384).fill(0) // 384 dimensions for consistency
  
  // Use hash to generate pseudo-random embedding
  for (let i = 0; i < embedding.length; i++) {
    embedding[i] = Math.sin(hash + i) * 0.5
  }
  
  return embedding
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  console.log(`🔄 Generating hash-based embeddings for ${texts.length} texts...`)
  
  try {
    const embeddings = texts.map(text => generateHashEmbedding(text))
    console.log(`✅ Generated ${embeddings.length} embeddings`)
    return embeddings
  } catch (error) {
    console.warn('⚠️ Failed to generate embeddings:', error instanceof Error ? error.message : String(error))
    return texts.map(() => new Array(384).fill(0)) // Placeholder embeddings
  }
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
  console.log('🔄 Generating single hash-based embedding...')
  
  try {
    const embedding = generateHashEmbedding(text)
    console.log('✅ Generated single embedding')
    return embedding
  } catch (error) {
    console.warn('⚠️ Failed to generate single embedding:', error instanceof Error ? error.message : String(error))
    return new Array(384).fill(0) // Placeholder embedding
  }
}

export async function storeEmbeddings(embeddings: { content: string; embedding: number[]; metadata: any }[]) {
  // This is a placeholder. In a real application, you would store the embeddings in a database.
  console.log("Storing embeddings:", embeddings.length, "items")
  return Promise.resolve()
}

// Utility function to check if free embeddings are available
export function isFreeEmbeddingsAvailable(): boolean {
  return true // Always available since we have fallback
} 