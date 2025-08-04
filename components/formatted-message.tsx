"use client"

import { formatMathText } from "./math-formula"

interface FormattedMessageProps {
  text: string
  className?: string
  subject?: 'physics' | 'chemistry' | 'biology' | 'math'
}

export function FormattedMessage({ text, className = "", subject }: FormattedMessageProps) {
  // Function to format text with better styling
  const formatText = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/)
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      // Check if paragraph is a list item
      if (paragraph.trim().match(/^[-*•]\s/)) {
        return (
          <ul key={index} className="list-disc list-inside space-y-1 my-2">
            {paragraph.split('\n').map((item, itemIndex) => {
              const cleanItem = item.replace(/^[-*•]\s/, '').trim()
              if (cleanItem) {
                return (
                  <li key={itemIndex} className="text-sm">
                    {formatMathText(cleanItem, subject)}
                  </li>
                )
              }
              return null
            })}
          </ul>
        )
      }
      
      // Check if paragraph is a numbered list
      if (paragraph.trim().match(/^\d+\.\s/)) {
        return (
          <ol key={index} className="list-decimal list-inside space-y-1 my-2">
            {paragraph.split('\n').map((item, itemIndex) => {
              const cleanItem = item.replace(/^\d+\.\s/, '').trim()
              if (cleanItem) {
                return (
                  <li key={itemIndex} className="text-sm">
                    {formatMathText(cleanItem, subject)}
                  </li>
                )
              }
              return null
            })}
          </ol>
        )
      }
      
      // Check if paragraph is a heading
      if (paragraph.trim().match(/^[#]{1,6}\s/)) {
        const level = paragraph.match(/^[#]+/)?.[0].length || 1
        const cleanText = paragraph.replace(/^[#]+\s/, '').trim()
        
        const headingClass = `font-bold my-3 ${
          level === 1 ? 'text-lg' : 
          level === 2 ? 'text-base' : 'text-sm'
        }`
        
        if (level === 1) {
          return <h1 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h1>
        } else if (level === 2) {
          return <h2 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h2>
        } else if (level === 3) {
          return <h3 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h3>
        } else if (level === 4) {
          return <h4 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h4>
        } else if (level === 5) {
          return <h5 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h5>
        } else {
          return <h6 key={index} className={headingClass}>{formatMathText(cleanText, subject)}</h6>
        }
      }
      
      // Regular paragraph
      return (
        <p key={index} className="my-2 leading-relaxed">
          {formatMathText(paragraph, subject)}
        </p>
      )
    })
  }
  
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {formatText(text)}
    </div>
  )
}

// Component for displaying code blocks
export function CodeBlock({ code, language = "text" }: { code: string; language?: string }) {
  return (
    <div className="bg-gray-100 rounded-lg p-3 my-3 font-mono text-sm overflow-x-auto">
      <div className="text-xs text-gray-500 mb-2">{language}</div>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  )
}

// Component for displaying inline code
export function InlineCode({ code }: { code: string }) {
  return (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
      {code}
    </code>
  )
}

// Component for displaying highlighted text
export function HighlightedText({ text, type = "info", subject }: { text: string; type?: "info" | "warning" | "success" | "error"; subject?: 'physics' | 'chemistry' | 'biology' | 'math' }) {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800"
  }
  
  return (
    <div className={`border-l-4 p-3 my-3 rounded-r ${colors[type]}`}>
      {formatMathText(text, subject)}
    </div>
  )
} 