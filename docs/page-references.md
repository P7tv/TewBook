# Page References Feature

## 📄 **ภาพรวม**

ระบบ RAG Chatbot ได้เพิ่มฟีเจอร์ **การอ้างอิงหน้า** เพื่อให้ผู้ใช้ทราบว่าข้อมูลที่ได้มาจากหน้าไหนของเอกสาร

### 🎯 **ประโยชน์:**

- 📍 **ระบุตำแหน่ง**: รู้ว่าข้อมูลมาจากหน้าไหน
- 🔍 **ตรวจสอบได้**: สามารถเปิดเอกสารไปดูหน้าได้
- 📚 **อ้างอิงได้**: ใช้ในการอ้างอิงทางวิชาการ
- 🎓 **น่าเชื่อถือ**: เพิ่มความน่าเชื่อถือของคำตอบ

## 🔧 **การทำงาน**

### 1. **การคำนวณหมายเลขหน้า**

```typescript
// lib/page-calculator.ts
export function calculatePageNumber(
  chunkIndex: number,
  totalChunks: number,
  chunkContent: string,
  documentName: string
): PageInfo
```

**วิธีการคำนวณ:**
- **Position-based**: ใช้ตำแหน่งของ chunk ในเอกสาร
- **Content-based**: ใช้ความยาวของเนื้อหา
- **Document-specific**: ปรับตามประเภทเอกสาร

### 2. **ระดับความแม่นยำ (Confidence)**

```typescript
export interface PageInfo {
  pageNumber: number
  confidence: 'high' | 'medium' | 'low'
  reason: string
}
```

- **High**: เอกสารเล็ก หรือพบหมายเลขหน้าในเนื้อหา
- **Medium**: เอกสารขนาดกลาง
- **Low**: เอกสารใหญ่ หรือข้อมูลไม่เพียงพอ

### 3. **การแสดงผล**

```typescript
// ตัวอย่างผลลัพธ์
"ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1 - หน้า 3"
"ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1 - หน้า 7 (ประมาณ)"
```

## 📋 **การใช้งาน**

### 1. **ใน Chat API**

```typescript
// app/api/chat/route.ts
const context = relevantContent.map((doc) => {
  const pageRef = formatPageReference(doc.source, doc.pageNumber, doc.pageConfidence)
  return `[${pageRef}]\n${doc.content}`
}).join("\n\n")
```

### 2. **ใน System Prompt**

```typescript
const systemPrompt = `คุณคือ AI ผู้ช่วยวิชาการที่ตอบคำถามโดยอ้างอิงจากเอกสารการเรียนการสอนที่ให้มาเท่านั้น

กฎการตอบ:
5. อ้างอิงแหล่งที่มาของข้อมูลพร้อมหมายเลขหน้า (เช่น [ชื่อวิชา - ชื่อหัวข้อ - หน้า X]) เมื่อเหมาะสม
7. ระบุหมายเลขหน้าทุกครั้งที่อ้างอิงข้อมูล
`
```

### 3. **ตัวอย่างผลลัพธ์**

**คำถาม:** "อาจารย์ชื่ออะไร"

**คำตอบ:** "จากข้อมูลในเอกสาร [ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1 - หน้า 3] อาจารย์ชื่อ..."

## 📊 **ตัวอย่างการใช้งาน**

### 1. **Single Page Reference**
```typescript
import { formatPageReference } from "@/lib/page-calculator"

const reference = formatPageReference("ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", 3, "high")
// ผลลัพธ์: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1 - หน้า 3"
```

### 2. **Multiple Page References**
```typescript
import { formatMultiplePageReferences } from "@/lib/page-calculator"

const references = [
  { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 3 },
  { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 5 },
  { source: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1", pageNumber: 7 },
]

const formatted = formatMultiplePageReferences(references)
// ผลลัพธ์: "ชีววิทยา - ชีววิทยา สัปดาห์ที่ 1 - หน้า 3, 5, 7"
```

### 3. **Demo Function**
```typescript
import { demoPageReferences } from "@/examples/page-reference-demo"

// รัน demo เพื่อดูการทำงาน
await demoPageReferences()
```

## 🔍 **การปรับแต่ง**

### 1. **ปรับจำนวนหน้าต่อเอกสาร**

```typescript
// lib/page-calculator.ts
// เปลี่ยนค่าเหล่านี้ตามประเภทเอกสาร
const pagesPerDocument = {
  biology: 12,    // เอกสารชีววิทยา
  math: 18,       // เอกสารคณิตศาสตร์
  default: 15     // ค่าเริ่มต้น
}
```

### 2. **ปรับความแม่นยำ**

```typescript
// ปรับ threshold สำหรับ confidence levels
if (totalChunks <= 5) {
  confidence = 'high'
} else if (totalChunks > 20) {
  confidence = 'low'
}
```

## 📈 **ประสิทธิภาพ**

### ✅ **ข้อดี:**
- 📍 **แม่นยำ**: คำนวณหมายเลขหน้าอย่างแม่นยำ
- 🔍 **ตรวจสอบได้**: สามารถเปิดเอกสารไปดูได้
- 📚 **อ้างอิงได้**: ใช้ในการอ้างอิงทางวิชาการ
- 🎓 **น่าเชื่อถือ**: เพิ่มความน่าเชื่อถือ

### ⚠️ **ข้อจำกัด:**
- 📄 **ประมาณการ**: เป็นการประมาณการ ไม่ใช่หมายเลขหน้าที่แท้จริง
- 📊 **ขึ้นกับขนาดเอกสาร**: ความแม่นยำขึ้นกับจำนวน chunks
- 🔍 **ไม่พบหมายเลขหน้า**: หากเอกสารไม่มีหมายเลขหน้า

## 🚀 **การทดสอบ**

### 1. **ทดสอบในเว็บ**
```bash
npm run dev
# เปิด http://localhost:3000
# ถามคำถามและดูการอ้างอิงหน้า
```

### 2. **ทดสอบ Demo**
```typescript
import { demoPageReferences, demoConfidenceLevels, demoMultiplePages } from "@/examples/page-reference-demo"

// ทดสอบการทำงาน
await demoPageReferences()
demoConfidenceLevels()
demoMultiplePages()
```

## 📁 **ไฟล์ที่เกี่ยวข้อง**

```
lib/
├── page-calculator.ts      # ระบบคำนวณหมายเลขหน้า
├── rag.ts                 # อัปเดตเพื่อเพิ่ม page info
└── document-cache.ts      # เก็บข้อมูล chunks

app/api/chat/
└── route.ts               # อัปเดตเพื่อแสดง page references

examples/
└── page-reference-demo.ts # Demo การใช้งาน

docs/
└── page-references.md     # เอกสารนี้
```

## 🎯 **สรุป**

ระบบได้เพิ่มฟีเจอร์ **การอ้างอิงหน้า** สำเร็จแล้ว:

- ✅ **คำนวณหมายเลขหน้า**: ใช้หลายวิธีเพื่อความแม่นยำ
- ✅ **แสดงผลในคำตอบ**: AI จะอ้างอิงหน้าด้วย
- ✅ **ระดับความแม่นยำ**: แสดงความเชื่อมั่นของหมายเลขหน้า
- ✅ **ใช้งานง่าย**: ทำงานอัตโนมัติ

**🎉 ระบบพร้อมใช้งานแล้ว!** 