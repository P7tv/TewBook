// This module handles loading document content from file paths
// In a real implementation, you would read actual PDF files

import fs from 'fs/promises'
import path from 'path'

export async function loadDocument(filePath: string): Promise<string> {
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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to load document ${filePath}: ${errorMessage}`)
  }
}

export function getAllDocumentPaths(): string[] {
  // Not used anymore, but kept for compatibility
  return []
}
