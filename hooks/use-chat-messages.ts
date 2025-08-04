"use client"

import { useState, useEffect } from 'react'
import { clientChatHistory } from '@/lib/client-chat-history'

export function useChatMessages(subjectId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [sessionId, setSessionId] = useState<string>("")

  // โหลดข้อความเมื่อเปลี่ยนวิชา
  useEffect(() => {
    if (subjectId) {
      const existingSession = clientChatHistory.getSessionForSubject(subjectId)
      if (existingSession) {
        // ใช้ session ที่มีอยู่
        setSessionId(existingSession.id)
        // แปลงข้อความจาก history เป็นรูปแบบที่ useChat ต้องการ
        const chatMessages = existingSession.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          parts: [{ type: 'text', text: msg.content }]
        }))
        setMessages(chatMessages)
      } else {
        // สร้าง session ใหม่
        const newSessionId = clientChatHistory.createSession(subjectId)
        setSessionId(newSessionId)
        setMessages([])
      }
    } else {
      setSessionId("")
      setMessages([])
    }
  }, [subjectId])

  // เพิ่มข้อความใหม่
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    if (sessionId) {
      clientChatHistory.addMessage(sessionId, role, content)
      
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role,
        content,
        parts: [{ type: 'text', text: content }]
      }
      
      setMessages(prev => [...prev, newMessage])
    }
  }

  // ล้างข้อความ
  const clearMessages = () => {
    setMessages([])
    if (subjectId) {
      clientChatHistory.clearSubjectHistory(subjectId)
      const newSessionId = clientChatHistory.createSession(subjectId)
      setSessionId(newSessionId)
    }
  }

  return {
    messages,
    sessionId,
    addMessage,
    clearMessages
  }
} 