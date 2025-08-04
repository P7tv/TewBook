"use client"

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageCircle, FileText, Loader2 } from "lucide-react"
import { SubjectSelector } from "@/components/subject-selector"
import { ContentSelector } from "@/components/content-selector"
import { subjects } from "@/lib/subjects-config"
import { formatMathText } from "@/components/math-formula"
import { FormattedMessage } from "@/components/formatted-message"
import { ClearHistoryButton } from "@/components/clear-history-button"
import { clientChatHistory } from "@/lib/client-chat-history"
import { useChatMessages } from "@/hooks/use-chat-messages"

interface CacheStatus {
  status: {
    loading: number
    ready: number
    error: number
  }
  isReady: boolean
  timestamp: number
}

export default function RAGChatbot() {
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedContent, setSelectedContent] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [isLoadingCache, setIsLoadingCache] = useState(true)

  const { messages: chatMessages, sessionId, addMessage, clearMessages } = useChatMessages(selectedSubject)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      console.error('Chat error:', error)
      // Handle API key not configured error
      if (error.message?.includes('API key') || error.message?.includes('OpenAI')) {
        alert('กรุณาตั้งค่า OpenAI API key ใน .env file เพื่อใช้งาน AI')
      }
    }
  })

  const isLoading = status === "streaming" || status === "submitted"
  const currentSubject = subjects.find((s) => s.id === selectedSubject)

  // ฟังก์ชันสำหรับจัดการ session
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId)
    setSelectedContent([])
  }

  // ฟังก์ชันสำหรับล้างประวัติ
  const handleClearHistory = () => {
    clearMessages()
  }

  // Check cache status periodically
  useEffect(() => {
    const checkCacheStatus = async () => {
      try {
        const response = await fetch('/api/cache-status')
        const data = await response.json()
        setCacheStatus(data)
        setIsLoadingCache(false)
      } catch (error) {
        console.error('Failed to check cache status:', error)
        setIsLoadingCache(false)
      }
    }

    checkCacheStatus()
    const interval = setInterval(checkCacheStatus, 2000) // Check every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Chatbot สำหรับการเรียนรู้</h1>
          <p className="text-gray-600">เลือกวิชาและเนื้อหาที่ต้องการเรียนรู้</p>
          
          {/* Cache Status Indicator */}
          {cacheStatus && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {isLoadingCache ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : cacheStatus.isReady ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                  <span>
                    {isLoadingCache 
                      ? "กำลังตรวจสอบสถานะ..." 
                      : cacheStatus.isReady 
                        ? "พร้อมใช้งาน" 
                        : "กำลังโหลดเอกสาร..."
                    }
                  </span>
                </div>
                
                {cacheStatus.status.loading > 0 && (
                  <span className="text-blue-600">
                    กำลังโหลด: {cacheStatus.status.loading}
                  </span>
                )}
                
                {cacheStatus.status.ready > 0 && (
                  <span className="text-green-600">
                    พร้อมใช้งาน: {cacheStatus.status.ready}
                  </span>
                )}
                
                {cacheStatus.status.error > 0 && (
                  <span className="text-red-600">
                    เกิดข้อผิดพลาด: {cacheStatus.status.error}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject and Content Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  เลือกวิชา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectSelector
                  selectedSubject={selectedSubject}
                  onSubjectChange={handleSubjectChange}
                />
              </CardContent>
            </Card>

            {/* Content Selection */}
            {selectedSubject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    เลือกเนื้อหา
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentSelector
                    subject={currentSubject!}
                    selectedContent={selectedContent}
                    onContentChange={setSelectedContent}
                  />
                </CardContent>
              </Card>
            )}

            {/* Selected Info */}
            {selectedSubject && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">วิชา:</span> {currentSubject?.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">เนื้อหาที่เลือก:</span>{" "}
                      {selectedContent.length === 0 ? "ทั้งหมด" : `${selectedContent.length} หัวข้อ`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    แชทบอท AI
                    {selectedSubject && (
                      <span className="text-sm font-normal text-gray-500">- {currentSubject?.name}</span>
                    )}
                  </CardTitle>
                  {selectedSubject && (
                    <ClearHistoryButton
                      subjectId={selectedSubject}
                      onClear={handleClearHistory}
                      variant="outline"
                      size="sm"
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    {selectedSubject ? (
                      <p>เริ่มต้นการสนทนาด้วยการถามคำถามเกี่ยวกับ {currentSubject?.name}</p>
                    ) : (
                      <p>กรุณาเลือกวิชาก่อนเริ่มการสนทนา</p>
                    )}
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.parts
                          .filter(part => part.type === "text")
                          .map((part, idx) => (
                            <span key={idx}>
                              {message.role === "assistant" 
                                ? <FormattedMessage text={part.text} subject={selectedSubject as 'physics' | 'chemistry' | 'biology' | 'math'} />
                                : part.text
                              }
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        กำลังคิด...
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    if (!input.trim()) return
                    sendMessage(
                      { text: input },
                      {
                        body: {
                          subject: selectedSubject,
                          content: selectedContent,
                          sessionId: sessionId,
                        }
                      }
                    )
                    setInput("")
                  }}
                  className="flex w-full gap-2"
                >
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={selectedSubject ? `ถามคำถามเกี่ยวกับ ${currentSubject?.name}...` : "กรุณาเลือกวิชาก่อน..."}
                    disabled={isLoading || !selectedSubject || !cacheStatus?.isReady}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !selectedSubject || !input.trim() || !cacheStatus?.isReady}
                  >
                    ส่ง
                  </Button>
                </form>
                {!selectedSubject && <p className="text-sm text-gray-500 mt-2">กรุณาเลือกวิชาก่อนเริ่มแชท</p>}
                {selectedSubject && !cacheStatus?.isReady && (
                  <p className="text-sm text-yellow-600 mt-2">กำลังโหลดเอกสาร กรุณารอสักครู่...</p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
