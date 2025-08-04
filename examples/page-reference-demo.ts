import { findRelevantContent } from "@/lib/rag"
import { formatPageReference, formatMultiplePageReferences } from "@/lib/page-calculator"

// Demo function to show page reference functionality
export async function demoPageReferences() {
  try {
    // Simulate finding relevant content
    const relevantContent = await findRelevantContent(
      "อาจารย์ชื่ออะไร",
      "biology",
      ["bio-week1"],
      3
    )

    console.log("🔍 Found relevant content with page references:")
    
    relevantContent.forEach((doc, index) => {
      console.log(`\n📄 Result ${index + 1}:`)
      console.log(`   Source: ${doc.source}`)
      console.log(`   Page: ${doc.pageNumber}`)
      console.log(`   Confidence: ${doc.pageConfidence}`)
      console.log(`   Similarity: ${doc.similarity.toFixed(4)}`)
      console.log(`   Content: ${doc.content.substring(0, 100)}...`)
    })

    // Show formatted page references
    const pageRefs = relevantContent.map(doc => ({
      source: doc.source,
      pageNumber: doc.pageNumber,
      confidence: doc.pageConfidence
    }))

    console.log("\n📚 Formatted page references:")
    console.log(formatMultiplePageReferences(pageRefs))

    return relevantContent
  } catch (error) {
    console.error("Error in page reference demo:", error)
    throw error
  }
}

// Demo function to show different confidence levels
export function demoConfidenceLevels() {
  const examples = [
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 3, confidence: 'high' as const },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 7, confidence: 'medium' as const },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 12, confidence: 'low' as const },
  ]

  console.log("📊 Confidence level examples:")
  examples.forEach(example => {
    const formatted = formatPageReference(example.source, example.pageNumber, example.confidence)
    console.log(`   ${formatted}`)
  })

  return examples
}

// Demo function to show multiple page references
export function demoMultiplePages() {
  const references = [
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 3 },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 5 },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 7 },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 2", pageNumber: 2 },
    { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 2", pageNumber: 4 },
  ]

  console.log("📚 Multiple page references:")
  console.log(formatMultiplePageReferences(references))

  return references
} 