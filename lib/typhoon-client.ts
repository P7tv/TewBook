// Typhoon API configuration
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY || "sk-VL6FVfEvqs8uY4fo5CfiKqnG6Wy2Kf2jwrXC3HQjGEPemPmR"
const TYPHOON_BASE_URL = "https://api.opentyphoon.ai/v1"

// Create a custom Typhoon client since AI SDK doesn't support custom baseURL
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

// Alternative implementation using custom fetch for Typhoon API
export async function typhoonChatCompletion(messages: any[], options: any = {}) {
  const response = await fetch(`${TYPHOON_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TYPHOON_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'typhoon-v2.1-12b-instruct',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
      top_p: options.topP || 0.9,
      repetition_penalty: options.repetitionPenalty || 1.1,
      stream: options.stream || false,
      ...options
    })
  })

  if (!response.ok) {
    throw new Error(`Typhoon API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Helper function to check if Typhoon is configured
export function isTyphoonConfigured(): boolean {
  return !!TYPHOON_API_KEY && TYPHOON_API_KEY.length > 10
}

// Export the configuration for reference
export const typhoonConfig = {
  apiKey: TYPHOON_API_KEY,
  baseURL: TYPHOON_BASE_URL,
  model: 'typhoon-v2.1-12b-instruct',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  repetitionPenalty: 1.1,
  requestTimeout: 60,
} 