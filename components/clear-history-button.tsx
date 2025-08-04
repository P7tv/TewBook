"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { clientChatHistory } from "@/lib/client-chat-history"

interface ClearHistoryButtonProps {
  subjectId?: string
  onClear?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ClearHistoryButton({ 
  subjectId, 
  onClear, 
  variant = 'outline',
  size = 'sm',
  className = ''
}: ClearHistoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClear = () => {
    if (subjectId) {
      clientChatHistory.clearSubjectHistory(subjectId)
    } else {
      clientChatHistory.clearAllHistory()
    }
    onClear?.()
    setIsOpen(false)
  }

  const getTitle = () => {
    if (subjectId) {
      return "ล้างประวัติวิชานี้"
    }
    return "ล้างประวัติทั้งหมด"
  }

  const getDescription = () => {
    if (subjectId) {
      return "คุณแน่ใจหรือไม่ที่จะล้างประวัติการสนทนาของวิชานี้? การดำเนินการนี้ไม่สามารถยกเลิกได้"
    }
    return "คุณแน่ใจหรือไม่ที่จะล้างประวัติการสนทนาทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้"
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`text-red-600 hover:text-red-700 ${className}`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          ล้างประวัติ
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700"
          >
            ล้างประวัติ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 