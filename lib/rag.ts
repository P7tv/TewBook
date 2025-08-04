import { generateSingleEmbedding } from "./embeddings"
import { documentCache } from "./document-cache"
import { calculatePageNumber, formatPageReference } from "./page-calculator"

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function findRelevantContent(
  query: string,
  subjectId: string,
  selectedContentIds: string[] = [],
  topK = 5,
) {
  // Initialize document cache if not already done
  await documentCache.initialize()

  // Get documents from cache
  let documents = documentCache.getDocumentsBySubject(subjectId)

  // If specific content is selected, filter by those content IDs
  if (selectedContentIds.length > 0) {
    documents = documents.filter((doc) => selectedContentIds.includes(doc.contentId))
  }

  // Filter only ready documents
  documents = documents.filter((doc) => doc.status === 'ready')

  if (documents.length === 0) {
    console.log(`No ready documents found for subject: ${subjectId}`)
    return []
  }

  // Generate embedding for the query
  const queryEmbedding = await generateSingleEmbedding(query)

  // Calculate similarity scores for all chunks
  const similarities = []
  
  for (const doc of documents) {
    for (let i = 0; i < doc.chunks.length; i++) {
      const similarity = cosineSimilarity(queryEmbedding, doc.embeddings[i])
      
      // Calculate page number using advanced algorithm
      const pageInfo = calculatePageNumber(i, doc.chunks.length, doc.chunks[i], doc.source)
      
      similarities.push({
        content: doc.chunks[i],
        source: doc.source,
        contentId: doc.contentId,
        subjectId: doc.subjectId,
        pageNumber: pageInfo.pageNumber,
        pageConfidence: pageInfo.confidence,
        chunkIndex: i + 1,
        totalChunks: doc.chunks.length,
        similarity,
      })
    }
  }

  // Sort by similarity and return top K results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .filter((doc) => doc.similarity > 0.2) // Lower threshold for more results
}

export async function getCacheStatus() {
  await documentCache.initialize()
  return documentCache.getLoadingStatus()
}

export async function isCacheReady() {
  await documentCache.initialize()
  return documentCache.isReady()
}
