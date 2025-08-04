# การตั้งค่า RAG Chatbot

## การติดตั้ง Dependencies

```bash
npm install
# หรือ
pnpm install
```

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจค:

```env
# OpenAI API Configuration
# รับ API key ได้จาก: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom OpenAI API Base URL (สำหรับ Azure OpenAI หรือ providers อื่นๆ)
# OPENAI_API_BASE=https://your-custom-endpoint.openai.azure.com/

# Optional: Model configuration
# OPENAI_MODEL=gpt-4o-mini

# Optional: Embeddings model
# OPENAI_EMBEDDINGS_MODEL=text-embedding-3-small

# Optional: Maximum tokens for responses
# MAX_TOKENS=4000

# Optional: Temperature for response creativity (0.0 to 2.0)
# TEMPERATURE=0.7
```

## การรันแอปพลิเคชัน

### Development Mode
```bash
npm run dev
# หรือ
pnpm dev
```

### Production Build
```bash
npm run build
npm start
# หรือ
pnpm build
pnpm start
```

## การแก้ไขปัญหา

### 1. PDF Parsing Error
หากเกิดปัญหาเกี่ยวกับ PDF parsing:
- ตรวจสอบว่าไฟล์ PDF ไม่เสียหาย
- ระบบจะใช้ fallback content แทน
- ตรวจสอบ console logs สำหรับรายละเอียดข้อผิดพลาด

### 2. OpenAI API Key Error
หากไม่มีการตั้งค่า API key:
- ระบบจะแสดงข้อความแจ้งเตือน
- ฟีเจอร์ AI chat จะไม่ทำงาน
- ระบบจะยังคงโหลดเอกสารได้

### 3. Cache Status Error
หากไม่สามารถเชื่อมต่อกับ cache:
- ตรวจสอบว่าเซิร์ฟเวอร์ทำงานปกติ
- ตรวจสอบ network connection
- ลองรีเฟรชหน้าเว็บ

## โครงสร้างไฟล์

```
rag-chatbot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
├── lib/                  # Utility libraries
├── public/               # Static files
│   └── documents/        # PDF documents
└── package.json
```

## การเพิ่มเอกสารใหม่

1. เพิ่มไฟล์ PDF ใน `public/documents/[subject]/`
2. อัปเดต `lib/subjects-config.ts` เพื่อเพิ่มวิชาและเนื้อหาใหม่
3. รีสตาร์ทเซิร์ฟเวอร์เพื่อโหลดเอกสารใหม่

## การปรับแต่ง

### การเปลี่ยนธีม
แก้ไขไฟล์ `app/globals.css` เพื่อปรับแต่งสีและสไตล์

### การเพิ่มวิชาใหม่
แก้ไขไฟล์ `lib/subjects-config.ts` เพื่อเพิ่มวิชาและเนื้อหาใหม่

### การปรับแต่ง AI Model
แก้ไข environment variables เพื่อเปลี่ยน model หรือ provider 