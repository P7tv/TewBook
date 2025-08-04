export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  subjectId: string
}

export interface ChatSession {
  id: string
  subjectId: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

class ChatHistoryManager {
  private sessions: Map<string, ChatSession> = new Map()
  private readonly STORAGE_KEY = 'rag-chatbot-history'
  private readonly MAX_SESSIONS = 10
  private readonly MAX_MESSAGES_PER_SESSION = 50

  constructor() {
    this.loadFromStorage()
  }

  // สร้าง session ใหม่
  createSession(subjectId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: ChatSession = {
      id: sessionId,
      subjectId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    this.sessions.set(sessionId, session)
    this.saveToStorage()
    return sessionId
  }

  // รับ session สำหรับวิชา
  getSessionForSubject(subjectId: string): ChatSession | null {
    // หา session ล่าสุดสำหรับวิชานี้
    let latestSession: ChatSession | null = null
    let latestTime = 0

    for (const session of this.sessions.values()) {
      if (session.subjectId === subjectId && session.updatedAt > latestTime) {
        latestSession = session
        latestTime = session.updatedAt
      }
    }

    return latestSession
  }

  // เพิ่มข้อความลงใน session
  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
      subjectId: session.subjectId
    }

    session.messages.push(message)
    session.updatedAt = Date.now()

    // จำกัดจำนวนข้อความต่อ session
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      session.messages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION)
    }

    this.saveToStorage()
    return true
  }

  // รับประวัติข้อความสำหรับ context
  getContextMessages(sessionId: string, maxMessages: number = 10): ChatMessage[] {
    const session = this.sessions.get(sessionId)
    if (!session) return []

    // รับข้อความล่าสุดตามจำนวนที่กำหนด
    return session.messages.slice(-maxMessages)
  }

  // ลบ session
  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId)
    if (deleted) {
      this.saveToStorage()
    }
    return deleted
  }

  // ลบประวัติทั้งหมด
  clearAllHistory(): void {
    this.sessions.clear()
    this.saveToStorage()
  }

  // ลบประวัติของวิชาเฉพาะ
  clearSubjectHistory(subjectId: string): void {
    const sessionsToDelete: string[] = []
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.subjectId === subjectId) {
        sessionsToDelete.push(sessionId)
      }
    }

    sessionsToDelete.forEach(sessionId => {
      this.sessions.delete(sessionId)
    })

    this.saveToStorage()
  }

  // รับ session ทั้งหมด
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt)
  }

  // รับ session สำหรับวิชา
  getSessionsBySubject(subjectId: string): ChatSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.subjectId === subjectId)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }

  // บันทึกลง localStorage
  private saveToStorage(): void {
    try {
      // ตรวจสอบว่าเป็น browser environment หรือไม่
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = {
          sessions: Array.from(this.sessions.entries()),
          timestamp: Date.now()
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Failed to save chat history to storage:', error)
    }
  }

  // โหลดจาก localStorage
  private loadFromStorage(): void {
    try {
      // ตรวจสอบว่าเป็น browser environment หรือไม่
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(this.STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          if (parsed.sessions) {
            this.sessions = new Map(parsed.sessions)
            
            // จำกัดจำนวน sessions
            if (this.sessions.size > this.MAX_SESSIONS) {
              const sessionsArray = Array.from(this.sessions.entries())
                .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
                .slice(0, this.MAX_SESSIONS)
              this.sessions = new Map(sessionsArray)
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load chat history from storage:', error)
    }
  }

  // ส่งออกประวัติ (สำหรับ backup)
  exportHistory(): string {
    return JSON.stringify({
      sessions: Array.from(this.sessions.entries()),
      timestamp: Date.now()
    })
  }

  // นำเข้าประวัติ (สำหรับ restore)
  importHistory(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        this.sessions = new Map(parsed.sessions)
        this.saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import chat history:', error)
      return false
    }
  }
}

// สร้าง instance เดียว
export const chatHistory = new ChatHistoryManager() 