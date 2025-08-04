import { findRelevantContent, getCacheStatus } from "@/lib/rag"
import { typhoon, isTyphoonConfigured, typhoonChatCompletion } from "@/lib/typhoon-client"
import { formatPageReference } from "@/lib/page-calculator"
import { chatHistory } from "@/lib/chat-history"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, subject, content, sessionId } = await req.json()

    if (!subject) {
      return new Response("Subject is required", { status: 400 })
    }

    console.log(`Chat request - Subject: ${subject}, Content: ${content}, Session: ${sessionId}`)

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    const userMessageText = latestMessage.parts?.[0]?.text || latestMessage.content || ""
    console.log(`User message: ${userMessageText}`)

    if (!userMessageText.trim()) {
      return new Response("User message is required", { status: 400 })
    }

    // จัดการ session
    let currentSessionId = sessionId
    if (!currentSessionId) {
      // สร้าง session ใหม่หรือหา session ที่มีอยู่
      const existingSession = chatHistory.getSessionForSubject(subject)
      if (existingSession) {
        currentSessionId = existingSession.id
      } else {
        currentSessionId = chatHistory.createSession(subject)
      }
    }

    // เพิ่มข้อความผู้ใช้ลงในประวัติ
    chatHistory.addMessage(currentSessionId, 'user', userMessageText)

    // Check cache status
    const cacheStatus = await getCacheStatus()
    console.log(`Cache status:`, cacheStatus)

    // Find relevant content from selected subject and content
    const relevantContent = await findRelevantContent(userMessageText, subject, content)
    console.log(`Found ${relevantContent.length} relevant content chunks`)

    // Create context from relevant content with page references
    const context =
      relevantContent.length > 0
        ? relevantContent.map((doc) => {
            const pageRef = formatPageReference(doc.source, doc.pageNumber, doc.pageConfidence)
            return `[${pageRef}]\n${doc.content}`
          }).join("\n\n")
        : "ไม่พบเอกสารที่เกี่ยวข้องในวิชาที่เลือก"

    console.log(`Context length: ${context.length} characters`)

    // Check if we have a valid Typhoon API configuration
    if (!isTyphoonConfigured()) {
      // Return a helpful message when API key is not configured
      return new Response(
        JSON.stringify({
          error: "Typhoon API not configured",
          message: "ระบบสามารถโหลดเอกสารได้แล้ว แต่ต้องการ Typhoon API key เพื่อตอบคำถาม กรุณาตั้งค่า TYPHOON_API_KEY ใน .env file",
          context: context.length > 0 ? "พบเอกสารที่เกี่ยวข้อง" : "ไม่พบเอกสารที่เกี่ยวข้อง"
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // รับประวัติการสนทนาล่าสุด
    const contextMessages = chatHistory.getContextMessages(currentSessionId, 5)
    const conversationHistory = contextMessages
      .map(msg => `${msg.role === 'user' ? 'ผู้ใช้' : 'AI'}: ${msg.content}`)
      .join('\n')

    const systemPrompt = `คุณคือ AI ผู้ช่วยวิชาการที่ตอบคำถามโดยอ้างอิงจากเอกสารการเรียนการสอนที่ให้มาเท่านั้น

กฎการตอบ:
1. ตอบโดยใช้ข้อมูลจาก "เอกสารอ้างอิง" ด้านล่างเท่านั้น
2. หากไม่พบข้อมูลที่เกี่ยวข้อง ให้ตอบว่า "ขออภัย ไม่พบข้อมูลที่เกี่ยวข้องในเนื้อหาที่เลือก" และแนะนำให้ลองถามใหม่หรือเลือกหัวข้ออื่น
3. ตอบเป็นภาษาไทยที่เข้าใจง่าย กระชับ เหมาะกับนักเรียน
4. หากคำถามซับซ้อน ให้แบ่งคำตอบเป็นข้อย่อย
5. อ้างอิงแหล่งที่มาของข้อมูลพร้อมหมายเลขหน้า (เช่น [ชื่อวิชา - ชื่อหัวข้อ - หน้า X]) เมื่อเหมาะสม
6. หาก context มีน้อย ให้ตอบเท่าที่มีข้อมูลและแจ้งผู้ใช้
7. ระบุหมายเลขหน้าทุกครั้งที่อ้างอิงข้อมูล
8. สำหรับสูตรคณิตศาสตร์ ให้ใช้รูปแบบ LaTeX:
   - สูตรแบบ inline: $formula$
   - สูตรแบบ block: $$formula$$
   - ตัวอย่าง: $a = \\frac{v_f - v_i}{t}$ หรือ $$E = mc^2$$
   - ใช้ \\frac{}{} สำหรับเศษส่วน
   - ใช้ \\Delta สำหรับ Δ
   - ใช้ \\lim สำหรับ limit
   - ใช้ _ สำหรับ subscript และ ^ สำหรับ superscript
9. ใช้ประวัติการสนทนาก่อนหน้าเพื่อให้บริบทที่ต่อเนื่อง

ประวัติการสนทนาก่อนหน้า:
${conversationHistory}

เอกสารอ้างอิง:
${context}
`

    try {
      // Use custom Typhoon API
      const response = await typhoonChatCompletion([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessageText,
        }
      ], {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 0.9,
        repetitionPenalty: 1.1,
      })

      const assistantMessage = response.choices[0].message.content

      // เพิ่มข้อความ AI ลงในประวัติ
      chatHistory.addMessage(currentSessionId, 'assistant', assistantMessage)

      // Return streaming response in the correct format for AI SDK
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          // Send text-start
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-start", id: "1" })}\n\n`))
          
          // Send text-delta with the message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-delta", id: "1", delta: assistantMessage })}\n\n`))
          
          // Send text-end
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-end", id: "1" })}\n\n`))
          
          controller.close()
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Session-Id': currentSessionId,
        },
      })
    } catch (error) {
      console.error("Typhoon API error:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    
    // Check if it's an API key error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('API key') || errorMessage.includes('OpenAI') || errorMessage.includes('Typhoon')) {
      return new Response(
        JSON.stringify({
          error: "Typhoon API key is missing or invalid. Please set TYPHOON_API_KEY in your environment variables.",
          details: "The system can still load documents but cannot generate AI responses without a valid Typhoon API configuration."
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
