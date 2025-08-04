import { generateEmbeddings, storeEmbeddings } from "./embeddings"
import pdfParse from 'pdf-parse'

// Simple text extraction for different file types
async function extractTextFromBuffer(filename: string, buffer: Buffer): Promise<string> {
  const extension = filename.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "txt":
      return buffer.toString("utf-8")
    case "pdf":
      try {
        const data = await pdfParse(buffer)
        if (!data.text || data.text.trim().length === 0) {
          throw new Error("PDF appears to be empty or unreadable")
        }
        return data.text
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to parse PDF: ${errorMessage}`)
      }
    case "docx":
      // For DOCX processing, you would use a library like mammoth
      return "DOCX content extraction requires additional setup. Please use PDF or TXT files."
    default:
      throw new Error(`Unsupported file type: ${extension}`)
  }
}

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  let currentChunk = ""

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())

      // Add overlap
      const words = currentChunk.split(" ")
      const overlapWords = words.slice(-Math.floor(overlap / 10))
      currentChunk = overlapWords.join(" ") + " " + sentence
    } else {
      currentChunk += sentence + ". "
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

export async function processDocument(filename: string, buffer: Buffer) {
  try {
    // Extract text from document
    const text = await extractTextFromBuffer(filename, buffer)

    // Split into chunks
    const chunks = chunkText(text)

    // Generate embeddings for each chunk
    const embeddings = await generateEmbeddings(chunks)

    // Store embeddings with metadata
    await storeEmbeddings(
      embeddings.map((embedding, index) => ({
        content: chunks[index],
        embedding,
        metadata: {
          filename,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      })),
    )

    return {
      filename,
      chunksProcessed: chunks.length,
      success: true,
    }
  } catch (error) {
    console.error(`Error processing document ${filename}:`, error)
    throw error
  }
}
