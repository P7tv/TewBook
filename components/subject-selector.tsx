"use client"

import { Button } from "@/components/ui/button"
import { subjects } from "@/lib/subjects-config"

interface SubjectSelectorProps {
  selectedSubject: string
  onSubjectChange: (subjectId: string) => void
}

export function SubjectSelector({ selectedSubject, onSubjectChange }: SubjectSelectorProps) {
  return (
    <div className="space-y-2">
      {subjects.map((subject) => (
        <Button
          key={subject.id}
          variant={selectedSubject === subject.id ? "default" : "outline"}
          className="w-full justify-start text-left h-auto p-3"
          onClick={() => onSubjectChange(subject.id)}
        >
          <div>
            <div className="font-medium">{subject.name}</div>
            <div className="text-sm opacity-70">{subject.description}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
