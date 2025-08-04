export interface Content {
  id: string
  name: string
  description?: string
  pdfPath: string
}

export interface Subject {
  id: string
  name: string
  description: string
  contents: Content[]
}

export const subjects: Subject[] = [
  {
    id: "biology",
    name: "ชีววิทยา",
    description: "ศึกษาเกี่ยวกับสิ่งมีชีวิตและระบบชีวิต",
    contents: [
      {
        id: "bio-week1",
        name: "ชีววิทยา สัปดาห์ที่ 1",
        description: "เอกสารประกอบการสอนชีววิทยา week 1",
        pdfPath: "/documents/biology/Unit2_1_handout-890499-17540600024444.pdf",
      },
    ],
  },
  {
    id: "physics",
    name: "ฟิสิกส์",
    description: "ศึกษาเกี่ยวกับธรรมชาติและปรากฏการณ์ทางกายภาพ",
    contents: [
      {
        id: "physics-ch01",
        name: "ฟิสิกส์ บทที่ 1",
        description: "เอกสารประกอบการสอนฟิสิกส์ บทที่ 1",
        pdfPath: "/documents/physic/Ch01SW04-809347-16914704543616.pdf",
      },
    ],
  },
]
