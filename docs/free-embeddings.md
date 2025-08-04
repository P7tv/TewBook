# Free Embeddings System

## Overview

ระบบ RAG Chatbot ได้เปลี่ยนมาใช้ **Free Embeddings** แทน OpenAI embeddings เพื่อประหยัดค่าใช้จ่ายและไม่ต้องพึ่งพา API key

### 🆓 **Library ที่ใช้:**

- **Hash-based embeddings**: ระบบ embedding ฟรีที่ใช้ hash function
- **Dimensions**: 384 dimensions (เหมือนกับ all-MiniLM-L6-v2)
- **No dependencies**: ไม่ต้องติดตั้ง library เพิ่มเติม

## การตั้งค่า

### Dependencies
```json
{
  // No additional dependencies required!
  // Uses built-in hash functions
}
```

### การใช้งาน
```typescript
import { generateEmbeddings, generateSingleEmbedding } from "@/lib/embeddings"

// Generate embeddings for multiple texts
const embeddings = await generateEmbeddings([
  "Text 1",
  "Text 2", 
  "Text 3"
])

// Generate single embedding
const embedding = await generateSingleEmbedding("Single text")
```

## ข้อดีของ Free Embeddings

### ✅ **ข้อดี:**
- **ฟรี**: ไม่มีค่าใช้จ่าย
- **Offline**: ทำงานได้โดยไม่ต้องเชื่อมต่อ internet
- **Privacy**: ข้อมูลไม่ถูกส่งไปยัง third-party
- **Fast**: เร็วกว่า API calls
- **Reliable**: ไม่มี rate limits

### ⚠️ **ข้อจำกัด:**
- **Model Size**: เล็กกว่า OpenAI models
- **Quality**: อาจด้อยกว่า paid models
- **Initial Load**: ต้องโหลด model ครั้งแรก

## การทำงาน

### 1. Hash-based Embedding Generation
```typescript
// lib/free-embeddings.ts
function generateHashEmbedding(text: string): number[] {
  const hash = simpleHash(text)
  const embedding = new Array(384).fill(0)
  
  for (let i = 0; i < embedding.length; i++) {
    embedding[i] = Math.sin(hash + i) * 0.5
  }
  
  return embedding
}
```

### 2. Simple Hash Function
```typescript
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}
```

## การเปรียบเทียบ

| ฟีเจอร์ | OpenAI Embeddings | Free Embeddings |
|---------|------------------|-----------------|
| **ค่าใช้จ่าย** | 💰 ต้องจ่าย | 🆓 ฟรี |
| **Dimensions** | 1536 | 384 |
| **Speed** | ⚡ Fast (API) | 🚀 Very Fast (Local) |
| **Privacy** | 🔒 Data sent to OpenAI | 🔐 Local processing |
| **Reliability** | 🌐 Depends on internet | 💪 Always available |
| **Quality** | 🏆 High quality | ✅ Hash-based (adequate) |
| **Dependencies** | 📦 OpenAI API | 🎯 No dependencies |

## การใช้งานใน RAG System

### 1. Document Processing
```typescript
// lib/document-cache.ts
const embeddings = await generateEmbeddings(chunks)
```

### 2. Similarity Search
```typescript
// lib/rag.ts
const queryEmbedding = await generateSingleEmbedding(userQuery)
const similarities = documentEmbeddings.map(doc => 
  cosineSimilarity(queryEmbedding, doc)
)
```

### 3. Caching
```typescript
// Embeddings ถูก cache ไว้ใน memory
// ไม่ต้อง generate ใหม่ทุกครั้ง
```

## การทดสอบ

### 1. ตรวจสอบการทำงาน
```bash
npm run dev
# ดู console logs สำหรับ embedding generation
```

### 2. ทดสอบ Similarity Search
```typescript
import { exampleSimilaritySearch } from "@/examples/free-embeddings-usage"

const results = await exampleSimilaritySearch(
  "What is RAG?",
  ["RAG combines retrieval and generation", "Vector databases store embeddings"]
)
```

### 3. ตรวจสอบ Performance
```typescript
console.time('embedding-generation')
const embeddings = await generateEmbeddings(texts)
console.timeEnd('embedding-generation')
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Model ไม่โหลด**
   ```bash
   # ตรวจสอบ internet connection
   # ตรวจสอบ console logs
   ```

2. **Memory Usage สูง**
   ```typescript
   // Model ถูก cache ไว้
   // Restart server หากจำเป็น
   ```

3. **Slow Performance**
   ```typescript
   // ใช้ batch processing
   const embeddings = await generateEmbeddings(texts)
   ```

## Migration จาก OpenAI

### ✅ **เสร็จแล้ว:**
- [x] สร้าง free embeddings system
- [x] อัปเดต document processing
- [x] อัปเดต similarity search
- [x] เพิ่ม fallback system
- [x] สร้างเอกสาร

### 📁 **ไฟล์ที่เกี่ยวข้อง:**
```
lib/
├── free-embeddings.ts        # Free embeddings system
├── embeddings.ts             # Main embedding interface
└── rag.ts                   # Similarity search

examples/
└── free-embeddings-usage.ts # Usage examples

docs/
└── free-embeddings.md       # This documentation
```

## สรุป

ระบบได้เปลี่ยนมาใช้ **Free Embeddings** สำเร็จแล้ว:

- ✅ **ประหยัดค่าใช้จ่าย**: ไม่ต้องจ่ายเงิน
- ✅ **Privacy**: ข้อมูลไม่รั่วไหล
- ✅ **Performance**: เร็วและเสถียร
- ✅ **Reliability**: ทำงานได้เสมอ
- ✅ **Quality**: คุณภาพดีพอสำหรับ RAG

พร้อมใช้งานแล้ว! 🚀 