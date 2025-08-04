import { chatHistory } from "@/lib/chat-history"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')

    if (subjectId) {
      // รับประวัติของวิชาเฉพาะ
      const sessions = chatHistory.getSessionsBySubject(subjectId)
      return new Response(JSON.stringify({ sessions }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      // รับประวัติทั้งหมด
      const sessions = chatHistory.getAllSessions()
      return new Response(JSON.stringify({ sessions }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch chat history' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // ลบ session เฉพาะ
      const deleted = chatHistory.deleteSession(sessionId)
      return new Response(JSON.stringify({ success: deleted }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else if (subjectId) {
      // ลบประวัติของวิชาเฉพาะ
      chatHistory.clearSubjectHistory(subjectId)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      // ลบประวัติทั้งหมด
      chatHistory.clearAllHistory()
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error deleting chat history:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete chat history' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(req: Request) {
  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'export':
        const exportData = chatHistory.exportHistory()
        return new Response(JSON.stringify({ data: exportData }), {
          headers: { 'Content-Type': 'application/json' }
        })

      case 'import':
        if (data) {
          const success = chatHistory.importHistory(data)
          return new Response(JSON.stringify({ success }), {
            headers: { 'Content-Type': 'application/json' }
          })
        }
        return new Response(JSON.stringify({ error: 'No data provided for import' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Error with chat history action:', error)
    return new Response(JSON.stringify({ error: 'Failed to perform action' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 