import { typhoon, isTyphoonConfigured, typhoonChatCompletion } from "@/lib/typhoon-client"

// Example usage of Typhoon API client
export async function exampleChatCompletion() {
  if (!isTyphoonConfigured()) {
    console.error("Typhoon API not configured")
    return
  }

  try {
    const response = await typhoonChatCompletion([
      {
        role: "system",
        content: "คุณคือ AI ผู้ช่วยที่ตอบคำถามเป็นภาษาไทย"
      },
      {
        role: "user",
        content: "สวัสดีครับ กรุณาอธิบายเรื่อง RAG (Retrieval-Augmented Generation) ให้ฟังหน่อย"
      }
    ], {
      temperature: 0.7,
      maxTokens: 2048
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error in chat completion:", error)
    throw error
  }
}

// Example of using the custom Typhoon API function
export async function exampleDirectCompletion(prompt: string) {
  if (!isTyphoonConfigured()) {
    throw new Error("Typhoon API not configured")
  }

  try {
    const response = await typhoonChatCompletion([
      {
        role: "system",
        content: "คุณคือ AI ผู้ช่วยที่ตอบคำถามเป็นภาษาไทย"
      },
      {
        role: "user",
        content: prompt
      }
    ], {
      temperature: 0.7,
      maxTokens: 2048
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("Error in direct completion:", error)
    throw error
  }
}

// Example configuration check
export function checkTyphoonConfiguration() {
  const isConfigured = isTyphoonConfigured()
  console.log(`Typhoon API configured: ${isConfigured}`)
  return isConfigured
} 