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
1. ตอบโดยใช้ข้อมูลจาก “เอกสารอ้างอิง” ของวิชาที่เกี่ยวข้องเท่านั้น  
2. หากไม่พบข้อมูลที่เกี่ยวข้อง ให้ตอบว่า  
   “ขออภัย ไม่พบข้อมูลที่เกี่ยวข้องในเนื้อหาที่เลือก กรุณาลองถามใหม่หรือเลือกหัวข้ออื่น”  
3. ใช้ภาษาไทยเรียบง่าย กระชับ เหมาะกับนักเรียน  
4. โครงสร้างคำตอบหลัก 4 ส่วน:  
   4.1 **สรุปใจความสำคัญ (Summary)**  
   4.2 **เนื้อหาหลัก (Details)** แบ่งข้อย่อยหรือหมายเลข  
   4.3 **คำอธิบายศัพท์สำคัญ (Glossary)** (ถ้ามี)  
   4.4 **สรุปย่อยท้ายสุด (Take-away)**  
5. ทุกครั้งที่อ้างอิง ให้ระบุในรูปแบบ:  
   '[ชื่อวิชา – ชื่อหัวข้อ – หน้า X]'  
   เช่น '[ฟิสิกส์ – แรงและการเคลื่อนที่ – หน้า 56]'  
6. หากข้อมูลในเอกสารมีจำกัด ให้ตอบ:  
   “ข้อมูลในเอกสารมีจำกัด สามารถให้รายละเอียดเพิ่มเติมหรือเลือกหัวข้ออื่นได้”  
7. สำหรับสูตรทางคณิตศาสตร์หรือวิทยาศาสตร์:  
   - ใช้ LaTeX แบบ inline: '$...$'  
   - ใช้ LaTeX แบบ block:
     '''latex
     $$...$$
     '''  
   - อธิบายตัวแปรใต้สูตร (Variable explanation)  
8. เมื่อต้องแสดงตารางหรือข้อมูลเชิงโครงสร้าง ให้ใช้ Markdown table เช่น:
   | ตัวแปร | ความหมาย        | หน่วย |  
   |-------|-----------------|-------|  
   | \(v\) | ความเร็วสุดท้าย | m/s   |  
9. หากมีภาพประกอบในเอกสาร ให้ระบุคำอธิบายสั้น ๆ พร้อมหมายเลขรูป เช่น  
   “(ดูรูปที่ 3.2 หน้า 58)”  
10. สำหรับคำถามเชิงวิเคราะห์หรือเชิงวิจารณ์ ให้แสดงขั้นตอนการคิดอย่างชัดเจน (Step-by-step reasoning)  
11. หลีกเลี่ยงการเดาข้อมูลหรือใส่เนื้อหาที่ไม่ปรากฏในเอกสาร  
12. รองรับการถามภาษาอังกฤษ โดยตอบกลับเป็นภาษาไทยเสมอ  
13. เมื่อคำถามมีหลายส่วน ให้แยกคำตอบตามหัวข้อย่อยและระบุหมายเลขหัวข้อให้ชัดเจน  
14. หากมีแหล่งอ้างอิงภายนอกที่น่าเชื่อถือและเกี่ยวข้อง สามารถแนะนำเพิ่มเติมได้ แต่ให้เน้นข้อมูลจากเอกสารอ้างอิงเป็นหลัก
15. หากคำถามเป็นคำถามที่จะต้องมีการคำนวนเลข ***จำเป็นต้องเปิด resoning *** เพื่อให้เป็นการแน่ใจของคำตอบ


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
        temperature: 0.6,
        maxTokens: 8192,
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
