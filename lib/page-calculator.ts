// Utility to calculate page numbers for document chunks

export interface PageInfo {
  pageNumber: number
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

export function calculatePageNumber(
  chunkIndex: number,
  totalChunks: number,
  chunkContent: string,
  documentName: string
): PageInfo {
  // Estimate based on chunk position and content characteristics
  
  // Method 1: Position-based estimation
  const positionBasedPage = Math.floor((chunkIndex / totalChunks) * 15) + 1 // Assume 15 pages per document
  
  // Method 2: Content-based estimation
  const contentLength = chunkContent.length
  const avgCharsPerPage = 2000 // Average characters per page
  const contentBasedPage = Math.floor(chunkIndex * (contentLength / avgCharsPerPage)) + 1
  
  // Method 3: Document-specific estimation
  let documentSpecificPage = positionBasedPage
  
  // Adjust based on document type
  if (documentName.includes('ชีววิทยา')) {
    // Biology documents might have more diagrams, so fewer pages
    documentSpecificPage = Math.floor((chunkIndex / totalChunks) * 12) + 1
  } else if (documentName.includes('ฟิสิกส์')) {
    // Physics documents might have more formulas and diagrams, so moderate pages
    documentSpecificPage = Math.floor((chunkIndex / totalChunks) * 15) + 1
  } else if (documentName.includes('คณิตศาสตร์')) {
    // Math documents might have more formulas, so more pages
    documentSpecificPage = Math.floor((chunkIndex / totalChunks) * 18) + 1
  }
  
  // Combine methods for better accuracy
  const finalPage = Math.round((positionBasedPage + contentBasedPage + documentSpecificPage) / 3)
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'medium'
  let reason = 'Estimated based on chunk position and content'
  
  if (totalChunks <= 5) {
    confidence = 'high'
    reason = 'Small document, accurate estimation'
  } else if (totalChunks > 20) {
    confidence = 'low'
    reason = 'Large document, rough estimation'
  }
  
  // If chunk contains page indicators, use them
  const pageMatch = chunkContent.match(/หน้า\s*(\d+)/i)
  if (pageMatch) {
    return {
      pageNumber: parseInt(pageMatch[1]),
      confidence: 'high',
      reason: 'Found page number in content'
    }
  }
  
  return {
    pageNumber: Math.max(1, finalPage),
    confidence,
    reason
  }
}

export function formatPageReference(source: string, pageNumber: number, confidence: 'high' | 'medium' | 'low' = 'medium'): string {
  const confidenceIndicator = confidence === 'low' ? ' (ประมาณ)' : ''
  return `${source} - หน้า ${pageNumber}${confidenceIndicator}`
}

export function formatMultiplePageReferences(references: Array<{source: string, pageNumber: number, confidence?: 'high' | 'medium' | 'low'}>): string {
  const uniqueSources = new Map<string, number[]>()
  
  // Group by source and collect page numbers
  references.forEach(ref => {
    if (!uniqueSources.has(ref.source)) {
      uniqueSources.set(ref.source, [])
    }
    uniqueSources.get(ref.source)!.push(ref.pageNumber)
  })
  
  // Format each source with its page numbers
  return Array.from(uniqueSources.entries())
    .map(([source, pages]) => {
      const uniquePages = [...new Set(pages)].sort((a, b) => a - b)
      if (uniquePages.length === 1) {
        return `${source} - หน้า ${uniquePages[0]}`
      } else {
        return `${source} - หน้า ${uniquePages.join(', ')}`
      }
    })
    .join('; ')
} 