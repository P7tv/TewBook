# Troubleshooting Guide

## 🔍 **ปัญหาที่เกิดขึ้น**

### 1. **API Key Error**
```
[Error [AI_APICallError]: Incorrect API key provided: 3tLK2Wsd************************************************************************Yhph. You can find your API key at https://platform.openai.com/account/api-keys.]
```

**สาเหตุ:** ระบบยังคงใช้ OpenAI API แทนที่จะใช้ Typhoon API

**วิธีแก้ไข:** ✅ **แก้ไขแล้ว**
- เปลี่ยนจาก AI SDK เป็น custom Typhoon API client
- ใช้ `typhoonChatCompletion()` แทน `streamText()`

### 2. **TT Warnings**
```
Warning: TT: undefined function: 32
```

**สาเหตุ:** PDF parsing มีปัญหา (font หรือ encoding)

**วิธีแก้ไข:** ⚠️ **ไม่กระทบการทำงาน**
- เป็น warning เท่านั้น ไม่กระทบการทำงาน
- PDF ยังถูก parse ได้ปกติ

### 3. **AI SDK Compatibility**
```
Expected 1 arguments, but got 2.
```

**สาเหตุ:** AI SDK ไม่รองรับ custom baseURL

**วิธีแก้ไข:** ✅ **แก้ไขแล้ว**
- สร้าง custom Typhoon client
- ใช้ fetch API โดยตรง

### 4. **AI_TypeValidationError**
```
AI_TypeValidationError: Type validation failed: Value: {"text":"..."}
```

**สาเหตุ:** AI SDK คาดหวังรูปแบบ response ที่เฉพาะเจาะจง

**วิธีแก้ไข:** ✅ **แก้ไขแล้ว**
- ใช้รูปแบบ response ที่ถูกต้อง: `text-start`, `text-delta`, `text-end`
- ส่ง response ในรูปแบบที่ AI SDK ต้องการ

## 🔧 **การแก้ไขที่ทำแล้ว**

### 1. **อัปเดต Typhoon Client**
```typescript
// lib/typhoon-client.ts
export const typhoon = {
  id: "typhoon-v2.1-12b-instruct",
  generateText: async (prompt: string, options: any = {}) => {
    const response = await fetch(`${TYPHOON_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TYPHOON_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'typhoon-v2.1-12b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        top_p: options.topP || 0.9,
        repetition_penalty: options.repetitionPenalty || 1.1,
        stream: false,
      })
    })

    if (!response.ok) {
      throw new Error(`Typhoon API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { text: data.choices[0].message.content }
  }
}
```

### 2. **อัปเดต Chat API**
```typescript
// app/api/chat/route.ts
const response = await typhoonChatCompletion([
  {
    role: "system",
    content: systemPrompt,
  },
  {
    role: "user",
    content: userMessageText,
  }
], {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  repetitionPenalty: 1.1,
})
```

### 3. **อัปเดต Examples**
```typescript
// examples/typhoon-usage.ts
const response = await typhoonChatCompletion([
  {
    role: "system",
    content: "คุณคือ AI ผู้ช่วยที่ตอบคำถามเป็นภาษาไทย"
  },
  {
    role: "user",
    content: "สวัสดีครับ กรุณาอธิบายเรื่อง RAG"
  }
], {
  temperature: 0.7,
  maxTokens: 2048
})
```

### 4. **แก้ไข Response Format**
```typescript
// app/api/chat/route.ts
// Return streaming response in the correct format for AI SDK
const stream = new ReadableStream({
  start(controller) {
    // Send text-start
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-start", id: "1" })}\n\n`))
    
    // Send text-delta with the message
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-delta", id: "1", delta: assistantMessage })}\n\n`))
    
    // Send text-end
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-end", id: "1" })}\n\n`))
    
    controller.close()
  }
})
```

## ✅ **ผลลัพธ์**

### หลังจากแก้ไข:
- ✅ **ใช้ Typhoon API เท่านั้น**: ไม่ใช้ OpenAI อีกต่อไป
- ✅ **ไม่มี API Key Error**: ใช้ Typhoon API key ถูกต้อง
- ✅ **TypeScript Compilation ผ่าน**: ไม่มี errors
- ✅ **ระบบทำงานได้ปกติ**: สามารถถามคำถามได้
- ✅ **Response Format ถูกต้อง**: ใช้รูปแบบที่ AI SDK ต้องการ

### การทดสอบ:
1. **รัน development server**: `npm run dev`
2. **ทดสอบในเว็บ**: http://localhost:3000
3. **ถามคำถาม**: ระบบจะใช้ Typhoon API ตอบ
4. **ตรวจสอบ logs**: ดู console สำหรับ debugging

## 🚀 **พร้อมใช้งาน**

ระบบตอนนี้:
- ✅ ใช้ Typhoon API เท่านั้น
- ✅ ไม่มี API key errors
- ✅ TypeScript compilation ผ่าน
- ✅ ทำงานได้ปกติ

**🎉 ปัญหาได้รับการแก้ไขแล้ว!** 