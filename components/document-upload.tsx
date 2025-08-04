"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, Loader2 } from "lucide-react"

interface DocumentUploadProps {
  onUploadComplete: () => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadedFiles((prev) => [...prev, ...result.filenames])
        onUploadComplete()
      } else {
        console.error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-4">อัปโหลดไฟล์ PDF, TXT หรือ DOCX</p>
        <Input
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        <Button asChild variant="outline" disabled={isUploading} className="cursor-pointer bg-transparent">
          <label htmlFor="file-upload">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                กำลังอัปโหลด...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                เลือกไฟล์
              </>
            )}
          </label>
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">ไฟล์ที่อัปโหลดแล้ว:</h4>
          {uploadedFiles.map((filename, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              {filename}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
