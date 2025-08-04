import fs from 'fs/promises'
import path from 'path'
import { subjects } from './subjects-config'

export interface CachedDocument {
  id: string
  subjectId: string
  contentId: string
  chunks: string[]
  embeddings: number[][]
  source: string
  lastUpdated: number
  status: 'loading' | 'ready' | 'error'
  error?: string
}

class DocumentCache {
  private cache: Map<string, CachedDocument> = new Map()
  private loadingPromises: Map<string, Promise<void>> = new Map()
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    console.log('🔄 Initializing document cache...')
    this.isInitialized = true

    // Pre-load all documents
    const loadPromises = subjects.flatMap(subject =>
      subject.contents.map(content => this.preloadDocument(subject, content))
    )

    await Promise.allSettled(loadPromises)
    console.log('✅ Document cache initialization complete')
  }

  private async preloadDocument(subject: any, content: any) {
    const cacheKey = `${subject.id}-${content.id}`
    
    if (this.cache.has(cacheKey)) {
      return // Already cached
    }

    // Add loading entry
    this.cache.set(cacheKey, {
      id: cacheKey,
      subjectId: subject.id,
      contentId: content.id,
      chunks: [],
      embeddings: [],
      source: `${subject.name} - ${content.name}`,
      lastUpdated: Date.now(),
      status: 'loading'
    })

    try {
      console.log(`📄 Loading: ${subject.name} - ${content.name}`)
      
      // Load document content
      const documentContent = await this.loadDocumentContent(content.pdfPath)
      
      // Split into chunks
      const chunks = this.chunkText(documentContent)
      
      // Generate embeddings (if API key is available)
      const embeddings = await this.generateEmbeddings(chunks)
      
      // Update cache
      this.cache.set(cacheKey, {
        id: cacheKey,
        subjectId: subject.id,
        contentId: content.id,
        chunks,
        embeddings,
        source: `${subject.name} - ${content.name}`,
        lastUpdated: Date.now(),
        status: 'ready'
      })

      console.log(`✅ Loaded: ${subject.name} - ${content.name} (${chunks.length} chunks)`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Error loading ${content.pdfPath}:`, errorMessage)
      
      // Update cache with error
      this.cache.set(cacheKey, {
        id: cacheKey,
        subjectId: subject.id,
        contentId: content.id,
        chunks: [],
        embeddings: [],
        source: `${subject.name} - ${content.name}`,
        lastUpdated: Date.now(),
        status: 'error',
        error: errorMessage
      })
    }
  }

  private async loadDocumentContent(filePath: string): Promise<string> {
    try {
      const absolutePath = path.join(process.cwd(), 'public', filePath.startsWith('/') ? filePath.slice(1) : filePath)
      const ext = path.extname(absolutePath).toLowerCase()
      
      // Check if file exists
      await fs.access(absolutePath)
      
      if (ext === '.pdf') {
        const pdfParse = (await import('pdf-parse')).default
        const buffer = await fs.readFile(absolutePath)
        const data = await pdfParse(buffer)
        
        if (!data.text || data.text.trim().length === 0) {
          throw new Error('PDF appears to be empty or unreadable')
        }
        return data.text
      } else if (ext === '.txt') {
        const buffer = await fs.readFile(absolutePath)
        return buffer.toString('utf-8')
      } else {
        throw new Error(`Unsupported file type: ${ext}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to load document ${filePath}: ${errorMessage}`)
    }
  }

  private chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
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

    return chunks.length > 0 ? chunks : [text]
  }

  private async generateEmbeddings(chunks: string[]): Promise<number[][]> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️ OpenAI API key not found. Using placeholder embeddings.')
        return chunks.map(() => new Array(1536).fill(0)) // Placeholder embeddings
      }

      const { generateEmbeddings } = await import('./embeddings')
      return await generateEmbeddings(chunks)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn('⚠️ Failed to generate embeddings:', errorMessage)
      return chunks.map(() => new Array(1536).fill(0)) // Placeholder embeddings
    }
  }

  getDocument(subjectId: string, contentId: string): CachedDocument | null {
    const cacheKey = `${subjectId}-${contentId}`
    return this.cache.get(cacheKey) || null
  }

  getAllDocuments(): CachedDocument[] {
    return Array.from(this.cache.values())
  }

  getDocumentsBySubject(subjectId: string): CachedDocument[] {
    return Array.from(this.cache.values()).filter(doc => doc.subjectId === subjectId)
  }

  getLoadingStatus(): { loading: number; ready: number; error: number } {
    const docs = Array.from(this.cache.values())
    return {
      loading: docs.filter(d => d.status === 'loading').length,
      ready: docs.filter(d => d.status === 'ready').length,
      error: docs.filter(d => d.status === 'error').length
    }
  }

  isReady(): boolean {
    const docs = Array.from(this.cache.values())
    return docs.length > 0 && docs.every(doc => doc.status === 'ready')
  }
}

// Export singleton instance
export const documentCache = new DocumentCache() 