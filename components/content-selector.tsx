"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Subject } from "@/lib/subjects-config"

interface ContentSelectorProps {
  subject: Subject
  selectedContent: string[]
  onContentChange: (contentIds: string[]) => void
}

export function ContentSelector({ subject, selectedContent, onContentChange }: ContentSelectorProps) {
  const handleContentToggle = (contentId: string) => {
    if (selectedContent.includes(contentId)) {
      onContentChange(selectedContent.filter((id) => id !== contentId))
    } else {
      onContentChange([...selectedContent, contentId])
    }
  }

  const handleSelectAll = () => {
    if (selectedContent.length === subject.contents.length) {
      onContentChange([])
    } else {
      onContentChange(subject.contents.map((content) => content.id))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">เนื้อหาในวิชา</span>
        <Button variant="ghost" size="sm" onClick={handleSelectAll}>
          {selectedContent.length === subject.contents.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
        </Button>
      </div>

      <div className="space-y-2">
        {subject.contents.map((content) => (
          <div key={content.id} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
            <Checkbox
              id={content.id}
              checked={selectedContent.includes(content.id)}
              onCheckedChange={() => handleContentToggle(content.id)}
            />
            <div className="flex-1">
              <label htmlFor={content.id} className="text-sm font-medium cursor-pointer">
                {content.name}
              </label>
              {content.description && <p className="text-xs text-gray-500 mt-1">{content.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {selectedContent.length === 0 && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">💡 ไม่ได้เลือกเนื้อหาใดจะใช้ข้อมูลทั้งหมดในวิชานี้</div>
      )}
    </div>
  )
}
