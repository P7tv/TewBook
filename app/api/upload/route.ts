import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/document-processor"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const results = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await processDocument(file.name, buffer)
      results.push(result)
    }

    return NextResponse.json({
      message: "Files processed successfully",
      filenames: results.map((r) => r.filename),
    })
  } catch (error) {
    console.error("Error processing files:", error)
    return NextResponse.json({ error: "Failed to process files" }, { status: 500 })
  }
}
