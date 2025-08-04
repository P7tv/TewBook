import { generateEmbeddings, generateSingleEmbedding, isFreeEmbeddingsAvailable } from "@/lib/embeddings"

// Example usage of free embeddings
export async function exampleFreeEmbeddings() {
  if (!isFreeEmbeddingsAvailable()) {
    console.error("Free embeddings not available")
    return
  }

  try {
    // Example texts for embedding
    const texts = [
      "RAG (Retrieval-Augmented Generation) is a technique that combines retrieval and generation.",
      "Vector databases store embeddings for similarity search.",
      "Embeddings are numerical representations of text."
    ]

    console.log("🔄 Generating embeddings for multiple texts...")
    const embeddings = await generateEmbeddings(texts)
    console.log(`✅ Generated ${embeddings.length} embeddings with ${embeddings[0].length} dimensions each`)

    return embeddings
  } catch (error) {
    console.error("Error in free embeddings:", error)
    throw error
  }
}

// Example of generating single embedding
export async function exampleSingleEmbedding(text: string) {
  if (!isFreeEmbeddingsAvailable()) {
    throw new Error("Free embeddings not available")
  }

  try {
    console.log("🔄 Generating single embedding...")
    const embedding = await generateSingleEmbedding(text)
    console.log(`✅ Generated embedding with ${embedding.length} dimensions`)

    return embedding
  } catch (error) {
    console.error("Error in single embedding:", error)
    throw error
  }
}

// Example of similarity search
export async function exampleSimilaritySearch(query: string, documents: string[]) {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateSingleEmbedding(query)
    
    // Generate embeddings for documents
    const documentEmbeddings = await generateEmbeddings(documents)
    
    // Calculate similarities
    const similarities = documentEmbeddings.map((docEmbedding, index) => {
      const similarity = cosineSimilarity(queryEmbedding, docEmbedding)
      return { index, similarity, document: documents[index] }
    })
    
    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity)
    
    console.log("🔍 Similarity search results:")
    similarities.forEach((result, rank) => {
      console.log(`${rank + 1}. Document ${result.index}: ${result.similarity.toFixed(4)}`)
    })
    
    return similarities
  } catch (error) {
    console.error("Error in similarity search:", error)
    throw error
  }
}

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have same length")
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Example configuration check
export function checkFreeEmbeddingsConfiguration() {
  const isAvailable = isFreeEmbeddingsAvailable()
  console.log(`Free embeddings available: ${isAvailable}`)
  return isAvailable
} 